/**
 * This is the entry point for webpack!
 */
import React from 'react';
import { render, hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './styles/general.scss';

import App from './containers/App';

const RootComponent = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

hydrate(<RootComponent />, document.getElementById('root'));
