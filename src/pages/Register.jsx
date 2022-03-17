import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header.jsx';
import RegisterForm from '../components/Dashboard/RegisterForm.jsx';

export default function Register() {
  return (
    <div>
      <Helmet>
        <title>Registracija</title>
      </Helmet>
      <div className="container-fluid">
        <Header title="Agrument" subTitle="Registracija" small />
        <RegisterForm
          /* data={state.forms.register} */ data={{}}
          title="Registracija"
        />
      </div>
    </div>
  );
}
