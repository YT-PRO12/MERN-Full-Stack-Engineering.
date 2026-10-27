import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('category names do not collide with object prototype keys', () => {
  const report = summarize([
    { category: 'constructor', price: 3 },
    { category: 'toString', price: 4 },
    { category: '__proto__', price: 5 },
  ]);
  assert.equal(report.size, 3);
  assert.deepEqual(report.get('__proto__'), { count: 1, value: 5 });
});

test('grouping preserves distinct case-sensitive category keys', () => {
  const report = summarize([
    { category: 'Books', price: 2 },
    { category: 'books', price: 3 },
  ]);
  assert.equal(report.size, 2);
  assert.equal(report.get('Books').value, 2);
  assert.equal(report.get('books').value, 3);
});
