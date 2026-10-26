import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, checkPassword, sessionToken } from '../src/auth.js';
import { listingQuery, objectId } from '../src/validation.js';
test('line terminators cannot bypass exact authentication or query boundaries', async () => {
  const password = 'BoundaryPassword123!';
  const hash = await hashPassword(password);
  for (const end of ['\n', '\r', '\r\n', '\u2028', '\u2029']) {
    assert.equal(await checkPassword(password, hash + end), false);
    assert.equal(sessionToken({ campus_session: 'a'.repeat(64) + end }), null);
    assert.equal(listingQuery.safeParse({ page: '1' + end }).success, false);
    assert.equal(listingQuery.safeParse({ limit: '9' + end }).success, false);
    assert.equal(objectId.safeParse('a'.repeat(24) + end).success, false);
  }
  assert.equal(await checkPassword(password, hash), true);
});
