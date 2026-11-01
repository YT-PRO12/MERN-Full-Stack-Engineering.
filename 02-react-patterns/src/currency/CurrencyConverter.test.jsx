import { afterEach, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyConverter from './CurrencyConverter.jsx';
const rates = { USD: 1, INR: 84, EUR: 0.9, GBP: 0.8, JPY: 150 };
const response = (data) => ({ ok: true, json: async () => ({ base_code: 'USD', ...data }) });
afterEach(() => vi.unstubAllGlobals());
test('converts zero and updates output from the current inputs', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ result: 'success', rates })));
  const user = userEvent.setup();
  render(<CurrencyConverter />);
  expect(await screen.findByText('84.00 INR')).toBeInTheDocument();
  await user.clear(screen.getByLabelText('Amount'));
  await user.type(screen.getByLabelText('Amount'), '0');
  expect(screen.getByText('0.00 INR')).toBeInTheDocument();
});
test('reports network failures and recovers with retry', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce(response({ result: 'success', rates })),
  );
  const user = userEvent.setup();
  render(<CurrencyConverter />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Network unavailable');
  await user.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText('84.00 INR')).toBeInTheDocument();
});
test('rejects malformed service payloads', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(response({ result: 'success', rates: { INR: -1 } })),
  );
  render(<CurrencyConverter />);
  expect(await screen.findByRole('alert')).toHaveTextContent('incomplete data');
});
test('aborts previous requests and ignores responses arriving out of order', async () => {
  let resolveFirst;
  const first = new Promise((resolve) => {
    resolveFirst = resolve;
  });
  const fetchMock = vi
    .fn()
    .mockReturnValueOnce(first)
    .mockResolvedValueOnce(
      response({ result: 'success', base_code: 'EUR', rates: { ...rates, INR: 100 } }),
    );
  vi.stubGlobal('fetch', fetchMock);
  const user = userEvent.setup();
  render(<CurrencyConverter />);
  await user.selectOptions(screen.getByLabelText('From'), 'EUR');
  expect(await screen.findByText('100.00 INR')).toBeInTheDocument();
  expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  resolveFirst(response({ result: 'success', rates }));
  await waitFor(() => expect(screen.getByText('100.00 INR')).toBeInTheDocument());
});

test('rejects rates for a different base currency and can recover', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce(response({ result: 'success', base_code: 'EUR', rates }))
      .mockResolvedValueOnce(response({ result: 'success', base_code: 'USD', rates })),
  );
  const user = userEvent.setup();
  render(<CurrencyConverter />);
  expect(await screen.findByRole('alert')).toHaveTextContent('incomplete data');
  expect(screen.queryByText('84.00 INR')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText('84.00 INR')).toBeInTheDocument();
});
