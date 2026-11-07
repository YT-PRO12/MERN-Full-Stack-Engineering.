import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('oversized JSON body is rejected with an explicit 413', async () => {
  const app = createProductApp();
  const response = await request(app)
    .post('/api/products')
    .send({ name: 'X'.repeat(10_000), price: 100 });
  assert.equal(response.status, 413);
  assert.deepEqual(response.body, { error: 'Request body is too large' });
  const listed = await request(app).get('/api/products');
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.body, { items: [] });
});
