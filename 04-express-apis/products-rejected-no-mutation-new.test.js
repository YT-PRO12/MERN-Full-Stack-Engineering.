import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('malformed creation leaves existing catalog unchanged', async () => {
  const app = createProductApp();
  const created = await request(app).post('/api/products').send({ name: 'Notebook', price: 25 });
  assert.equal(created.status, 201);

  const rejected = await request(app).post('/api/products').send({ name: 'Invalid', price: -10 });
  assert.equal(rejected.status, 400);

  const listed = await request(app).get('/api/products');
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.body.items, [created.body.item]);
});
