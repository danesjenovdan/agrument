import { render } from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router/es6';
import rootRoute from './pages/routes';
import './styles/general.scss';

render(<Router history={browserHistory} routes={rootRoute} scrollStrategy="none" />, document.getElementById('root'));
