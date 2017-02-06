import request from 'superagent';

const LOGIN_URL = '/api/login';
const LOGOUT_URL = '/api/logout';

function login(username, password) {
  return request
    .post(LOGIN_URL)
    .send({ username, password });
}

function logout() {
  return request
    .get(LOGOUT_URL);
}

export {
  login,
  logout,
};
