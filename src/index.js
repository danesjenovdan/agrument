/**
 * This is the entry point for webpack!
 */
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'react-select/dist/react-select.css';
import 'cropperjs/dist/cropper.css';

// import rootRoute from './routes';
import App from './containers/App';
import Agrument from './pages/Agrument';
import Dashboard from './pages/Dashboard';
import './styles/general.scss';

const RootComponent = () => (
  <BrowserRouter>
    <App>
      <Route exact path="/" component={Agrument} />
      <Route path="/dash" component={Dashboard} />
    </App>
  </BrowserRouter>
);

render(<RootComponent />, document.getElementById('root'));
