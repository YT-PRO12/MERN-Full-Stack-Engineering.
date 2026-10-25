import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Marketplace from './pages/Marketplace.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import EditListing, { Editor } from './pages/ListingForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
function RequireAuth() {
  const { user, loading, error } = useAuth();
  return loading ? (
    <p role="status" className="notice">
      Checking session…
    </p>
  ) : error ? (
    <p role="alert" className="notice error">
      {error}
    </p>
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}
export default function App() {
  const { user, logout, error } = useAuth();
  const [logoutError, setLogoutError] = useState('');
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    setLogoutError('');
    try {
      await logout();
    } catch (err) {
      setLogoutError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">
            c<span>h</span>
          </span>
          campushub<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/">Marketplace</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">My listings</NavLink>
              <button className="quiet" disabled={busy} onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
          <Link className="button small" to="/sell">
            + List an item
          </Link>
        </nav>
      </header>
      {(error || logoutError) && (
        <p role="alert" className="notice error">
          {error || logoutError}
        </p>
      )}
      <main id="main">
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/login" element={<AuthPage key="login" />} />
          <Route path="/register" element={<AuthPage key="register" register />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sell" element={<Editor />} />
            <Route path="/listings/:id/edit" element={<EditListing />} />
          </Route>
          <Route
            path="*"
            element={
              <section className="page">
                <h1>This page wandered off.</h1>
                <Link to="/">Back to the marketplace</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <Link className="brand" to="/">
          campushub.
        </Link>
        <p>Useful things. New beginnings.</p>
        <span>Portfolio project · Synthetic demo listings</span>
      </footer>
    </>
  );
}
