import { randomBytes, createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Session, User } from './models.js';
const derive = promisify(scrypt);
export const cookieName = 'campus_session';
const duration = 7 * 24 * 60 * 60 * 1000;
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `${salt}:${key.toString('hex')}`;
}
export async function checkPassword(password, stored) {
  const [salt, encoded] = stored.split(':');
  const key = await derive(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const expected = Buffer.from(encoded, 'hex');
  return key.length === expected.length && timingSafeEqual(key, expected);
}
export function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}
export function publicUser(user) {
  return { id: String(user._id), name: user.name };
}
export function cookieOptions(production) {
  return { httpOnly: true, secure: production, sameSite: 'lax', path: '/api' };
}
export function sessionToken(cookies) {
  const token = cookies?.[cookieName];
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token) ? token : null;
}
export async function createSession(req, res, user, production) {
  const previous = sessionToken(req.cookies);
  if (previous) await Session.deleteOne({ tokenHash: tokenHash(previous) });
  const token = randomBytes(32).toString('hex');
  await Session.create({
    tokenHash: tokenHash(token),
    user: user._id,
    expiresAt: new Date(Date.now() + duration),
  });
  res.cookie(cookieName, token, { ...cookieOptions(production), maxAge: duration });
}
export async function requireUser(req, res, next) {
  const token = sessionToken(req.cookies);
  if (!token)
    return res
      .status(401)
      .json({ error: { code: 'UNAUTHENTICATED', message: 'Please sign in to continue.' } });
  const session = await Session.findOne({
    tokenHash: tokenHash(token),
    expiresAt: { $gt: new Date() },
  });
  const user = session && (await User.findById(session.user));
  if (!user)
    return res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Your session has expired. Please sign in again.',
      },
    });
  req.user = user;
  next();
}
