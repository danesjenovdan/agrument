/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */
import path from 'path';
import express from 'express';
import session from 'express-session';
import delay from 'express-delay';
import sessionKnex from 'connect-session-knex';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passwordHashAndSalt from 'password-hash-and-salt';
import _ from 'lodash';
import db from './database';
import appMiddleware from './middleware/app';
import getAgrument from './routes/agrument';
import dashRouter from './routes/dashboard';
import { sendErrorToSlack, sendErrorToSlackMiddleware } from './slack';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  sendErrorToSlack('uncaughtException', err, (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  sendErrorToSlack('unhandledRejection', reason, (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    process.exit(1);
  });
});

const KnexSessionStore = sessionKnex(session);

const app = express();
app.disable('x-powered-by');

// serve static files first so you dont create new sessions for static files
app.use(express.static(path.resolve(__dirname, '../../dist')));

// Delay will be between 200 and 500 milliseconds
// app.use(delay(1200, 1500));

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); // parse x-www-form-urlencoded
app.use(bodyParser.json({ extended: true, limit: '50mb' })); // parse json

passport.use(new LocalStrategy((username, pass, done) => {
  db('users')
    .where('username', username)
    .first()
    .then((user) => {
      if (user) {
        passwordHashAndSalt(pass).verifyAgainst(user.password, (error, verified) => {
          if (error) {
            throw new Error(error);
          }
          if (!verified) {
            done(new Error('password was not verified'));
          } else {
            done(null, { id: user.id, name: user.name, group: user.group });
          }
        });
      } else {
        done(new Error('password was not verified'));
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('failed to verify password hash', error);
      done(new Error('password was not verified'));
    });
}));

passport.serializeUser((user, done) => {
  // this is the data stored to the session
  const sessionUser = _.pick(user, ['id', 'name', 'group']);
  done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => {
  // hit the db here if session doesn't have all the data you need on the user
  // this sets req.user
  done(null, sessionUser);
});

app.use(session({
  saveUninitialized: false, // save new sessions only when modified (e.g. login sessions)
  resave: false, // don't resave to store if not modified
  store: new KnexSessionStore({ knex: db }),
  secret: 'sekkrett',
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({
    login: 'ok',
  });
});

app.get('/api/logout', (req, res) => {
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
  return password && password.length > 8; // TODO: be more strict with these
}

function validateToken(token) {
  return token && token.length === 8;
}

app.post('/api/register', (req, res) => {
  const {
    id,
    token,
    name,
    username,
    password,
  } = req.body;
  const cleanName = name.replace(/\s\s+/g, ' ').trim();
  // TODO: validate input on client so they know what went wrong
  if (validateUsername(username) &&
    validateName(cleanName) &&
    validatePassword(password) &&
    validateToken(token)) {
    passwordHashAndSalt(password).hash((error, hash) => {
      if (error) {
        throw new Error(error);
      }
      db('users')
        .where('id', id)
        .andWhere('token', token)
        .update({
          token: null,
          name,
          username,
          password: hash,
        })
        .then((rows) => {
          if (rows !== 1) {
            throw new Error('update should return 1 modified row only');
          }
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
  } else {
    res.status(400).json({
      error: 'Bad Request',
    });
  }
});

app.get('/api/agrument', getAgrument);

app.use('/api/dash', dashRouter);

app.get(['/api', '/api/*'], (req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

// app.get('*', appMiddleware);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.use(sendErrorToSlackMiddleware);

const port = parseInt(process.env.PORT, 10) || 80;

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  } else {
    // eslint-disable-next-line no-console
    console.info(`Server started on port ${port} -- http://localhost:${port}`);
  }
});
