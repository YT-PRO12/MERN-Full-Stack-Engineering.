import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { User, Session, Listing } from './models.js';
import {
  registration,
  login,
  listingFields,
  listingUpdate,
  listingQuery,
  objectId,
  parse,
} from './validation.js';
import {
  hashPassword,
  checkPassword,
  publicUser,
  createSession,
  requireUser,
  cookieName,
  cookieOptions,
  tokenHash,
} from './auth.js';
import { HttpError, publicListing, findListings, updateListing } from './listings.js';
export function createApp({
  clientOrigin = 'http://localhost:5173',
  production = false,
  authLimit = 20,
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cookieParser());
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(
    '/api',
    rateLimit({
      windowMs: 60000,
      limit: 180,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again shortly.' },
      },
    }),
  );
  app.use((req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== clientOrigin) {
      return res
        .status(403)
        .json({ error: { code: 'ORIGIN_REJECTED', message: 'Request origin is not allowed.' } });
    }
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/health', (_req, res) =>
    res
      .status(mongoose.connection.readyState === 1 ? 200 : 503)
      .json({ ready: mongoose.connection.readyState === 1 }),
  );
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: authLimit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      error: { code: 'RATE_LIMITED', message: 'Too many sign-in attempts. Try again later.' },
    },
  });
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    const input = parse(registration, req.body);
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
    });
    await createSession(req, res, user, production);
    res.status(201).json({ user: publicUser(user) });
  });
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const input = parse(login, req.body);
    const user = await User.findOne({ email: input.email }).select('+passwordHash');
    if (!user || !(await checkPassword(input.password, user.passwordHash)))
      throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    await createSession(req, res, user, production);
    res.json({ user: publicUser(user) });
  });
  app.post('/api/auth/logout', async (req, res) => {
    if (req.cookies[cookieName])
      await Session.deleteOne({ tokenHash: tokenHash(req.cookies[cookieName]) });
    res.clearCookie(cookieName, cookieOptions(production));
    res.sendStatus(204);
  });
  app.get('/api/auth/me', requireUser, (req, res) => res.json({ user: publicUser(req.user) }));
  app.get('/api/listings', async (req, res) =>
    res.json(await findListings(parse(listingQuery, req.query))),
  );
  app.get('/api/my/listings', requireUser, async (req, res) =>
    res.json(await findListings(parse(listingQuery, req.query), req.user._id)),
  );
  app.get('/api/listings/:id', async (req, res) => {
    const item = await Listing.findById(parse(objectId, req.params.id)).populate('owner', 'name');
    if (!item) throw new HttpError(404, 'NOT_FOUND', 'Listing not found.');
    res.json({ item: publicListing(item) });
  });
  app.post('/api/listings', requireUser, async (req, res) => {
    const item = await Listing.create({ ...parse(listingFields, req.body), owner: req.user._id });
    await item.populate('owner', 'name');
    res.status(201).json({ item: publicListing(item) });
  });
  app.patch('/api/listings/:id', requireUser, async (req, res) =>
    res.json({
      item: await updateListing(
        parse(objectId, req.params.id),
        req.user._id,
        parse(listingUpdate, req.body),
      ),
    }),
  );
  app.use((_req, _res, next) => next(new HttpError(404, 'NOT_FOUND', 'Endpoint not found.')));
  app.use((error, _req, res, _next) => {
    if (error instanceof ZodError)
      return res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: 'Check the submitted fields.',
          fields: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
      });
    if (error.code === 11000)
      return res.status(409).json({
        error: { code: 'DUPLICATE', message: 'That account already exists. Try signing in.' },
      });
    if (error.type === 'entity.parse.failed')
      return res
        .status(400)
        .json({ error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } });
    if (error.type === 'entity.too.large')
      return res
        .status(413)
        .json({ error: { code: 'BODY_TOO_LARGE', message: 'Request body is too large.' } });
    if (error instanceof HttpError)
      return res.status(error.status).json({ error: { code: error.code, message: error.message } });
    console.error('Unhandled API error:', error.name);
    res
      .status(500)
      .json({ error: { code: 'INTERNAL', message: 'Something went wrong. Please try again.' } });
  });
  return app;
}
