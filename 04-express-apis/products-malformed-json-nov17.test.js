import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('malformed JSON returns an explicit 400 and leaves catalog empty', async () => {
  const app = createProductApp();
  const response = await request(app)
    .post('/api/products')
    .set('Content-Type', 'application/json')
    .send('{"name":');

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: 'Supply a name and a nonnegative integer price',
  });

  const catalog = await request(app).get('/api/products');
  assert.equal(catalog.status, 200);
  assert.deepEqual(catalog.body, { items: [] });
});
