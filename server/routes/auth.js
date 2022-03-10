import passwordHashAndSalt from 'password-hash-and-salt';
import db from '../database.js';

function postLoginHandler(request, reply) {
  reply.send({
    login: 'ok',
  });
}

function getLogoutHandler(request, reply) {
  request
    .logOut()
    .then(() => {
      reply.send({
        logout: 'ok',
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('logout failed', error);
      reply.send({
        logout: 'error',
      });
    });
}

function validateUsername(username) {
  const alphanum = /^[a-z0-9]+$/i;
  return alphanum.test(username);
}

function validateName(name) {
  return name && name.length > 0;
}

function validatePassword(password) {
  return password && password.length >= 8; // TODO: be more strict with these
}

function validateToken(token) {
  return token && token.length === 8;
}

function postRegisterHandler(request, reply) {
  const { id, token, username, password } = request.body;
  const name = (request.body.name || '').replace(/\s\s+/g, ' ').trim();

  // TODO: validate input on client so they know what went wrong
  const validPass = validatePassword(password);
  const validToken = validateToken(token);
  const validName = validateName(name);
  const validUsername = validateUsername(username);

  const validLoggedInUser =
    id == null && !validToken && request.user && request.user.id;

  db.transaction((trx) => {
    let query;
    if (id != null && validToken) {
      query = trx.from('users').where('id', id).andWhere('token', token);
    } else if (validLoggedInUser) {
      query = trx.from('users').where('id', request.user.id);
    } else {
      throw new Error('no auth');
    }
    return query.select('password').then((data) => {
      if (data.length !== 1) {
        throw new Error('update should return 1 modified row only');
      }
      const hasPassword = !!data[0].password;
      if (
        !hasPassword &&
        validName &&
        validUsername &&
        validPass &&
        validToken
      ) {
        return new Promise((resolve, reject) => {
          passwordHashAndSalt(password).hash((error, hash) => {
            if (error) {
              reject(new Error(error));
            }
            const updatePromise = trx
              .from('users')
              .where('id', id)
              .andWhere('token', token)
              .update({
                token: null,
                name,
                username,
                password: hash,
              });
            resolve(updatePromise);
          });
        });
      }
      if (hasPassword && validPass) {
        return new Promise((resolve, reject) => {
          passwordHashAndSalt(password).hash((error, hash) => {
            if (error) {
              reject(new Error(error));
            }
            const updatePromise = trx
              .from('users')
              .where('id', validLoggedInUser ? request.user.id : id)
              .andWhere('token', validLoggedInUser ? null : token)
              .update({
                token: null,
                name: validName ? name : undefined,
                password: hash,
              });
            resolve(updatePromise);
          });
        });
      }
      throw new Error('Invalid arguments');
    });
  })
    .then(() => {
      reply.send({
        success: 'Registered',
      });
    })
    .catch((err) => {
      reply.status(500).send({
        error: err.message,
      });
    });
}

export default function registerRoutes(fastify, opts, done) {
  fastify.post(
    '/login',
    { preValidation: opts.fastifyPassport.authenticate('local') },
    postLoginHandler
  );
  fastify.get('/logout', getLogoutHandler);
  fastify.post('/register', postRegisterHandler);
  done();
}
