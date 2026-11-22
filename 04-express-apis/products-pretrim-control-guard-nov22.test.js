import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('controls at either edge are rejected before name trimming', async () => {
  const app = createProductApp();
  const invalid = ['\tKeyboard', 'Keyboard\n', '\rKeyboard', 'Keyboard\0', '\x7fKeyboard'];
  for (const name of invalid) {
    const response = await request(app).post('/api/products').send({ name, price: 250 });
    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      error: 'Supply a name and a nonnegative integer price',
    });
  }
  const catalog = await request(app).get('/api/products');
  assert.equal(catalog.status, 200);
  assert.deepEqual(catalog.body, { items: [] });
});

test('ordinary outer spaces are trimmed while valid Unicode is retained', async () => {
  const app = createProductApp();
  const response = await request(app)
    .post('/api/products')
    .send({ name: '  Café & notebook 📗  ', price: 250 });
  assert.equal(response.status, 201);
  assert.equal(response.body.item.name, 'Café & notebook 📗');
});
