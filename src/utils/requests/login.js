import { api } from './api.js';

export async function login(username, password) {
  const { data } = await api.post('/api/auth/login', { username, password });
  if (data.login !== 'ok') {
    throw new Error('Login failed!');
  }
}

export async function logout() {
  const { data } = await api.get('/api/auth/logout');
  if (data.logout !== 'ok') {
    throw new Error('Logout failed!');
  }
}

export async function register(id, token, name, username, password) {
  const { data } = await api.post('/api/auth/register', {
    id,
    token,
    name,
    username,
    password,
  });
  if (data.success !== 'Registered') {
    throw new Error('Registration failed!');
  }
}
