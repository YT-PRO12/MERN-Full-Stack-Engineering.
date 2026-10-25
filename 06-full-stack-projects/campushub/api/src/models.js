import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);
const sessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
export const categories = ['books', 'electronics', 'essentials'];
export const states = ['active', 'reserved', 'sold'];
const listingSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0, max: 100000, validate: Number.isInteger },
    category: { type: String, enum: categories, required: true },
    condition: { type: String, enum: ['like-new', 'good', 'fair'], required: true },
    location: { type: String, required: true, maxlength: 80 },
    status: { type: String, enum: states, default: 'active' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seedKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);
listingSchema.index({ category: 1, status: 1, createdAt: -1, _id: -1 });
listingSchema.index({ owner: 1, createdAt: -1, _id: -1 });
export const User = model('User', userSchema);
export const Session = model('Session', sessionSchema);
export const Listing = model('Listing', listingSchema);
export async function initializeIndexes() {
  await Promise.all([User.init(), Session.init(), Listing.init()]);
}
