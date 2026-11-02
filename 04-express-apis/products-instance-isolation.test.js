import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('product catalogs are independent for separate app instances', async () => {
  const first = createProductApp();
  const second = createProductApp();
  const created = await request(first).post('/api/products').send({
    name: 'Notebook',
    price: 200,
  });
  assert.equal(created.status, 201);
  const response = await request(second).get('/api/products');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { items: [] });
});
