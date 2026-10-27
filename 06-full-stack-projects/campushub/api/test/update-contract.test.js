import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listingUpdate } from '../src/validation.js';

test('listing updates require a version and at least one change', () => {
  for (const input of [{}, { version: 0 }, { title: 'Edited' }, { version: -1, title: 'Edited' }]) {
    assert.equal(listingUpdate.safeParse(input).success, false);
  }
  assert.equal(listingUpdate.safeParse({ version: 0, status: 'reserved' }).success, true);
  assert.equal(listingUpdate.safeParse({ version: 3, price: 0 }).success, true);
});

test('listing updates reject unknown and immutable fields', () => {
  for (const extra of [{ owner: 'someone' }, { id: 'something' }, { seedKey: 'x' }]) {
    assert.equal(listingUpdate.safeParse({ version: 0, title: 'Edited', ...extra }).success, false);
  }
});
