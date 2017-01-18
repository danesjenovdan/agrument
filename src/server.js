/**
 * This is the entry point for the production server, don't include this file in anything that would
 * pass trough webpack!
 */

import path from 'path';
import express from 'express';
import middleware from './middleware';

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));
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
