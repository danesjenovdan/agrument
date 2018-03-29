import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import Header from '../components/Header';
import RegisterForm from '../components/Dashboard/RegisterForm';

const Register = ({ state }) => (
  <div>
    {/* <Helmet title="Register" /> */}
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Register"
        small
      />
      <RegisterForm data={state.forms.register} />
    </div>
  </div>
);

Register.propTypes = {
  state: PropTypes.shape().isRequired,
};

Register.defaultProps = {
  state: {},
};

export default Register;
