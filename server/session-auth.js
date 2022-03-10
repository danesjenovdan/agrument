import _ from 'lodash';
import { Authenticator } from 'fastify-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import fastifyCookie from 'fastify-cookie';
import fastifySession from '@fastify/session';
import sessionKnex from 'connect-session-knex';
import passwordHashAndSalt from 'password-hash-and-salt';
import db from './database.js';

function verifyUser(username, pass, done) {
  db('users')
    .where('username', username)
    .first()
    .then((user) => {
      if (user && !user.disabled) {
        passwordHashAndSalt(pass).verifyAgainst(
          user.password,
          (error, verified) => {
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
          }
        );
      } else {
        done(null, null);
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('failed to verify password hash', error);
      done(error, null);
    });
}

// eslint-disable-next-line no-unused-vars
async function serializeUser(user, request) {
  // this is the data stored to the session
  const sessionUser = _.pick(user, ['id', 'username', 'password']);
  return sessionUser;
}

// eslint-disable-next-line no-unused-vars
async function deserializeUser(sessionUser, request) {
  // hit the db here if session doesn't have all the data you need on the user
  const user = await db('users').where('id', sessionUser.id).first();

  if (user.disabled) {
    // if user is disabled don't set req.user
    return null;
  }

  if (
    user.username !== sessionUser.username ||
    user.password !== sessionUser.password
  ) {
    // if username or password hash don't match don't set req.user
    return null;
  }

  // this sets req.user
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    group: user.group,
    password: user.password,
  };
}

export default function registerSessionAuth(fastify) {
  const KnexSessionStore = sessionKnex(fastifySession);

  const sessionOptions = {
    saveUninitialized: false, // save new sessions only when modified (e.g. login sessions)
    resave: false, // don't resave to store if not modified
    store: new KnexSessionStore({ knex: db }),
    secret: process.env.SESSION_SECRET,
    cookie: {},
  };

  // if (app.get('env') === 'production') {
  //   app.set('trust proxy', 1); // trust first proxy
  //   sessionOptions.cookie.secure = true; // serve secure cookies
  //   sessionOptions.cookie.maxAge = 1000 * 60 * 60 * 24 * 14; // 14 days
  // }

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, sessionOptions);

  const fastifyPassport = new Authenticator();
  fastifyPassport.registerUserSerializer(serializeUser);
  fastifyPassport.registerUserDeserializer(deserializeUser);
  fastify.register(fastifyPassport.initialize());
  fastifyPassport.use('local', new LocalStrategy(verifyUser));
}
