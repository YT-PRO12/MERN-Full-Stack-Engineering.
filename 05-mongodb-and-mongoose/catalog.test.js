import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { StockItem, reserveOne, stockByCategory } from './catalog.js';
let mongo;
before(async () => {
  mongo = await MongoMemoryServer.create({ instance: { args: ['--nounixsocket'] } });
  await mongoose.connect(mongo.getUri(), { dbName: 'catalog_test' });
  await StockItem.init();
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
test('enforces uniqueness and never oversells under concurrent requests', async () => {
  await StockItem.create({ sku: 'book-1', category: 'books', stock: 1 });
  await assert.rejects(StockItem.create({ sku: 'book-1', category: 'books', stock: 2 }), {
    code: 11000,
  });
  const results = await Promise.all([reserveOne('book-1'), reserveOne('book-1')]);
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal((await StockItem.findOne({ sku: 'book-1' })).stock, 0);
  assert.deepEqual(await stockByCategory(), [{ _id: 'books', units: 0 }]);
});
test('rejects negative stock at the model boundary', async () => {
  await assert.rejects(StockItem.create({ sku: 'bad', category: 'books', stock: -1 }), {
    name: 'ValidationError',
  });
});
