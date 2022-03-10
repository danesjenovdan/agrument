import apiV2 from './api_v2.js';
import api from './api.js';
import feed from './feed.js';
import agrument from './agrument.js';
import auth from './auth.js';
import dashboardUser from './dashboard/user.js';

export function registerPublicApi(fastify) {
  // public api based on REST, JSONFeed
  fastify.register(apiV2, { prefix: '/api/v2' });

  // misc public api
  fastify.register(api, { prefix: '/get' });

  // rss/atom/json feeds
  fastify.register(feed, { prefix: '/rss' });

  // old public api
  fastify.register(agrument, { prefix: '/api/agrument' });
}

export function registerAuthenticatedApi(fastify, fastifyPassport) {
  // login/logout/register routes
  fastify.register(auth, { prefix: '/api/auth', fastifyPassport });

  // private api for dashboard that requires logged in users
  fastify.register(dashboardUser, { prefix: '/api/dash' });

  // private api for dashboard that requires logged in users
  // fastify.register(dashboardAdmin, { prefix: '/api/dash' });
}

// import renderApp from './middleware/app';

// // any other api route returns 400
// app.use(['/api', '/api/*'], (req, res) => {
//   res.status(400).json({
//     error: 'Bad Request',
//   });
// });

// // any other GET route renders html + react
// app.get('*', renderApp);
