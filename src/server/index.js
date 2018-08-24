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

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); // parse x-www-form-urlencoded
app.use(bodyParser.json({ extended: true, limit: '50mb' })); // parse json

app.use('/api/v2', apiRouterV2);

app.use('/get', apiRouter);
app.use('/rss', feedRouter);

// everything after this creates sessions
useSessionAuth(app);

app.use('/api', authRouter);

app.use('/api/agrument', agrumentRouter);

app.use('/api/dash', dashRouter);

app.get(['/api', '/api/*'], (req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

app.get('*', renderApp);

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
