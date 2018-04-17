import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Edit from './subpages/Edit';
import List from './subpages/List';
import Main from './subpages/Main';

const Container = ({ state }) => (
  <div className="container dash__container">
    <Navbar user={state.user.data} />
    <Switch>
      <Route path="/dash/edit/:date" render={() => <Edit state={state} />} />
      <Route path="/dash/list" render={() => <List state={state} />} />
      <Route path="/dash" render={() => <Main state={state} />} />
    </Switch>
  </div>
);

Container.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Container;
