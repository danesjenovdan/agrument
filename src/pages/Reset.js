import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import RegisterForm from '../components/Dashboard/RegisterForm';

const Reset = ({ state }) => (
  <div>
    <Helmet>
      <title>Spremeni podatke</title>
    </Helmet>
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Spremeni podatke"
        small
      />
      <RegisterForm data={state.forms.register} title="Spremeni podatke" canChangeUsername={false} />
    </div>
  </div>
);

Reset.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Reset;
