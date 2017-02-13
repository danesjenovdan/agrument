import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import store from '../store';
import initReactions from '../reactions';

initReactions(store);

class App extends React.Component {
  componentDidMount() {
    // re-render the app on store updates
    store.on('update', () => {
      console.log('App.forceUpdate');
      this.forceUpdate();
    });
  }

  render() {
    const { children } = this.props;
    const state = store.get();
    return (
      <div>
        <Helmet
          defaultTitle="Agrument"
          titleTemplate="%s - Agrument"
        />
        {React.Children.map(children, child => React.cloneElement(child, { state }))}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
