/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */
import path from 'path';
import express from 'express';
import session from 'express-session';
import sessionKnex from 'connect-session-knex';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import password from 'password-hash-and-salt';
import db from './api/database';
import middleware from './middleware';
import getAgrument from './api/agrument';
import {
  getUserData,
  getPendingSubmissions,
  editPendingSubmission,
  getVotableSubmissions,
  getPinnedMessages,
  addPinnedMessage,
  removePinnedMessage,
} from './api/dash';


process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

const KnexSessionStore = sessionKnex(session);

const app = express();
app.disable('x-powered-by');

// serve static files first so you dont create new sessions for static files
app.use(express.static(path.resolve(__dirname, '../dist')));

passport.use(new LocalStrategy((username, pass, done) => {
  db('users')
    .where('username', username)
    .first()
    .then((user) => {
      if (user) {
        password(pass).verifyAgainst(user.password, (error, verified) => {
          if (error) {
            throw new Error(error);
          }
          if (!verified) {
            done('password was not verified');
          } else {
            done(null, { id: user.id, name: user.name, group: user.group });
          }
        });
      } else {
        done('password was not verified');
      }
    })
    .catch((error) => {
      console.log('failed to verify password hash', error);
      done('password was not verified');
    });
}));

passport.serializeUser((user, done) => {
  // this is the data stored to the session
  const sessionUser = { id: user.id, name: user.name, group: user.group };
  done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => {
  // hit the db here if session doesn't have all the data you need on the user
  // this sets req.user
  done(null, sessionUser);
});

app.use(bodyParser.urlencoded({ extended: false })); // parse x-www-form-urlencoded
app.use(bodyParser.json()); // parse json
app.use(session({
  saveUninitialized: false, // save new sessions only when modified (e.g. login sessions)
  resave: false, // don't resave to store if not modified
  store: new KnexSessionStore({ knex: db }),
  secret: 'sekkrett',
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json({
      login: 'ok',
    });
  });

app.get('/api/logout',
  (req, res) => {
    req.logout();
    res.json({
      logout: 'ok',
    });
  });

app.get('/api/agrument', getAgrument);

const dashRouter = express.Router();
dashRouter.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
});
dashRouter.get('/user', getUserData);
dashRouter.get('/pending', getPendingSubmissions);
dashRouter.post('/pending/edit/:id', editPendingSubmission);
dashRouter.get('/votable', getVotableSubmissions);
dashRouter.get('/pinned', getPinnedMessages);
dashRouter.post('/pinned/add', addPinnedMessage);
dashRouter.delete('/pinned/remove/:id', removePinnedMessage);
app.use('/api/dash', dashRouter);

app.get(['/api', '/api/*'], (req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

app.get('*', middleware);

const port = parseInt(process.env.PORT, 10) || 80;

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.info(`Server started on port ${port} -- http://localhost:${port}`);
  }
});
