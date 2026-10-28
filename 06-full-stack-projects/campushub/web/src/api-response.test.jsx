import { afterEach, test, expect, vi } from 'vitest';
import { api } from './api.js';
afterEach(() => vi.unstubAllGlobals());
test('preserves HTTP status for HTML or truncated JSON error responses', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      status: 503,
      ok: false,
      json: async () => {
        throw new SyntaxError('private upstream HTML');
      },
    }),
  );
  await expect(api('/listings')).rejects.toMatchObject({
    status: 503,
    message: 'The server returned an unreadable response. Try again.',
  });
});
test('handles null and malformed error envelopes without losing status', async () => {
  for (const data of [
    null,
    {},
    { error: { fields: 'bad' } },
    { error: { fields: [null, 7], message: { internal: 'secret' } } },
  ]) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 401, ok: false, json: async () => data }),
    );
    await expect(api('/auth/me')).rejects.toMatchObject({
      status: 401,
      message: 'Request failed.',
    });
  }
});
test('retains field messages and normal JSON and empty success results', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({
      status: 400,
      ok: false,
      json: async () => ({ error: { fields: [{ path: 'title', message: 'Required' }] } }),
    })
    .mockResolvedValueOnce({ status: 200, ok: true, json: async () => ({ items: [] }) })
    .mockResolvedValueOnce({ status: 204, ok: true });
  vi.stubGlobal('fetch', fetchMock);
  await expect(api('/listings')).rejects.toMatchObject({ status: 400, message: 'title: Required' });
  await expect(api('/listings')).resolves.toEqual({ items: [] });
  await expect(api('/auth/logout')).resolves.toBeNull();
});
