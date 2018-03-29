import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Agrument from '../pages/Agrument';

import store from '../store';
import initReactions from '../reactions';

initReactions(store);

// TODO: lazy loading and other routes
// import rootRoute from './routes';

class App extends React.Component {
  componentDidMount() {
    store.on('update', () => {
      this.forceUpdate();
    });
  }

  render() {
    const state = store.get();
    return (
      <Fragment>
        <SideMenu />
        <Switch>
          <Route path="/login" render={() => <Login state={state} />} />
          <Route path="/register" render={() => <Register state={state} />} />
          <Route path="/dash" render={() => <Dashboard state={state} />} />
          <Route path="/" render={() => <Agrument state={state} />} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
