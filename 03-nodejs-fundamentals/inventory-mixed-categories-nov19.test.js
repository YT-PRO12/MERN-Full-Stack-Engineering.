import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('aggregates repeated categories and retains exact category identity', () => {
  const items = [
    { category: 'books', price: 5 },
    { category: 'Books', price: 7 },
    { category: 'books', price: 2 },
    { category: 'hardware', price: 0 },
  ];
  assert.deepEqual(
    [...summarize(items)],
    [
      ['books', { count: 2, value: 7 }],
      ['Books', { count: 1, value: 7 }],
      ['hardware', { count: 1, value: 0 }],
    ],
  );
  assert.equal(items[0].price, 5);
});

test('empty inventory returns an empty Map', () => {
  const output = summarize([]);
  assert.ok(output instanceof Map);
  assert.equal(output.size, 0);
});

test('rejects non-integer, unsafe and negative prices', () => {
  for (const price of [NaN, Infinity, -1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => summarize([{ category: 'books', price }]), TypeError);
  }
});
