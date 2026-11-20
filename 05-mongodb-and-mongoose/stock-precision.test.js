import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { StockItem, reserveOne, stockByCategory } from './catalog.js';
let db;
before(async () => {
  db = await MongoMemoryServer.create({ instance: { args: ['--nounixsocket'] } });
  await mongoose.connect(db.getUri());
  await StockItem.init();
});
after(async () => {
  await mongoose.disconnect();
  await db?.stop();
});
test('stock records reject unsafe integers before persistence', async () => {
  await assert.rejects(StockItem.create({ sku: 'unsafe-new', category: 'books', stock: 2 ** 54 }), {
    name: 'ValidationError',
  });
  const item = await StockItem.create({
    sku: 'maximum',
    category: 'books',
    stock: Number.MAX_SAFE_INTEGER,
  });
  assert.equal((await reserveOne(item.sku)).stock, Number.MAX_SAFE_INTEGER - 1);
});
test('reservations do not decrement malformed legacy stock quantities', async () => {
  for (const stock of [2 ** 54, 0.5, 1.5, null, 'invalid']) {
    const sku = 'legacy-' + stock;
    await StockItem.collection.insertOne({ sku, category: 'books', stock });
    assert.equal(await reserveOne(sku), null);
    assert.equal((await StockItem.collection.findOne({ sku })).stock, stock);
  }
});

test('category totals exclude unreservable legacy quantities', async () => {
  await StockItem.deleteMany({});
  await StockItem.collection.insertMany(
    [0, 4, 0.5, 1.5, -1, 2 ** 54, null, 'invalid'].map((stock, i) => ({
      sku: 'total-' + i,
      category: 'books',
      stock,
    })),
  );
  assert.deepEqual(await stockByCategory(), [{ _id: 'books', units: 4 }]);
});
