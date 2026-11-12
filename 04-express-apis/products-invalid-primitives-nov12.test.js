import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('prices must be JSON integer numbers, not booleans or strings', async () => {
  const app = createProductApp();

  for (const price of [true, false, null, '12', 1.25]) {
    const result = await request(app)
      .post('/api/products')
      .send({ name: 'Synthetic Notebook', price });
    assert.equal(result.status, 400);
  }

  const catalog = await request(app).get('/api/products');
  assert.equal(catalog.status, 200);
  assert.deepEqual(catalog.body, { items: [] });
});

test('missing names and whitespace-only names are rejected', async () => {
  const app = createProductApp();
  for (const input of [{ price: 10 }, { name: '  ', price: 10 }]) {
    const response = await request(app).post('/api/products').send(input);
    assert.equal(response.status, 400);
  }
});
