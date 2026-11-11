import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('created product reads identically by ID and in the catalog', async () => {
  const app = createProductApp();
  const created = await request(app)
    .post('/api/products')
    .send({ name: '  Synthetic Notebook  ', price: 200 });
  assert.equal(created.status, 201);
  assert.equal(created.body.item.name, 'Synthetic Notebook');

  const found = await request(app).get(`/api/products/${created.body.item.id}`);
  const listed = await request(app).get('/api/products');
  assert.equal(found.status, 200);
  assert.equal(listed.status, 200);
  assert.deepEqual(found.body.item, created.body.item);
  assert.deepEqual(listed.body.items, [created.body.item]);
});
