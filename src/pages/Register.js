import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import RegisterForm from '../components/Dashboard/RegisterForm';

const Register = ({ state }) => (
  <div>
    <Helmet>
      <title>Registracija</title>
    </Helmet>
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Registracija"
        small
      />
      <RegisterForm data={state.forms.register} title="Registracija" />
    </div>
  </div>
);

Register.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Register;
