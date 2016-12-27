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
      path: '/(:date)', // available as: this.props.params['date']
      getComponent(location, cb) {
        System.import('./Home')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
    /* {
      path: 'blog',
      getComponent(location, cb) {
        System.import('./Blog')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },
    {
      path: 'about',
      getComponent(location, cb) {
        System.import('./About')
          .then(loadRoute(cb))
          .catch(errorLoading);
      },
    },// */
  ],
};
