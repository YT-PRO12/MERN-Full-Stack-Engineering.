import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('accepts 80-character names but rejects longer product names', async () => {
  const app = createProductApp();
  const accepted = await request(app)
    .post('/api/products')
    .send({ name: 'a'.repeat(80), price: 100000 });
  assert.equal(accepted.status, 201);
  assert.equal(accepted.body.item.name.length, 80);

  const rejected = await request(app)
    .post('/api/products')
    .send({ name: 'b'.repeat(81), price: 1 });
  assert.equal(rejected.status, 400);

  const listing = await request(app).get('/api/products');
  assert.equal(listing.status, 200);
  assert.deepEqual(listing.body.items, [accepted.body.item]);
});

test('valid names are trimmed before the length check', async () => {
  const response = await request(createProductApp())
    .post('/api/products')
    .send({ name: '  Notebook  ', price: 0 });
  assert.equal(response.status, 201);
  assert.equal(response.body.item.name, 'Notebook');
});
