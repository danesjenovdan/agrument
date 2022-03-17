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

// const POST_REGISTER = '/api/auth/register';
// export function register(id, token, name, username, password) {
//   return request.post(POST_REGISTER).send({
//     id,
//     token,
//     name,
//     username,
//     password,
//   });
// }
