import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reserveOne, StockItem } from './catalog.js';
test('reservation rejects query operators and invalid SKUs before database access', async (t) => {
  const lookup = t.mock.method(StockItem, 'findOneAndUpdate', () => {
    throw new Error('must not query');
  });
  for (const sku of [undefined, null, { $ne: null }, ['book'], '', 123])
    await assert.rejects(reserveOne(sku), { name: 'TypeError' });
  assert.equal(lookup.mock.callCount(), 0);
});
test('reservation uses an exact SKU and atomic positive-stock predicate', async (t) => {
  const lookup = t.mock.method(StockItem, 'findOneAndUpdate', async () => null);
  assert.equal(await reserveOne('book-1'), null);
  const filter = lookup.mock.calls[0].arguments[0];
  assert.equal(filter.sku, 'book-1');
  assert.deepEqual(filter.stock, { $gte: 1, $lte: Number.MAX_SAFE_INTEGER });
});
