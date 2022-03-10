import request from 'superagent';

const POST_LOGIN = '/api/auth/login';
const GET_LOGOUT = '/api/auth/logout';
const POST_REGISTER = '/api/auth/register';

function login(username, password) {
  return request.post(POST_LOGIN)
    .send({ username, password });
}

function logout() {
  return request.get(GET_LOGOUT);
}

function register(id, token, name, username, password) {
  return request.post(POST_REGISTER)
    .send({
      id,
      token,
      name,
      username,
      password,
    });
}

export {
  login,
  logout,
  register,
};
