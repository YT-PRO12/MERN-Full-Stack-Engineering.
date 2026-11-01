import { useEffect, useState } from 'react';
export const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];
export default function useCurrency(currency) {
  const [state, setState] = useState({ base: null, rates: {}, loading: true, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ base: currency, rates: {}, loading: true, error: '' });
    async function load() {
      try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${currency}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Exchange rates are unavailable. Try again shortly.');
        const result = await response.json();
        if (
          result.result !== 'success' ||
          result.base_code !== currency ||
          !result.rates ||
          !currencies.every((code) => Number.isFinite(result.rates[code]) && result.rates[code] > 0)
        )
          throw new Error('The rate service returned incomplete data.');
        if (!controller.signal.aborted)
          setState({ base: currency, rates: result.rates, loading: false, error: '' });
      } catch (error) {
        if (!controller.signal.aborted)
          setState({ base: currency, rates: {}, loading: false, error: error.message });
      }
    }
    load();
    return () => controller.abort();
  }, [currency, attempt]);
  return {
    ...state,
    loading: state.loading || state.base !== currency,
    retry: () => setAttempt((n) => n + 1),
  };
}
