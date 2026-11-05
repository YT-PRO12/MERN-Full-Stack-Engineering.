import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('new products receive distinct server-generated identifiers', async () => {
  const app = createProductApp();
  const first = await request(app).post('/api/products').send({ name: 'Book', price: 5 });
  const second = await request(app).post('/api/products').send({ name: 'Pen', price: 2 });
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.match(first.body.item.id, /^[0-9a-f]{8}-[0-9a-f-]{27}$/i);
  assert.notEqual(first.body.item.id, second.body.item.id);
});

test('client-provided IDs cannot override generated identifiers', async () => {
  const app = createProductApp();
  const response = await request(app)
    .post('/api/products')
    .send({ name: 'Book', price: 5, id: 'chosen-by-client' });
  assert.equal(response.status, 400);
  const listing = await request(app).get('/api/products');
  assert.deepEqual(listing.body, { items: [] });
});
