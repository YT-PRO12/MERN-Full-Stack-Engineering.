import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('whitespace around product names is removed', async () => {
  const response = await request(createProductApp()).post('/api/products').send({
    name: '  Notebook  ', price: 12,
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.item.name, 'Notebook');
});

test('blank names fail validation', async () => {
  const response = await request(createProductApp()).post('/api/products').send({
    name: '   ', price: 12,
  });
  assert.equal(response.status, 400);
});
