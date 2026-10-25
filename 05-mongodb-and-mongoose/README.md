# MongoDB: the last item in stock

Two concurrent requests must not both reserve the last available item. `catalog.js` uses one conditional update (`stock > 0`, then decrement) to make the decision atomic inside MongoDB.

Run `npm ci`, then `node --test 05-mongodb-and-mongoose/catalog.test.js` from the root. The test runner downloads a real MongoDB binary on its first run, starts an isolated database, builds indexes, and cleans up afterward. It does not connect to your application database.

The lab covers schema validation, a unique SKU index, aggregation by category, and competing reservations. A unique index is a database constraint, not a Mongoose validator; duplicate insertion fails with code 11000. Waiting for `StockItem.init()` makes the uniqueness test deterministic.

Stock is stored with the item because it changes as one unit. In CampusHub, users are referenced by ObjectId because multiple listings share one identity; public queries populate only the owner's name. The capstone also demonstrates bounded pagination and category/owner indexes.

No transaction is required for this single-document update. If a future reservation also writes an order in another collection and both writes must succeed together, use a transaction on a replica set or supported sharded cluster, and test rollback. Do not assume standalone MongoDB supports multi-document transactions.

Try reserving all three units with ten concurrent requests. Assert exactly three successes and zero remaining stock. Then inspect `explain()` on realistic data before changing indexes or claiming an optimization.
