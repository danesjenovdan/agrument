import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import LoginForm from '../components/Dashboard/LoginForm';

const Login = () => (
  <div>
    <Helmet>
      <title>Login</title>
    </Helmet>
    <div className="container-fluid">
      <Header
        title="Agrument"
        subTitle="Dashboard"
        small
      />
      <LoginForm />
    </div>
  </div>
);

export default Login;
