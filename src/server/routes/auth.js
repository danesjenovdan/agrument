import express from 'express';
import passport from 'passport';
import passwordHashAndSalt from 'password-hash-and-salt';
import db from '../database';

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    login: 'ok',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({
    logout: 'ok',
  });
});

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

router.post('/register', (req, res) => {
  const {
    id,
    token,
    username,
    password,
  } = req.body;
  const name = (req.body.name || '').replace(/\s\s+/g, ' ').trim();

  // TODO: validate input on client so they know what went wrong
  const validPassAndToken = validatePassword(password) && validateToken(token);
  const validName = validateName(name);
  const validNameAndUsername = validName && validateUsername(username);

  db.transaction(trx => (
    trx
      .from('users')
      .where('id', id)
      .andWhere('token', token)
      .select('password')
      .then((data) => {
        if (data.length !== 1) {
          throw new Error('update should return 1 modified row only');
        }
        const hasPassword = !!data[0].password;
        if (!hasPassword && validNameAndUsername && validPassAndToken) {
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
        if (hasPassword && validPassAndToken) {
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
                  name: validName ? name : undefined,
                  password: hash,
                });
              resolve(updatePromise);
            });
          });
        }
        throw new Error('Invalid arguments');
      })
  ))
    .then(() => {
      res.json({
        success: 'Registered',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

export default router;
