import React from 'react'; import PropTypes from 'prop-types';
import Header from '../components/Header';
import AgrumentContainer from '../components/Agrument/Container';
import SideMenu from '../components/SideMenu';

const Agrument = ({ params }) => (
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

Agrument.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Agrument;
