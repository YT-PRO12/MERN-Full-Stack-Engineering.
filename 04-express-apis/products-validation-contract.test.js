import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('product creation rejects unexpected fields', async () => {
  const response = await request(createProductApp())
    .post('/api/products')
    .send({ name: 'Keyboard', price: 250, isAdmin: true });
  assert.equal(response.status, 400);
});

test('product creation rejects negative prices', async () => {
  const response = await request(createProductApp())
    .post('/api/products')
    .send({ name: 'Keyboard', price: -1 });
  assert.equal(response.status, 400);
});
