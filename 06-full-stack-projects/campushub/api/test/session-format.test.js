import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionToken } from '../src/auth.js';

test('cookie authentication requires exactly 64 lowercase hex characters', () => {
  const valid = 'a'.repeat(64);
  assert.equal(sessionToken({ campus_session: valid }), valid);
  for (const candidate of [
    ` ${valid}`,
    `${valid} `,
    `${valid}\n`,
    `j:${valid}`,
    `${valid}0`,
    '0'.repeat(63),
  ]) {
    assert.equal(sessionToken({ campus_session: candidate }), null);
  }
});
