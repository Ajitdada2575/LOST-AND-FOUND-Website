import { api, setAuth, clearAuth } from './api';

// POST /api/auth/login -> { message, token, user }
export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password });
  setAuth(data.token, data.user);
  return data.user;
}

// POST /api/auth/register -> backend requires name, email, password (phone optional)
export async function register({ name, email, phone, password }) {
  return api.post('/auth/register', { name, email, phone, password });
}

export function logout() {
  clearAuth();
}
