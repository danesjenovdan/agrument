import React from 'react';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import DashContainer from '../components/Dashboard/Container';
import SideMenu from '../components/SideMenu';

const Dashboard = () => (
  <div>
    <Helmet title="Dashboard" />
    <SideMenu />
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Dashboard"
        small
      />
      <DashContainer />
    </div>
  </div>
);

export default Dashboard;
