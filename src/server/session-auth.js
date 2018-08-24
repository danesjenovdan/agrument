import _ from 'lodash';
import session from 'express-session';
import sessionKnex from 'connect-session-knex';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passwordHashAndSalt from 'password-hash-and-salt';
import db from './database';
import config from '../../config';

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

function useSessionAuth(app) {
  const KnexSessionStore = sessionKnex(session);

  app.use(session({
    saveUninitialized: false, // save new sessions only when modified (e.g. login sessions)
    resave: false, // don't resave to store if not modified
    store: new KnexSessionStore({ knex: db }),
    secret: config.SESSION_SECRET,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

export default useSessionAuth;
