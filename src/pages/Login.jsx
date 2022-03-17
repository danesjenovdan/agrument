import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header.jsx';
import LoginForm from '../components/Dashboard/LoginForm.jsx';

export default function Login() {
  return (
    <div>
      <Helmet>
        <title>Prijava</title>
      </Helmet>
      <div className="container-fluid">
        <Header title="Agrument" subTitle="Prijava" small />
        <LoginForm />
      </div>
    </div>
  );
}
