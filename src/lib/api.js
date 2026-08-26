/**
 * Single API client — same-origin via Vite proxy in development.
 * Prefer cookie session; optional in-memory bearer for API tooling.
 */
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? '/api';

export const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let memoryAccessToken = null;
let memoryCsrf = null;

export function setAccessToken(token) {
  memoryAccessToken = token || null;
}

export function setCsrfToken(token) {
  memoryCsrf = token || null;
  if (token) sessionStorage.setItem('ss_csrf', token);
}

export function getCsrfToken() {
  return memoryCsrf || sessionStorage.getItem('ss_csrf');
}

export function clearClientAuth() {
  memoryAccessToken = null;
  memoryCsrf = null;
  sessionStorage.removeItem('ss_csrf');
}

api.interceptors.request.use((config) => {
  const requestId = crypto.randomUUID?.() || String(Date.now());
  config.headers['X-Request-ID'] = requestId;
  if (memoryAccessToken) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`;
  }
  const csrf = getCsrfToken();
  if (csrf && !['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const original = error.config;
    if (status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const refreshed = await axios.post(
          `${baseURL}/auth/refresh`.replace(/\/api\/auth/, '/api/auth'),
          {},
          { withCredentials: true, baseURL }
        );
        // refresh path
      } catch (_) {
        clearClientAuth();
      }
    }
    const detail = error.response?.data?.detail || error.message || 'Request failed';
    return Promise.reject(typeof detail === 'string' ? new Error(detail) : error);
  }
);

export default api;
