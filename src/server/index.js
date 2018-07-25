/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */
import fs from 'fs-extra';
import path from 'path';
import express from 'express';
import session from 'express-session';
import sessionKnex from 'connect-session-knex';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passwordHashAndSalt from 'password-hash-and-salt';
import _ from 'lodash';
import db from './database';
// import appMiddleware from './middleware/app';
import getAgrument from './routes/agrument';
import dashRouter from './routes/dashboard';
import authRouter from './routes/auth';
import { sendErrorToSlack, sendErrorToSlackMiddleware } from './slack';
import config from '../../config';

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
app.use('/media', express.static(path.resolve(__dirname, '../../media')));

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); // parse x-www-form-urlencoded
app.use(bodyParser.json({ extended: true, limit: '50mb' })); // parse json

passport.use(new LocalStrategy((username, pass, done) => {
  db('users')
    .where('username', username)
    .first()
    .then((user) => {
      if (user && !user.disabled) {
        passwordHashAndSalt(pass).verifyAgainst(user.password, (error, verified) => {
          if (error) {
            throw new Error(error);
          }
          if (!verified) {
            done(null, null);
          } else {
            done(null, {
              id: user.id,
              username: user.username,
              password: user.password,
            });
          }
        });
      } else {
        done(null, null);
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('failed to verify password hash', error);
      done(error, null);
    });
}));

passport.serializeUser((user, done) => {
  // this is the data stored to the session
  const sessionUser = _.pick(user, ['id', 'username', 'password']);
  done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => {
  // hit the db here if session doesn't have all the data you need on the user
  db('users')
    .where('id', sessionUser.id)
    .first()
    .then((user) => {
      if (user.disabled) {
        // if user is disabled don't set req.user
        done(null, null);
      } else if (user.username !== sessionUser.username || user.password !== sessionUser.password) {
        // if username or password hash don't match don't set req.user
        done(null, null);
      } else {
        // this sets req.user
        done(null, {
          id: user.id,
          name: user.name,
          username: user.username,
          group: user.group,
          password: user.password,
        });
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('failed to deserialize user', error);
      done(error, null);
    });
});

app.use(session({
  saveUninitialized: false, // save new sessions only when modified (e.g. login sessions)
  resave: false, // don't resave to store if not modified
  store: new KnexSessionStore({ knex: db }),
  secret: config.SESSION_SECRET,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRouter);

app.get('/api/agrument', getAgrument);

app.use('/api/dash', dashRouter);

app.get(['/api', '/api/*'], (req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

// app.get('*', appMiddleware);
app.get('*', (req, res) => {
  const filePath = path.resolve(__dirname, '../../dist/index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('index.html not found; client is probably not built');
  }
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
