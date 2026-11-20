export async function api(path, { body, ...options } = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return null;
  let data;
  try {
    data = await response.json();
  } catch {
    const error = new Error('The server returned an unreadable response. Try again.');
    error.status = response.ok ? 502 : response.status;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(
      (Array.isArray(data?.error?.fields)
        ? data.error.fields
            .filter((f) => typeof f?.path === 'string' && typeof f?.message === 'string')
            .map((f) => `${f.path}: ${f.message}`)
            .join(' · ')
        : '') ||
        (typeof data?.error?.message === 'string' ? data.error.message : '') ||
        'Request failed.',
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
