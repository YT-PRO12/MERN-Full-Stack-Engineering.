import { useState } from 'react';
import useCurrency, { currencies } from './useCurrency.js';
export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const { rates, loading, error, retry } = useCurrency(fromCurrency);
  const valid =
    amount.trim() !== '' &&
    Number.isFinite(Number(amount)) &&
    Number(amount) >= 0 &&
    Number(amount) <= 1000000000;
  const converted = valid && !loading && !error ? Number(amount) * rates[toCurrency] : null;
  return (
    <section>
      <p className="eyebrow">CUSTOM HOOKS / ASYNC EFFECTS</p>
      <h1>A clearer currency converter.</h1>
      <p>Choose a base currency. Rates refresh when the base changes.</p>
      <div className="panel">
        <label>
          Amount
          <input
            type="number"
            min="0"
            max="1000000000"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div className="row">
          <label>
            From
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {currencies.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </label>
          <label>
            To
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {currencies.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <p role="status">Loading exchange rates…</p>
        ) : error ? (
          <div role="alert">
            <p>{error}</p>
            <button onClick={retry}>Retry</button>
          </div>
        ) : !valid ? (
          <p role="alert">Enter an amount from 0 to 1,000,000,000.</p>
        ) : (
          <output aria-live="polite">
            {converted.toFixed(2)} {toCurrency}
          </output>
        )}
      </div>
      <p>
        <small>
          Indicative rates only; fees and actual exchange prices vary. Rates by{' '}
          <a href="https://www.exchangerate-api.com/">ExchangeRate-API</a>.
        </small>
      </p>
    </section>
  );
}
