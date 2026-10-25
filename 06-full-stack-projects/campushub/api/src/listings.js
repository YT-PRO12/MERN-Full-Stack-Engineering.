import { Listing } from './models.js';
export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export function publicListing(item) {
  return {
    id: String(item._id),
    title: item.title,
    description: item.description,
    price: item.price,
    category: item.category,
    condition: item.condition,
    location: item.location,
    status: item.status,
    owner: { id: String(item.owner._id), name: item.owner.name },
    version: item.__v,
    createdAt: item.createdAt,
  };
}
export async function findListings(query, owner) {
  const { q, category, status, page, limit } = query;
  const filter = {};
  if (owner) filter.owner = owner;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const [items, total] = await Promise.all([
    Listing.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', 'name'),
    Listing.countDocuments(filter),
  ]);
  return { items: items.map(publicListing), page, limit, total, pages: Math.ceil(total / limit) };
}
const transitions = { active: ['reserved', 'sold'], reserved: ['active', 'sold'], sold: [] };
export async function updateListing(id, userId, input) {
  const current = await Listing.findOne({ _id: id, owner: userId });
  if (!current) throw new HttpError(404, 'NOT_FOUND', 'Listing not found.');
  if (current.__v !== input.version)
    throw new HttpError(409, 'CONFLICT', 'This listing changed. Reload it before editing.');
  if (current.status === 'sold')
    throw new HttpError(409, 'TERMINAL_STATE', 'Sold listings cannot be changed.');
  const { version, ...changes } = input;
  if (
    changes.status &&
    changes.status !== current.status &&
    !transitions[current.status].includes(changes.status)
  ) {
    throw new HttpError(409, 'INVALID_TRANSITION', 'That status change is not allowed.');
  }
  // Match the version in the write itself: two editors cannot silently overwrite each other.
  const updated = await Listing.findOneAndUpdate(
    { _id: id, owner: userId, __v: version },
    { $set: changes, $inc: { __v: 1 } },
    { returnDocument: 'after', runValidators: true },
  ).populate('owner', 'name');
  if (!updated)
    throw new HttpError(409, 'CONFLICT', 'This listing changed. Reload it before editing.');
  return publicListing(updated);
}
