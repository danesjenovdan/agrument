import React, { PropTypes } from 'react';
import './style.scss';

const App = props => (
  <div className="container-fluid">
    {props.children}
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
