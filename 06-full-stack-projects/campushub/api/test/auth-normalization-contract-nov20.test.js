import test from 'node:test';
import assert from 'node:assert/strict';
import { login, registration } from '../src/validation.js';

test('registration and login share canonical case-insensitive email handling', () => {
  const email = '  Student.Name+Books@Campus.EDU  ';
  const registered = registration.parse({
    name: '  Student Name  ',
    email,
    password: 'sufficiently-long-password',
  });
  const loggedIn = login.parse({
    email,
    password: 'sufficiently-long-password',
  });
  assert.equal(registered.name, 'Student Name');
  assert.equal(registered.email, 'student.name+books@campus.edu');
  assert.equal(loggedIn.email, registered.email);
});

test('registration refuses role injection, weak password and missing identity', () => {
  const valid = {
    name: 'Student Name',
    email: 'student@campus.edu',
    password: 'sufficiently-long-password',
  };
  assert.equal(registration.safeParse({ ...valid, role: 'admin' }).success, false);
  assert.equal(registration.safeParse({ ...valid, password: 'short' }).success, false);
  assert.equal(registration.safeParse({ ...valid, name: ' ' }).success, false);
  assert.equal(login.safeParse({ email: valid.email, password: valid.password, role: 'admin' }).success, false);
});
