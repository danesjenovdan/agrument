import App from '../containers/App';

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
      path: '/dash',
      getComponent(location, cb) {
        System.import('./Dashboard')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/(:date)', // available as: this.props.params['date']
      getComponent(location, cb) {
        System.import('./Agrument')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
  ],
};
