import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createProductApp } from './app.js';

test('unsupported update and delete methods cannot mutate catalog', async () => {
  const app = createProductApp();
  const created = await request(app)
    .post('/api/products')
    .send({ name: 'Synthetic Notebook', price: 250 });
  assert.equal(created.status, 201);

  const id = created.body.item.id;
  for (const method of ['patch', 'put', 'delete']) {
    const response = await request(app)[method]('/api/products/' + id)
      .send({ name: 'Unauthorized change', price: 0 });
    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: 'Endpoint not found' });
  }

  const after = await request(app).get('/api/products/' + id);
  assert.equal(after.status, 200);
  assert.deepEqual(after.body.item, created.body.item);
});
