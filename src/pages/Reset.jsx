import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header.jsx';
import RegisterForm from '../components/Dashboard/RegisterForm.jsx';

export default function Reset({ state }) {
  return (
    <div>
      <Helmet>
        <title>Spremeni podatke</title>
      </Helmet>
      <div className="container-fluid">
        <Header title="Agrument" subTitle="Spremeni podatke" small />
        <RegisterForm
          /* data={state.forms.register} */ data={{}}
          title="Spremeni podatke"
          canChangeUsername={false}
        />
      </div>
    </div>
  );
}

Reset.propTypes = {
  state: PropTypes.shape().isRequired,
};
