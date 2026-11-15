import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('unknown endpoints and missing products return stable JSON errors', async () => {
  const app = createProductApp();
  const created = await request(app)
    .post('/api/products')
    .send({ name: 'Synthetic Laptop', price: 200 });
  assert.equal(created.status, 201);

  const missing = await request(app).get('/api/products/not-a-valid-id');
  const unknown = await request(app).get('/api/unknown');
  assert.equal(missing.status, 404);
  assert.equal(unknown.status, 404);
  assert.deepEqual(missing.body, { error: 'Product not found' });
  assert.deepEqual(unknown.body, { error: 'Endpoint not found' });
  assert.match(missing.headers['content-type'], /application\/json/);

  const listed = await request(app).get('/api/products');
  assert.deepEqual(listed.body.items, [created.body.item]);
});
