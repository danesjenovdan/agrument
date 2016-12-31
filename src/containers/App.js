import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const App = ({ children }) => (
  <div>
    <Helmet
      defaultTitle="Agrument"
      titleTemplate="%s - Agrument"
    />
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
