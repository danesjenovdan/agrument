/* eslint-disable global-require */
const { merge } = require('lodash');

const config = {
  SESSION_SECRET: 'sekkrett',
  TWITTER_SECRET: '',
};

if (process.env.NODE_ENV === 'production') {
  return merge({}, config, require('./production'));
}

return config;
