import { z } from 'zod';
import { categories, states } from './models.js';
const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(12).max(128);
export const registration = z
  .object({ name: z.string().trim().min(2).max(60), email, password })
  .strict();
export const login = z.object({ email, password }).strict();
export const listingFields = z
  .object({
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().min(10).max(2000),
    price: z.number().int().min(0).max(100000),
    category: z.enum(categories),
    condition: z.enum(['like-new', 'good', 'fair']),
    location: z.string().trim().min(2).max(80),
  })
  .strict();
export const listingUpdate = listingFields
  .partial()
  .extend({
    version: z.number().int().min(0),
    status: z.enum(states).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 1, 'Supply at least one changed field');
export const listingQuery = z
  .object({
    q: z.string().trim().max(80).default(''),
    category: z.enum(categories).optional(),
    status: z.enum(states).optional(),
    page: z.coerce.number().int().min(1).max(1000).default(1),
    limit: z.coerce.number().int().min(1).max(24).default(9),
  })
  .strict();
export const objectId = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid listing id');
export function parse(schema, value) {
  return schema.parse(value);
}
