import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('created product can be read by its server ID', async () => {
  const app = createProductApp();
  const made = await request(app).post('/api/products').send({ name: 'Book', price: 25 });
  assert.equal(made.status, 201);
  const found = await request(app).get('/api/products/' + made.body.item.id);
  assert.equal(found.status, 200);
  assert.deepEqual(found.body.item, made.body.item);
});
