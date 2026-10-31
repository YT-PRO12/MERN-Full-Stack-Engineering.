import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('new instance returns empty products array', async () => {
  const response = await request(createProductApp()).get('/api/products');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { items: [] });
});
