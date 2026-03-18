import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

/**
 * AuthContext – Manages authentication state for the whole application.
 *
 * Provides:
 *  - user       : Current authenticated user or null
 *  - token      : Sanctum token stored in memory (not localStorage for XSS safety)
 *  - login()    : Authenticates and redirects to the role dashboard
 *  - logout()   : Revokes the token and redirects to /login
 *  - isLoading  : True while an auth request is in progress
 */

const AuthContext = createContext(null);

const ROLE_ROUTES = {
  Administrador: '/admin',
  Recepcionista: '/recepcion',
  Limpieza:      '/limpieza',
  Cliente:       '/cliente',
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Keep token in state (memory) to avoid XSS via localStorage
  const [token,     setToken]     = useState(null);
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const destination = ROLE_ROUTES[data.user.rol] ?? '/login';
      navigate(destination, { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Ignore errors – still clear local state
    }
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook – consume auth context.
 * Throws if used outside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
