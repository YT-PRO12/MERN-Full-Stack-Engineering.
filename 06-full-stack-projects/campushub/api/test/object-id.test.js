import { test } from 'node:test';
import assert from 'node:assert/strict';
import { objectId } from '../src/validation.js';

test('only canonical 24-character hex listing identifiers are accepted', () => {
  for (const value of ['a'.repeat(24), 'A'.repeat(24), '0123456789abcdef01234567']) {
    assert.equal(objectId.parse(value), value);
  }
  for (const value of ['', 'a'.repeat(23), 'a'.repeat(25), 'g'.repeat(24), { $ne: null }, ['a'.repeat(24)]]) {
    assert.equal(objectId.safeParse(value).success, false);
  }
});
