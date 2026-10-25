import { before, beforeEach, after, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User, Listing, Session, initializeIndexes } from '../src/models.js';
import { seedDemo } from '../src/seed.js';
const origin = 'http://localhost:5173';
const password = 'LocalTestPassword123!';
const fields = {
  title: 'Algorithms textbook',
  description: 'A clean textbook for the next semester.',
  price: 350,
  category: 'books',
  condition: 'good',
  location: 'Library entrance',
};
let mongo;
let app;
before(async () => {
  mongo = await MongoMemoryServer.create({ instance: { args: ['--nounixsocket'] } });
  await mongoose.connect(mongo.getUri(), { dbName: 'campushub_test' });
  await initializeIndexes();
});
beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Session.deleteMany({}), Listing.deleteMany({})]);
  app = createApp({ authLimit: 100 });
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
async function register(email = 'one@example.test') {
  const agent = request.agent(app);
  const result = await agent
    .post('/api/auth/register')
    .set('Origin', origin)
    .send({ name: 'Test Student', email, password })
    .expect(201);
  return { agent, result };
}
async function create(agent, body = fields) {
  return (await agent.post('/api/listings').set('Origin', origin).send(body).expect(201)).body.item;
}
function patch(agent, item, changes) {
  return agent
    .patch(`/api/listings/${item.id}`)
    .set('Origin', origin)
    .send({ version: item.version, ...changes });
}
test('registers with hashed credentials and safe cookie; logout invalidates the session', async () => {
  const { agent, result } = await register();
  assert.match(result.headers['set-cookie'][0], /HttpOnly/);
  assert.match(result.headers['set-cookie'][0], /SameSite=Lax/);
  assert.equal(result.body.user.passwordHash, undefined);
  assert.equal(result.body.user.email, undefined);
  const user = await User.findOne().select('+passwordHash');
  assert.notEqual(user.passwordHash, password);
  const token = result.headers['set-cookie'][0].split(';')[0];
  const session = await Session.findOne();
  assert.notEqual(session.tokenHash, token.split('=')[1]);
  await agent.get('/api/auth/me').expect(200);
  await agent.post('/api/auth/logout').set('Origin', origin).expect(204);
  await request(app).get('/api/auth/me').set('Cookie', token).expect(401);
});
test('normalizes email and handles duplicates and incorrect passwords', async () => {
  await register('ONE@example.test');
  await request(app)
    .post('/api/auth/register')
    .set('Origin', origin)
    .send({ name: 'Another', email: 'one@example.test', password })
    .expect(409);
  await request(app)
    .post('/api/auth/login')
    .set('Origin', origin)
    .send({ email: 'one@example.test', password: 'WrongPassword123!' })
    .expect(401);
  await request(app)
    .post('/api/auth/login')
    .set('Origin', origin)
    .send({ email: 'ONE@example.test', password })
    .expect(200);
});
test('rejects missing or foreign origins before changing state', async () => {
  for (const supplied of ['', 'https://untrusted.example']) {
    const operation = request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Student', email: 'test@example.test', password });
    if (supplied) operation.set('Origin', supplied);
    await operation.expect(403);
  }
  assert.equal(await User.countDocuments(), 0);
});
test('checks session expiration even before the TTL cleaner runs', async () => {
  const { agent } = await register();
  await Session.updateMany({}, { $set: { expiresAt: new Date(0) } });
  await agent.get('/api/auth/me').expect(401);
});
test('protects creation and prevents ownership spoofing', async () => {
  await request(app).post('/api/listings').set('Origin', origin).send(fields).expect(401);
  const { agent } = await register();
  await agent
    .post('/api/listings')
    .set('Origin', origin)
    .send({ ...fields, owner: new mongoose.Types.ObjectId() })
    .expect(400);
  for (const price of [-1, 1.5, '350', null])
    await agent
      .post('/api/listings')
      .set('Origin', origin)
      .send({ ...fields, price })
      .expect(400);
  const item = await create(agent, { ...fields, price: 0 });
  assert.equal(item.price, 0);
});
test('prevents cross-user edits and separates dashboards', async () => {
  const first = await register();
  const second = await register('two@example.test');
  const item = await create(first.agent);
  await patch(second.agent, item, { title: 'Stolen listing' }).expect(404);
  assert.equal((await second.agent.get('/api/my/listings').expect(200)).body.total, 0);
  assert.equal((await first.agent.get('/api/my/listings').expect(200)).body.total, 1);
  assert.equal((await Listing.findById(item.id)).title, fields.title);
});
test('allows reserve and release; sold is a terminal state', async () => {
  const { agent } = await register();
  let item = await create(agent);
  item = (await patch(agent, item, { status: 'reserved' }).expect(200)).body.item;
  item = (await patch(agent, item, { status: 'active' }).expect(200)).body.item;
  item = (await patch(agent, item, { status: 'sold' }).expect(200)).body.item;
  await patch(agent, item, { status: 'active' }).expect(409);
  await patch(agent, item, { title: 'Edited after sale' }).expect(409);
});
test('atomic version checks accept exactly one of two competing edits', async () => {
  const { agent } = await register();
  const item = await create(agent);
  const results = await Promise.all([
    patch(agent, item, { price: 100 }),
    patch(agent, item, { price: 200 }),
  ]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
  assert.equal((await Listing.findById(item.id)).__v, 1);
});
test('filters and paginates; search treats regular expression symbols literally', async () => {
  const { agent } = await register();
  await create(agent);
  await create(agent, { ...fields, title: 'C++ [guide]', category: 'electronics' });
  const page = (await request(app).get('/api/listings?limit=1&page=1').expect(200)).body;
  assert.equal(page.total, 2);
  assert.equal(page.items.length, 1);
  assert.equal(page.pages, 2);
  assert.equal((await request(app).get('/api/listings?q=%5Bguide%5D').expect(200)).body.total, 1);
  assert.equal((await request(app).get('/api/listings?category=books').expect(200)).body.total, 1);
  for (const query of ['page=0', 'limit=100', 'category=bad', 'q[$ne]=x'])
    await request(app).get(`/api/listings?${query}`).expect(400);
});
test('uses safe errors for malformed identifiers, JSON and oversized bodies', async () => {
  const { agent } = await register();
  await request(app).get('/api/listings/not-an-id').expect(400);
  await request(app).get(`/api/listings/${new mongoose.Types.ObjectId()}`).expect(404);
  await agent
    .post('/api/listings')
    .set('Origin', origin)
    .set('Content-Type', 'application/json')
    .send('{')
    .expect(400);
  await agent
    .post('/api/listings')
    .set('Origin', origin)
    .send({ ...fields, description: 'x'.repeat(20000) })
    .expect(413);
});
test('limits authentication requests and sets secure cookies in production', async () => {
  const limited = createApp({ authLimit: 1, production: true });
  const result = await request(limited)
    .post('/api/auth/register')
    .set('Origin', origin)
    .send({ name: 'Test Student', email: 'safe@example.test', password })
    .expect(201);
  assert.match(result.headers['set-cookie'][0], /Secure/);
  await request(limited)
    .post('/api/auth/login')
    .set('Origin', origin)
    .send({ email: 'safe@example.test', password })
    .expect(429);
});
test('seed is idempotent and preserves edited demo records', async () => {
  await seedDemo(password);
  const item = await Listing.findOne();
  item.title = 'Preserve this edit';
  await item.save();
  await seedDemo(password);
  assert.equal(await Listing.countDocuments(), 6);
  assert.equal(await User.countDocuments(), 1);
  assert.equal((await Listing.findById(item._id)).title, 'Preserve this edit');
});
