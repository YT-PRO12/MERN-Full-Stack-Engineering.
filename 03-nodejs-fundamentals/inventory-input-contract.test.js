import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('empty inventory returns an empty map', () => {
  const result = summarize([]);
  assert.equal(result instanceof Map, true);
  assert.equal(result.size, 0);
});

test('non-array inventory is rejected', () => {
  for (const input of [null, undefined, {}, 'items', 4]) {
    assert.throws(() => summarize(input), TypeError);
  }
});
