export async function api(path, { body, ...options } = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(
      data.error?.fields?.map((f) => `${f.path}: ${f.message}`).join(' · ') ||
        data.error?.message ||
        'Request failed.',
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
