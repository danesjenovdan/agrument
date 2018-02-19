import React from 'react'; import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';
import SideMenu from '../components/SideMenu';

class Dashboard extends React.Component {
  componentDidMount() {
    // this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    console.warn('------------------------');
    console.warn(this.context);
  }

  @autobind
  routerWillLeave() {
    if (this.props.state.currentEditor || this.props.state.currentEditorRTE) {
      return 'Changes you made may not be saved. Are you sure you want to leave?';
    }
    return true;
  }

  render() {
    const { state } = this.context;
    return (
      <div>
        {/* <Helmet title="Dashboard" /> */}
        <SideMenu />
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
  state: PropTypes.shape(),
  // router: PropTypes.shape().isRequired,
  // route: PropTypes.shape().isRequired,
};

Dashboard.defaultProps = {
  state: {},
};

Dashboard.contextTypes = {
  state: PropTypes.shape(),
};

export default Dashboard;
