import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { autobind } from 'core-decorators';
import RenderSpinner from '../hoc/RenderSpinner';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';

import store from '../store';

class Dashboard extends React.Component {
  componentDidMount() {
    store.trigger('user:fetch', this.props.history);
  }

  @autobind
  routerWillLeave() {
    if (this.props.state.currentEditor || this.props.state.currentEditorRTE) {
      return 'Changes you made may not be saved. Are you sure you want to leave?';
    }
    return true;
  }

  render() {
    const { state } = this.props;
    return (
      <div>
        {/* <Helmet title="Dashboard" /> */}
        <div className="container-fluid">
          <Header
            title="Agrument"
            subTitle="Dashboard"
            small
          />
          <RenderSpinner isLoading={state.user.isLoading} hasData={state.user.data}>
            <DashContainer state={state} />;
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
