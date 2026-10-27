import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reserveOne, StockItem } from './catalog.js';

test('reservation requires positive stock in the atomic write predicate', async (t) => {
  const lookup = t.mock.method(StockItem, 'findOneAndUpdate', async () => null);
  assert.equal(await reserveOne('book-2'), null);
  assert.equal(lookup.mock.callCount(), 1);
  const [filter, update, options] = lookup.mock.calls[0].arguments;
  assert.deepEqual(filter, { sku: 'book-2', stock: { $gt: 0 } });
  assert.deepEqual(update, { $inc: { stock: -1 } });
  assert.deepEqual(options, { returnDocument: 'after', runValidators: true });
});
