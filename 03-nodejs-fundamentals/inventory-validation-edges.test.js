import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('zero-price inventory items still contribute to item count', () => {
  const summary = summarize([{ category: 'books', price: 0 }]);
  assert.deepEqual(summary.get('books'), { count: 1, value: 0 });
});

test('inventory rejects malformed rows', () => {
  for (const item of [
    null,
    [],
    { category: '', price: 1 },
    { category: 'books', price: -1 },
    { category: 'books', price: 1.5 },
  ]) {
    assert.throws(() => summarize([item]), TypeError);
  }
});
