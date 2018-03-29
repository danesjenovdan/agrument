import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Input from '../FormControl/Input';
import Button from '../FormControl/Button';
import { parseSearch } from '../../utils/url';

import store from '../../store';

function onValueChange(key) {
  return (event) => {
    const value = event.target.value;
    store.trigger('registerform:update', key, value);
  };
}

function onFormSubmit(id, token, history) {
  return (event) => {
    event.preventDefault();
    store.trigger('registerform:submit', id, token, history);
  };
}

const RegisterForm = ({ data, location, history }) => {
  const { id, token } = parseSearch(location.search);
  return (
    <div className="container dash__container">
      <form onSubmit={onFormSubmit(id, token, history)}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="form-group">
              <h3>Registracija</h3>
            </div>
            <div className="form-group">
              <Input label="Ime in priimek" value={data.name} onChange={onValueChange('name')} />
            </div>
            <div className="form-group">
              <Input label="Uporabniško ime:" value={data.username} onChange={onValueChange('username')} />
            </div>
            <div className="form-group">
              <Input label="Geslo (naj bo dolgo vsaj 8 znakov):" type="password" value={data.password} onChange={onValueChange('password')} />
            </div>
            <div className="form-group">
              {data.error ? (
                <h4 className="text-center">Napaka pri registraciji!</h4>
              ) : null}
              <Button type="submit" block disabled={data.isLoading}>Registriraj se!</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

RegisterForm.propTypes = {
  location: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  data: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.bool,
    name: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
};

export default withRouter(RegisterForm);
