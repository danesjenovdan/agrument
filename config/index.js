/* eslint-disable global-require */
const { merge } = require('lodash');

const config = {
  SLACK_WEBHOOK_URL: '',
  SESSION_SECRET: 'sekkrett',
  TWITTER_SECRET: '',
  // These MEDIA_PATH and MEDIA_URL default values are what is served by express
  // if you change them in your config make sure you configure an external server
  // like nginx to serve the files from the corect folder and location.
  MEDIA_PATH: './media/', // images are saved to this path
  MEDIA_URL: '/media/', // images are served from this url
};

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line import/no-unresolved
  module.exports = merge({}, config, require('./production'));
} else {
  module.exports = config;
}
