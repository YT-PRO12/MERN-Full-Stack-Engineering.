import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';
test('creates and retrieves a product, including free products', async () => {
  const app = createProductApp();
  const made = await request(app)
    .post('/api/products')
    .send({ name: 'Textbook', price: 0 })
    .expect(201);
  const found = await request(app).get(`/api/products/${made.body.item.id}`).expect(200);
  assert.equal(found.body.item.price, 0);
});
test('rejects blank names, negative prices, strings and unknown fields', async () => {
  for (const body of [
    { name: ' ', price: 1 },
    { name: 'Book', price: -1 },
    { name: 'Book', price: '2' },
    { name: 'Book', price: 1, admin: true },
  ])
    await request(createProductApp()).post('/api/products').send(body).expect(400);
});
test('isolates state between application instances and rejects malformed JSON', async () => {
  const app = createProductApp();
  await request(app).post('/api/products').send({ name: 'Book', price: 5 }).expect(201);
  assert.deepEqual((await request(createProductApp()).get('/api/products')).body.items, []);
  await request(app)
    .post('/api/products')
    .set('Content-Type', 'application/json')
    .send('{')
    .expect(400);
  await request(app).get('/api/products/missing').expect(404);
});
