import axios from 'axios';

/**
 * Axios instance pre-configured for the Laravel API.
 *
 * Base URL is read from the VITE_API_URL environment variable,
 * which is set in docker-compose.yml or a local .env file.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// ── Response interceptor ─────────────────────────────────────────────────────
// Centralised error handling: 401 → clear auth state (handled by AuthContext)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove stale token header; AuthContext will react to state update
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export default api;
