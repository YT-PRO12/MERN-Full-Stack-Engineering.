import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('public product responses do not advertise the Express framework', async () => {
  const app = createProductApp();
  const list = await request(app).get('/api/products');
  const missing = await request(app).get('/api/products/not-present');
  const created = await request(app).post('/api/products').send({
    name: 'Synthetic Notebook',
    price: 250,
  });

  for (const response of [list, missing, created]) {
    assert.equal(response.headers['x-powered-by'], undefined);
  }
  assert.equal(list.status, 200);
  assert.equal(missing.status, 404);
  assert.equal(created.status, 201);
});
