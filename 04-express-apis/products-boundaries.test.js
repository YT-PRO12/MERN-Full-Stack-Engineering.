import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('the product contract trims names and accepts the maximum price', async () => {
  const app = createProductApp();
  const created = await request(app)
    .post('/api/products')
    .send({ name: '  Notebook  ', price: 100000 })
    .expect(201);
  assert.equal(created.body.item.name, 'Notebook');
  assert.equal(created.body.item.price, 100000);
});

test('invalid boundary values do not modify inventory', async () => {
  const app = createProductApp();
  for (const price of [1.5, -1, 100001, null, '25']) {
    await request(app).post('/api/products').send({ name: 'Notebook', price }).expect(400);
  }
  assert.deepEqual((await request(app).get('/api/products').expect(200)).body.items, []);
});
