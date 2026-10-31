import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('inventory aggregation rejects sums beyond safe integer precision', () => {
  assert.throws(
    () =>
      summarize([
        { category: 'books', price: Number.MAX_SAFE_INTEGER },
        { category: 'books', price: 1 },
      ]),
    RangeError,
  );
});

test('separate categories retain independent totals', () => {
  const totals = summarize([
    { category: 'books', price: 5 },
    { category: 'electronics', price: 8 },
  ]);
  assert.deepEqual(totals.get('books'), { count: 1, value: 5 });
  assert.deepEqual(totals.get('electronics'), { count: 1, value: 8 });
});
