import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('unknown product IDs return a safe 404 response', async () => {
  const response = await request(createProductApp()).get('/api/products/does-not-exist');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Product not found' });
});

test('unknown endpoints do not expose internals', async () => {
  const response = await request(createProductApp()).get('/api/private/debug');
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Endpoint not found' });
});
