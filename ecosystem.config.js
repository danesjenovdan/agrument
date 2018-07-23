const project = 'agrument';
const command = [
  'npm i && npm run build && npm run migrate && pm2 startOrRestart ecosystem.config.js',
].join(' ');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: project,
    script: 'dist_server/server.js',
    env: {
      PORT: 8000,
    },
    env_production: {
      PORT: 2000,
    },
  }],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'agrumentator',
      host: 'agrument.djnd.si',
      ref: 'origin/master',
      repo: `https://github.com/danesjenovdan/${project}.git`,
      path: `/home/agrumentator/${project}`,
      'post-deploy': `${command} --env production --update-env`,
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
