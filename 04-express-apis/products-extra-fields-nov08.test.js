import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('product creation rejects unrecognized client-controlled fields', async () => {
  const app = createProductApp();
  for (const key of ['id', 'ownerId', 'isAdmin', 'role']) {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Synthetic Book', price: 10, [key]: 'client-value' });
    assert.equal(response.status, 400);
  }
  const result = await request(app).get('/api/products');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.items, []);
});
