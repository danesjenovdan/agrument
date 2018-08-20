/* eslint-disable global-require */
const { merge } = require('lodash');

const config = {
  SESSION_SECRET: 'sekkrett',
  TWITTER_SECRET: '',
  MEDIA_PATH: './media/',
  MEDIA_URL: '/media/',
};

if (process.env.NODE_ENV === 'production') {
  module.exports = merge({}, config, require('./production'));
} else {
  module.exports = config;
}
