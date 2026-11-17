import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('product responses disable caching without changing response data', async () => {
  const app = createProductApp();
  const created = await request(app).post('/api/products').send({
    name: 'Synthetic Notebook',
    price: 250,
  });
  const list = await request(app).get('/api/products');
  const detail = await request(app).get(`/api/products/${created.body.item.id}`);

  assert.equal(created.status, 201);
  assert.equal(list.status, 200);
  assert.equal(detail.status, 200);
  assert.deepEqual(list.body.items, [created.body.item]);
  assert.deepEqual(detail.body.item, created.body.item);

  for (const response of [created, list, detail]) {
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.headers['x-powered-by'], undefined);
  }
});

test('missing routes and invalid inputs are not cached', async () => {
  const app = createProductApp();
  const missing = await request(app).get('/api/unknown');
  const invalid = await request(app).post('/api/products').send({ name: '', price: -1 });

  assert.equal(missing.status, 404);
  assert.equal(invalid.status, 400);
  assert.equal(missing.headers['cache-control'], 'no-store');
  assert.equal(invalid.headers['cache-control'], 'no-store');
});
