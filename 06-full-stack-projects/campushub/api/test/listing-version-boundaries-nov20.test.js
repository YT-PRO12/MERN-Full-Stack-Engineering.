import test from 'node:test';
import assert from 'node:assert/strict';
import { listingUpdate } from '../src/validation.js';

test('versioned listing changes accept a bounded state transition', () => {
  const valid = listingUpdate.parse({ version: 0, status: 'reserved' });
  assert.deepEqual(valid, { version: 0, status: 'reserved' });
  const renamed = listingUpdate.parse({ version: 7, title: 'Updated textbook title' });
  assert.equal(renamed.version, 7);
  assert.equal(renamed.title, 'Updated textbook title');
});

test('version must be a nonnegative integer and updates must change a field', () => {
  for (const version of [-1, 1.5, '1', NaN, null]) {
    assert.equal(
      listingUpdate.safeParse({ version, title: 'Updated textbook title' }).success,
      false,
    );
  }
  assert.equal(listingUpdate.safeParse({ version: 0 }).success, false);
  assert.equal(listingUpdate.safeParse({ title: 'Updated textbook title' }).success, false);
});

test('unknown state and client-supplied ownership changes are rejected', () => {
  assert.equal(listingUpdate.safeParse({ version: 0, status: 'deleted' }).success, false);
  assert.equal(listingUpdate.safeParse({ version: 0, owner: 'attacker' }).success, false);
  assert.equal(listingUpdate.safeParse({ version: 0, seedKey: 'external-key' }).success, false);
});
