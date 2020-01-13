import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import Input from '../FormControl/Input';
import Button from '../FormControl/Button';
import { parseSearch } from '../../utils/url';

import store from '../../store';

function onValueChange(key) {
  return (event) => {
    const { value } = event.target;
    store.emit('registerform:update', key, value);
  };
}

function onFormSubmit(id, token, history) {
  return (event) => {
    event.preventDefault();
    store.emit('registerform:submit', id, token, history);
  };
}

function isButtonDisabled(data) {
  if (data.isLoading) {
    return true;
  }
  if (!data.password || data.password.length < 8 || data.password !== data.passwordRepeat) {
    return true;
  }
  return false;
}

const RegisterForm = ({
  data,
  location,
  history,
  canChangeUsername,
  title,
}) => {
  const { id, token } = parseSearch(location.search);
  if (!id || !token) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container dash__container">
      <form onSubmit={onFormSubmit(id, token, history)}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="form-group">
              <h3>{title}</h3>
            </div>
            {canChangeUsername ? (
              <div className="form-group">
                <Input label="Uporabniško ime" value={data.username} onChange={onValueChange('username')} />
              </div>
            ) : null}
            <div className="form-group">
              <Input label="Ime in priimek" value={data.name} onChange={onValueChange('name')} />
            </div>
            <div className="form-group">
              <Input label="Novo geslo (naj bo dolgo vsaj 8 znakov)" type="password" value={data.password} onChange={onValueChange('password')} />
              {data.password && data.password.length < 8 ? (
                <h4 className="text-center">Geslo ni veljavno!</h4>
              ) : null}
            </div>
            <div className="form-group">
              <Input label="Ponovi geslo" type="password" value={data.passwordRepeat} onChange={onValueChange('passwordRepeat')} />
              {data.password && data.passwordRepeat && data.password !== data.passwordRepeat ? (
                <h4 className="text-center">Gesli se ne ujemata!</h4>
              ) : null}
            </div>
            <div className="form-group">
              {data.error ? (
                <h4 className="text-center">Napaka pri registraciji!</h4>
              ) : null}
              <Button type="submit" block disabled={isButtonDisabled(data)}>Pošlji!</Button>
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
  canChangeUsername: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

RegisterForm.defaultProps = {
  canChangeUsername: true,
};

export default withRouter(RegisterForm);
