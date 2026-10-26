import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { listingQuery } from '../src/validation.js';
test('pagination accepts decimal strings and preserves defaults', () => {
  assert.equal(listingQuery.parse({}).page, 1);
  assert.equal(listingQuery.parse({ page: '1000', limit: '24' }).page, 1000);
  for (const value of ['', ' ', '1e2', '0x10', '1.0', '+1', '01', ['1'], true, 1])
    assert.equal(listingQuery.safeParse({ page: value }).success, false);
});
test('HTTP pagination rejects ambiguous numbers and duplicate parameters', async () => {
  for (const q of ['page=1&page=2', 'page=1e2', 'limit=0x10', 'page=', 'page=1001'])
    await request(createApp())
      .get('/api/listings?' + q)
      .expect(400);
});
