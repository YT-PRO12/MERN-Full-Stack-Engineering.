import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('malformed JSON is a client error and does not create a product', async () => {
  const app = createProductApp();
  const response = await request(app)
    .post('/api/products')
    .set('Content-Type', 'application/json')
    .send('{"name":"Notebook","price":');
  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: 'Supply a name and a nonnegative integer price',
  });

  const listing = await request(app).get('/api/products');
  assert.equal(listing.status, 200);
  assert.deepEqual(listing.body, { items: [] });
});
