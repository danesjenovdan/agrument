/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import renderApp from './middleware/app';
import agrumentRouter from './routes/agrument';
import dashRouter from './routes/dashboard';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import apiRouterV2 from './routes/api_v2';
import feedRouter from './routes/feed';
import { sendErrorToSlack, sendErrorToSlackMiddleware } from './slack';
import useSessionAuth from './session-auth';

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

const app = express();
app.disable('x-powered-by');

// serve static files first so you dont create new sessions for static files
app.use(express.static(path.resolve(__dirname, '../../dist')));
app.use('/media', express.static(path.resolve(__dirname, '../../media')));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// public api based on REST, JSONFeed
app.use('/api/v2', apiRouterV2);

// free public api (with cors)
app.use('/get', apiRouter);

// rss/atom/json feeds
app.use('/rss', feedRouter);

// get published posts for public feed
app.use('/api/agrument', agrumentRouter);

// add session and auth (passport) to app
// every route registered after this has access to auth (req.user) and sessions
useSessionAuth(app);

// login/logout/register routes
app.use('/api/auth', authRouter);

// private api for dashboard that requires logged in users
app.use('/api/dash', dashRouter);

// any other api route returns 400
app.use(['/api', '/api/*'], (req, res) => {
  res.status(400).json({
    error: 'Bad Request',
  });
});

// any other GET route renders html + react
app.get('*', renderApp);

// if no one handled the route return 404
app.get('*', (req, res) => {
  res.status(404).send('TODO: == 404 Not Found == ');
});

// catch-all error handler (needs all 4 args)
// eslint-disable-next-line no-unused-vars
// app.use((error, req, res, next) => {
//   console.log('error', error);
//   res.status(500).send('TODO: == 500 Server Error == ');
// });

// error handler
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
