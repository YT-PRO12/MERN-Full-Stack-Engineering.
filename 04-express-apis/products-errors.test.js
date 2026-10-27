import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('unknown product endpoints return a deliberate 404 response', async () => {
  const response = await request(createProductApp()).get('/api/missing').expect(404);
  assert.deepEqual(response.body, { error: 'Endpoint not found' });
});

test('product input has an 8 KB request body limit', async () => {
  const response = await request(createProductApp())
    .post('/api/products')
    .send({ name: 'Book', price: 5, padding: 'a'.repeat(9000) })
    .expect(413);
  assert.deepEqual(response.body, { error: 'Request body is too large' });
});
