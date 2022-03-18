import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Reset from './pages/Reset.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Agrument from './pages/Agrument.jsx';

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
    path: '/dash/*',
    component: Dashboard,
  },
  {
    path: '*',
    component: Agrument,
  },
];

export default function App() {
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
            element={<r.component />}
          />
        ))}
      </Routes>
    </>
  );
}
