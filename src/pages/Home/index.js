import React, { PropTypes } from 'react';
import Header from '../../components/Header';
import AgrumentContainer from '../../components/Agrument/Container';

// TODO: check params.date and load or redirect(replacestate) to /
const Home = ({ params }) => (
  <div>
    <Header
      title="Agrument"
      subTitle="Divja misel kiselkastega okusa. Dnevna doza sezonskih in osvežilnih natipkov. Vsi naši izdelki so sveži, pripravljeni po lastni recepturi in ne vsebujejo €-jev."
    />
    <AgrumentContainer />
  </div>
);

Home.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Home;
