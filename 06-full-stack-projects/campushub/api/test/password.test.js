import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, checkPassword } from '../src/auth.js';
test('password verification fails closed for malformed persisted hashes', async () => {
  for (const value of [
    null,
    undefined,
    3,
    {},
    '',
    'salt',
    'salt:00',
    'a'.repeat(32) + ':' + 'z'.repeat(128),
  ])
    assert.equal(await checkPassword('Password123!', value), false);
  const hash = await hashPassword('ValidPassword123!');
  assert.equal(await checkPassword('ValidPassword123!', hash), true);
  assert.equal(await checkPassword('WrongPassword123!', hash), false);
  assert.equal(await checkPassword(null, hash), false);
  assert.equal(await checkPassword('ValidPassword123!', hash + ':extra'), false);
});
