import mongoose from 'mongoose';
const stockSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true, enum: ['books', 'electronics'] },
  stock: { type: Number, min: 0, required: true, validate: Number.isInteger },
});
export const StockItem = mongoose.model('StockItem', stockSchema);
export async function reserveOne(sku) {
  if (typeof sku !== 'string' || !sku.trim() || sku.length > 120)
    throw new TypeError('SKU must be a nonempty string of at most 120 characters');
  // The condition and decrement are one atomic operation. A read followed by save would race.
  return StockItem.findOneAndUpdate(
    { sku, stock: { $gt: 0 } },
    { $inc: { stock: -1 } },
    { returnDocument: 'after', runValidators: true },
  );
}
export function stockByCategory() {
  return StockItem.aggregate([
    { $group: { _id: '$category', units: { $sum: '$stock' } } },
    { $sort: { _id: 1 } },
  ]);
}
