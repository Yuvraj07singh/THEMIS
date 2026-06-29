import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setToken, getToken } from '../lib/api';

const AuthContext = createContext();

/** Dashboard home path for each role. */
export function homePathFor(role) {
  if (role === 'CA') return '/ca-dashboard';
  if (role === 'LAWYER') return '/law-dashboard';
  return '/my-documents';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore session from stored token on app load
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (!getToken()) {
        setInitializing(false);
        return;
      }
      try {
        const { user } = await api.me();
        if (!cancelled) setUser(user);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    restore();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api.login({ email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async ({ name, email, password, role, firmName }) => {
    const { token, user } = await api.signup({ name, email, password, role, firmName });
    setToken(token);
    setUser({ ...user, isFirstTimeUser: true });
    return user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const dismissOnboarding = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, isFirstTimeUser: false } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, signup, logout, dismissOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
