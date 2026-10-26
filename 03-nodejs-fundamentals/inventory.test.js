import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadInventory, summarize } from './inventory.js';
test('summarizes categories without prototype collisions', () => {
  assert.deepEqual(
    summarize([
      { category: '__proto__', price: 0 },
      { category: 'books', price: 12 },
      { category: 'books', price: 8 },
    ]).get('books'),
    { count: 2, value: 20 },
  );
});
test('rejects invalid prices and reads the JSON fixture asynchronously', async () => {
  assert.throws(() => summarize([{ category: 'books', price: NaN }]), /Invalid/);
  assert.equal((await loadInventory(new URL('./inventory.json', import.meta.url))).length, 3);
  await assert.rejects(loadInventory(new URL('./missing.json', import.meta.url)), {
    code: 'ENOENT',
  });
});

test('rejects malformed rows and unsafe totals instead of silently rounding money', () => {
  for (const item of [
    null,
    [],
    1,
    { category: ' ', price: 1 },
    { category: 'books', price: Number.MAX_SAFE_INTEGER + 1 },
  ])
    assert.throws(() => summarize([item]), { name: 'TypeError' });
  assert.throws(
    () =>
      summarize([
        { category: 'books', price: Number.MAX_SAFE_INTEGER },
        { category: 'books', price: 1 },
      ]),
    { name: 'RangeError' },
  );
  assert.equal(
    summarize([{ category: 'books', price: Number.MAX_SAFE_INTEGER }]).get('books').value,
    Number.MAX_SAFE_INTEGER,
  );
});
