import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listingQuery } from '../src/validation.js';

test('search inputs trim queries and preserve pagination defaults', () => {
  const query = listingQuery.parse({ q: '  textbook  ' });
  assert.equal(query.q, 'textbook');
  assert.equal(query.page, 1);
  assert.equal(query.limit, 9);
});

test('search rejects unknown filters and invalid status or categories', () => {
  for (const input of [
    { sort: 'popular' },
    { category: 'vehicles' },
    { status: 'deleted' },
    { q: 'x'.repeat(81) },
    { limit: '25' },
    { page: '0' },
  ]) {
    assert.equal(listingQuery.safeParse(input).success, false);
  }
});
