import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import RenderSpinner from '../hoc/RenderSpinner';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';

import store from '../store';

class Dashboard extends React.Component {
  componentDidMount() {
    store.emit('user:fetch', this.props.history);
  }

  render() {
    const { state } = this.props;
    return (
      <div>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="container-fluid">
          <Header
            title="Agrument"
            subTitle="Dashboard"
            small
          />
          <RenderSpinner isLoading={state.user.isLoading} data={state.user.data}>
            {() => (
              <DashContainer state={state} />
            )}
          </RenderSpinner>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  state: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(Dashboard);
