/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */
import path from 'path';
import express from 'express';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
import middleware from './middleware';
import getAgrument from './api/agrument';
import {
  getPendingSubmissions,
  getVotableSubmissions,
  getPinnedMessages,
  addPinnedMessage,
  removePinnedMessage,
} from './api/dash';

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();

// passport.use(new LocalStrategy((username, password, done) => {
//   // TODO: FIXME: actual security
//   const user = { id: 0, name: 'Test User' };
//   return done(null, user);
// }));

app.use(express.static(path.resolve(__dirname, '../dist')));

// app.use(cookieParser());
// app.use(express.bodyParser());
// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.post('/api/login',
//   passport.authenticate('local', {
//     successRedirect: '/dash',
//     failureRedirect: '/api/login',
//   }),
// (req, res, next) => { console.log(req.user); next(); });

app.get('/api/login', (req, res) => {
  res.send(`
    <form action="/api/login" method="post">
      <div>
          <label>Username:</label>
          <input type="text" name="username"/>
      </div>
      <div>
          <label>Password:</label>
          <input type="password" name="password"/>
      </div>
      <div>
          <input type="submit" value="Log In"/>
      </div>
    </form>
  `);
});

app.get('/api/agrument', getAgrument);

const dashRouter = express.Router();
// dashRouter.use(passport.authenticate('local', {
//   successRedirect: '/dash',
//   failureRedirect: '/api/login',
// }));
// dashRouter.use(loginMiddleware); // TODO: use auth (passports)
dashRouter.get('/pending', getPendingSubmissions);
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
