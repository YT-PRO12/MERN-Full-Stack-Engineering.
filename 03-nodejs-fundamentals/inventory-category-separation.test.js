import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './inventory.js';

test('same price in distinct categories stays independent', () => {
  const result = summarize([
    { category: 'books', price: 10 },
    { category: 'electronics', price: 10 },
  ]);
  assert.equal(result.size, 2);
  assert.equal(result.get('books').value, 10);
  assert.equal(result.get('electronics').value, 10);
});
