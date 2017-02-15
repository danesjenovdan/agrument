import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';

import store from '../../store';

function onValueChange(key) {
  return (event) => {
    const value = event.target.value;
    store.trigger('registerform:update', key, value);
  };
}

function onFormSubmit(id, token) {
  return (event) => {
    event.preventDefault();
    store.trigger('registerform:submit', id, token);
  };
}

const RegisterForm = ({ data, location }) => (
  <div className="container dash__container">
    <form onSubmit={onFormSubmit(location.query.id, location.query.token)}>
      <div className="row" >
        <div className="col-md-8 col-md-offset-2">
          Polno ime:
        <input className="form-control" value={data.name} onChange={onValueChange('name')} />
        </div>
        <div className="col-md-8 col-md-offset-2">
          Uporabniško ime:
        <input className="form-control" value={data.username} onChange={onValueChange('username')} />
        </div>
        <div className="col-md-8 col-md-offset-2">
          Geslo:
        <input className="form-control" type="password" value={data.password} onChange={onValueChange('password')} />
        </div>
        <div className="col-md-8 col-md-offset-2">
          {data.error
            ? <h4>Napaka pri registraciji!</h4>
            : <br />}
          <button className="btn btn-primary" disabled={data.isLoading}>Registriraj!</button>
        </div>
      </div>
    </form>
  </div>
);

RegisterForm.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      id: PropTypes.string,
      token: PropTypes.string,
    }),
  }).isRequired,
  data: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.bool,
    name: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
};

export default withRouter(RegisterForm);
