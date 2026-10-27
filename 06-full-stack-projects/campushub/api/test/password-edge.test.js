import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPassword } from '../src/auth.js';

test('password verification rejects malformed hexadecimal digests', async () => {
  const salt = 'a'.repeat(32);
  const digest = 'b'.repeat(128);
  for (const stored of [
    `${salt.toUpperCase()}:${digest}`,
    `${salt}:${digest.toUpperCase()}`,
    `${salt}:${digest}\n`,
    `${salt}:${digest} `,
    `${salt}:${digest.slice(2)}`,
    `${salt}:${digest}00`,
  ]) {
    assert.equal(await checkPassword('SafePassword123!', stored), false);
  }
});
