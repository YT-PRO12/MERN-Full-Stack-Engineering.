import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';
import { createApp } from '../06-full-stack-projects/campushub/api/src/app.js';
test('JSON parser rejects unsupported charsets and encodings with 415', async () => {
  for (const [app, path] of [
    [createProductApp(), '/api/products'],
    [createApp(), '/api/auth/register'],
  ]) {
    const charset = await request(app)
      .post(path)
      .set('Origin', 'http://localhost:5173')
      .set('Content-Type', 'application/json; charset=iso-8859-1')
      .send('{}');
    assert.equal(charset.status, 415);
    assert.match(JSON.stringify(charset.body), /encoding is not supported/i);
    const encoding = await request(app)
      .post(path)
      .set('Origin', 'http://localhost:5173')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'unsupported')
      .send('{}');
    assert.equal(encoding.status, 415);
    assert.match(JSON.stringify(encoding.body), /encoding is not supported/i);
  }
});
