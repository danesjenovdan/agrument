import React from 'react';
import Header from '../components/Header';
import AgrumentContainer from '../components/Agrument/Container';

const Agrument = () => (
  <div>
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Divja misel kiselkastega okusa. Dnevna doza sezonskih in osvežilnih natipkov. Vsi naši izdelki so sveži, pripravljeni po lastni recepturi in ne vsebujejo €-jev."
      />
      <AgrumentContainer />
    </div>
  </div>
);

export default Agrument;
