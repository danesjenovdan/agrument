import React, { PropTypes } from 'react';
import Header from '../../components/Header';
import AgrumentContainer from '../../components/Agrument/Container';
import SideMenu from '../../components/SideMenu';

const Home = ({ params }) => (
  <div>
    <SideMenu />
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Divja misel kiselkastega okusa. Dnevna doza sezonskih in osvežilnih natipkov. Vsi naši izdelki so sveži, pripravljeni po lastni recepturi in ne vsebujejo €-jev."
      />
      <AgrumentContainer params={params} />
    </div>
  </div>
);

Home.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Home;
