import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Reset from './pages/Reset.jsx';
// import Dashboard from '../pages/Dashboard';
import Agrument from './pages/Agrument.jsx';

// import store from '../store';
// import initReactions from '../reactions';

// initReactions(store);

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
  // {
  //   path: '/dash',
  //   component: Dashboard,
  // },
  {
    path: '*',
    component: Agrument,
  },
];

class App extends React.Component {
  componentDidMount() {
    // store.on('update', () => {
    //   this.forceUpdate();
    // });
  }

  render() {
    // const state = store.get();
    return (
      <>
        <Helmet
          titleTemplate="%s - Agrument Dashboard"
          defaultTitle="Agrument Dashboard"
        />
        <Routes>
          {routes.map((r) => (
            <Route
              key={`route[${r.path}]`}
              path={r.path}
              element={<r.component /* state={state} */ />}
            />
          ))}
        </Routes>
      </>
    );
  }
}

export default App;
