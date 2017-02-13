import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';
import SideMenu from '../components/SideMenu';

const Dashboard = ({ state }) => (
  <div>
    <Helmet title="Dashboard" />
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

Dashboard.propTypes = {
  state: PropTypes.shape(),
};

Dashboard.defaultProps = {
  state: {},
};

export default Dashboard;
