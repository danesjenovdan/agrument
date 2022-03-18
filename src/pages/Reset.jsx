import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header.jsx';
import RegisterForm from '../components/Dashboard/RegisterForm.jsx';

export default function Reset() {
  return (
    <div>
      <Helmet>
        <title>Spremeni podatke</title>
      </Helmet>
      <div className="container-fluid">
        <Header title="Agrument" subTitle="Spremeni podatke" small />
        <RegisterForm title="Spremeni podatke" canChangeUsername={false} />
      </div>
    </div>
  );
}
