import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listingFields } from '../src/validation.js';

const valid = {
  title: 'Used textbook',
  description: 'Well maintained copy for studying.',
  price: 0,
  category: 'books',
  condition: 'good',
  location: 'Main library',
};

test('listing fields accept free items and reject out-of-range values', () => {
  assert.equal(listingFields.parse(valid).price, 0);
  assert.equal(listingFields.parse({ ...valid, price: 100000 }).price, 100000);
  for (const price of [-1, 100001, 1.5, '0', null]) {
    assert.equal(listingFields.safeParse({ ...valid, price }).success, false);
  }
});

test('listing creation rejects owner or status supplied by clients', () => {
  assert.equal(listingFields.safeParse({ ...valid, owner: 'fake' }).success, false);
  assert.equal(listingFields.safeParse({ ...valid, status: 'sold' }).success, false);
});
