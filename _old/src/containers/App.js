import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Reset from '../pages/Reset';
import Dashboard from '../pages/Dashboard';
import Agrument from '../pages/Agrument';

import store from '../store';
import initReactions from '../reactions';

initReactions(store);

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/reset',
    component: Reset,
  },
  {
    path: '/dash',
    component: Dashboard,
  },
  {
    path: '/',
    component: Agrument,
  },
];

class App extends React.Component {
  componentDidMount() {
    store.on('update', () => {
      this.forceUpdate();
    });
  }

  render() {
    const state = store.get();
    return (
      <Switch>
        {routes.map((r) => <Route key={`route[${r.path}]`} path={r.path} render={() => <r.component state={state} />} />)}
      </Switch>
    );
  }
}

export default App;
export { routes };
