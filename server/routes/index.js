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
