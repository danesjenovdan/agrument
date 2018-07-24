/**
 * This is the entry point for webpack!
 */
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './styles/general.scss';

import App from './containers/App';

const RootComponent = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

render(<RootComponent />, document.getElementById('root'));
