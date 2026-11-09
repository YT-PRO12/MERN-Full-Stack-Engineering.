import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('product prices accept both documented integer bounds', async () => {
  const app = createProductApp();
  for (const price of [0, 100000]) {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Synthetic Item', price });
    assert.equal(response.status, 201);
    assert.equal(response.body.item.price, price);
  }
  const listed = await request(app).get('/api/products');
  assert.equal(listed.body.items.length, 2);
});

test('out-of-range, fractional and string prices are rejected', async () => {
  const app = createProductApp();
  for (const price of [-1, 100001, 1.5, '100']) {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Synthetic Item', price });
    assert.equal(response.status, 400);
  }
  const listed = await request(app).get('/api/products');
  assert.deepEqual(listed.body, { items: [] });
});
