import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('collection reads retain insertion order and product identity', async () => {
  const app = createProductApp();
  const first = await request(app)
    .post('/api/products')
    .send({ name: 'Binder', price: 20 })
    .expect(201);
  const second = await request(app)
    .post('/api/products')
    .send({ name: 'Calculator', price: 500 })
    .expect(201);
  assert.notEqual(first.body.item.id, second.body.item.id);
  const items = (await request(app).get('/api/products').expect(200)).body.items;
  assert.deepEqual(
    items.map((item) => item.name),
    ['Binder', 'Calculator'],
  );
  assert.deepEqual(
    (await request(app).get(`/api/products/${second.body.item.id}`).expect(200)).body.item,
    second.body.item,
  );
  await request(app).get('/api/products/not-present').expect(404);
  assert.equal((await request(app).get('/api/products').expect(200)).body.items.length, 2);
});
