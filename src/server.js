/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */
import path from 'path';
import express from 'express';
import middleware from './middleware';
import { getAgrument } from './api/agrument';
import { getPendingSubmissions, getVotableSubmissions } from './api/dash';

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/api/agrument', getAgrument);
app.get('/api/agrument/pending', getPendingSubmissions);
app.get('/api/agrument/votable', getVotableSubmissions);

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
