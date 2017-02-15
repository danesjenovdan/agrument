import App from './containers/App';

function errorLoading(err) {
  console.error('Dynamic page loading failed', err);
}

function loadRoute(cb) {
  return module => cb(null, module.default);
}

export default {
  component: App,
  childRoutes: [
    {
      path: '/login',
      getComponent(location, cb) {
        System.import('./pages/Login')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/register',
      getComponent(location, cb) {
        System.import('./pages/Register')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/dash',
      getComponent(location, cb) {
        System.import('./pages/Dashboard')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/(:date)', // available as: this.props.params['date']
      getComponent(location, cb) {
        System.import('./pages/Agrument')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
  ],
};
