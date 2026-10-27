import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('an empty inventory produces an empty map', () => {
  const report = summarize([]);
  assert.ok(report instanceof Map);
  assert.equal(report.size, 0);
});

test('reporting inventory does not change input rows', () => {
  const rows = [
    { category: 'books', price: 100 },
    { category: 'books', price: 25 },
  ];
  const snapshot = structuredClone(rows);
  assert.deepEqual(summarize(rows).get('books'), { count: 2, value: 125 });
  assert.deepEqual(rows, snapshot);
});
