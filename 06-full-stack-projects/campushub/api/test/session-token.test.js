import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { sessionToken } from '../src/auth.js';
import { createApp } from '../src/app.js';
test('only canonical session tokens reach hashing and database lookup', () => {
  for (const value of [null, {}, [], ['a'.repeat(64)], 123, '', 'a'.repeat(63), 'A'.repeat(64)])
    assert.equal(sessionToken({ campus_session: value }), null);
  assert.equal(sessionToken(undefined), null);
  assert.equal(sessionToken({ campus_session: 'a'.repeat(64) }), 'a'.repeat(64));
});
test('JSON cookies cannot turn unauthenticated requests or logout into server errors', async () => {
  const app = createApp();
  for (const value of ['j:{}', 'j:[]', 'j:123', 'j:[1]']) {
    const cookie = 'campus_session=' + encodeURIComponent(value);
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401);
    await request(app)
      .post('/api/auth/logout')
      .set('Origin', 'http://localhost:5173')
      .set('Cookie', cookie)
      .expect(204);
  }
});
