import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('rejects embedded control characters without mutating the catalog', async () => {
  const app = createProductApp();
  for (const control of ['\n', '\r', '\t', '\0', '\x1f', '\x7f']) {
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'Desk' + control + 'Lamp', price: 350 });
    assert.equal(created.status, 400);
    assert.deepEqual(created.body, {
      error: 'Supply a name and a nonnegative integer price',
    });
  }
  const list = await request(app).get('/api/products');
  assert.equal(list.status, 200);
  assert.deepEqual(list.body, { items: [] });
});

test('retains legitimate Unicode and punctuation in display names', async () => {
  const app = createProductApp();
  const name = 'Café & Notebook 📗';
  const created = await request(app)
    .post('/api/products')
    .send({ name, price: 250 });
  assert.equal(created.status, 201);
  assert.equal(created.body.item.name, name);
  assert.equal(created.body.item.price, 250);
});
