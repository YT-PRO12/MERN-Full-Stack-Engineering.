import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    api('/auth/me', { signal: controller.signal })
      .then((data) => setUser(data.user))
      .catch((err) => {
        if (err.name !== 'AbortError' && err.status !== 401)
          setError('Could not check your session. Refresh to try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  async function authenticate(mode, fields) {
    const data = await api(`/auth/${mode}`, { method: 'POST', body: fields });
    setUser(data.user);
    setError('');
  }
  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, error, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
