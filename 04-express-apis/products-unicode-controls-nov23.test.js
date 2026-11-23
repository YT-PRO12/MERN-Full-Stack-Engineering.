import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('C1 controls and Unicode line separators cannot be stored in names', async () => {
  const app = createProductApp();
  for (const control of ['\u0085', '\u009f', '\u2028', '\u2029']) {
    const created = await request(app)
      .post('/api/products')
      .send({ name: `Item${control}Name`, price: 200 });
    assert.equal(created.status, 400);
    assert.deepEqual(created.body, {
      error: 'Supply a name and a nonnegative integer price',
    });
  }
  const catalog = await request(app).get('/api/products');
  assert.deepEqual(catalog.body, { items: [] });
});

test('valid multilingual names and supplementary Unicode still work', async () => {
  const app = createProductApp();
  const name = '  हिंदी Café Notebook 📗  ';
  const created = await request(app).post('/api/products').send({ name, price: 200 });
  assert.equal(created.status, 201);
  assert.equal(created.body.item.name, 'हिंदी Café Notebook 📗');
});
