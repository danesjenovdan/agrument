import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import './style.scss';

const App = props => (
  <div className="container-fluid">
    <Helmet
      defaultTitle="Agrument"
      titleTemplate="%s - Agrument"
    />
    {props.children}
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
