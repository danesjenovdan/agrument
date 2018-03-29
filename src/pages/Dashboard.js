import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';

class Dashboard extends React.Component {
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
          <DashContainer state={state} />
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Dashboard;
