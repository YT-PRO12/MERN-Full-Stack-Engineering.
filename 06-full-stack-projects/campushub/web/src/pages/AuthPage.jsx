import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
export default function AuthPage({ register = false }) {
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await authenticate(register ? 'register' : 'login', fields);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="form-page">
      <p className="eyebrow">YOUR CAMPUS, CONNECTED</p>
      <h1>{register ? 'Make yourself at home.' : 'Welcome back.'}</h1>
      <p className="muted">
        {register
          ? 'Create an account to share your next useful find.'
          : 'Sign in to manage your listings.'}
      </p>
      <form onSubmit={submit} className="panel">
        {register && (
          <label>
            Your name
            <input name="name" autoComplete="name" required minLength={2} maxLength={60} />
          </label>
        )}
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={register ? 'new-password' : 'current-password'}
            required
            minLength={12}
            maxLength={128}
            aria-describedby="password-help"
          />
        </label>
        <small id="password-help">Use 12–128 characters.</small>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button disabled={busy}>
          {busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <p>
        {register ? 'Already have an account?' : 'New around here?'}{' '}
        <Link to={register ? '/login' : '/register'}>
          {register ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </section>
  );
}
