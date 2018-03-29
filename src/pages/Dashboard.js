import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { Switch, Route, withRouter } from 'react-router-dom';
import { autobind } from 'core-decorators';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';
import DashContainerEdit from '../components/Dashboard/ContainerEdit';

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
    let content = null;
    if (state.user.isLoading) {
      content = (
        <Spinner />
      );
    } else if (state.user.data) {
      content = (
        <Switch>
          <Route path="/dash/edit/:date" render={() => <DashContainerEdit state={state} />} />
          <Route path="/dash" render={() => <DashContainer state={state} />} />
        </Switch>
      );
    }
    return (
      <div>
        {/* <Helmet title="Dashboard" /> */}
        <div className="container-fluid">
          <Header
            title="Agrument"
            subTitle="Dashboard"
            small
          />
          {content}
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
