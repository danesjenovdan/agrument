import apiV2 from './api_v2.js';
import api from './api.js';
import feed from './feed.js';
import agrument from './agrument.js';

export function registerPublicApi(fastify) {
  // public api based on REST, JSONFeed
  fastify.register(apiV2, { prefix: '/api/v2' });

  // misc public api
  fastify.register(api, { prefix: '/get' });

  // rss/atom/json feeds
  fastify.register(feed, { prefix: '/rss' });

  // get published posts for public feed
  fastify.register(agrument, { prefix: '/api/agrument' });
}

// import renderApp from './middleware/app';
// import dashRouter from './routes/dashboard';
// import authRouter from './routes/auth';
// import useSessionAuth from './session-auth';

// process.on('uncaughtException', (err) => {
//   // eslint-disable-next-line no-console
//   console.error(err);
//   sendErrorToSlack('uncaughtException', err, () => {
//     process.exit(1);
//   });
// });

// process.on('unhandledRejection', (reason, p) => {
//   // eslint-disable-next-line no-console
//   console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
//   sendErrorToSlack('unhandledRejection', reason, () => {
//     process.exit(1);
//   });
// });

// add session and auth (passport) to app
// every route registered after this has access to auth (req.user) and sessions
// useSessionAuth(app);

// // login/logout/register routes
// app.use('/api/auth', authRouter);

// // private api for dashboard that requires logged in users
// app.use('/api/dash', dashRouter);

// // any other api route returns 400
// app.use(['/api', '/api/*'], (req, res) => {
//   res.status(400).json({
//     error: 'Bad Request',
//   });
// });

// // any other GET route renders html + react
// app.get('*', renderApp);

// // if no one handled the route return 404
// app.get('*', (req, res) => {
//   // eslint-disable-next-line no-console
//   console.log(`404: ${req.url}`);
//   res.redirect('/');
// });

// catch-all error handler (needs all 4 args)
// eslint-disable-next-line no-unused-vars
// app.use((error, req, res, next) => {
//   console.log('error', error);
//   res.status(500).send('TODO: == 500 Server Error == ');
// });

// error handler
// app.use(sendErrorToSlackMiddleware);
