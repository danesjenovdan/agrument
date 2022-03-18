import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../FormControl/Input.jsx';
import Button from '../FormControl/Button.jsx';
import { parseQuery } from '../../utils/query.js';
import { register } from '../../utils/requests/login.js';

export default function RegisterForm({ canChangeUsername, title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [
    { username, name, password, passwordRepeat, loading, error },
    setState,
  ] = useState({
    username: '',
    name: '',
    password: '',
    passwordRepeat: '',
    loading: false,
    error: false,
  });

  const { id, token } = parseQuery(location.search);

  const isButtonDisabled =
    !password || password.length < 8 || password !== passwordRepeat || loading;

  const handleInputChange = (event) => {
    const { name: inputName, value } = event.target;
    setState((state) => ({
      ...state,
      [inputName]: value,
    }));
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    setState((state) => ({
      ...state,
      error: false,
      loading: true,
    }));

    try {
      await register(id, token, name, username, password);
      navigate('/login');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Registration failed!', err);
      setState((state) => ({
        ...state,
        error: err,
        loading: false,
      }));
    }
  };

  if (!id || !token) {
    return <div>TODO: redirect to /</div>;
  }

  return (
    <div className="container dash__container">
      <form method="post" onSubmit={onSubmitForm}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="form-group">
              <h3>{title}</h3>
            </div>
            {canChangeUsername ? (
              <div className="form-group">
                <Input
                  name="username"
                  label="Uporabniško ime"
                  value={username}
                  onChange={handleInputChange}
                  autoFocus={canChangeUsername}
                />
              </div>
            ) : null}
            <div className="form-group">
              <Input
                name="name"
                label="Ime in priimek"
                value={name}
                onChange={handleInputChange}
                autoFocus={!canChangeUsername}
              />
            </div>
            <div className="form-group">
              <Input
                name="password"
                label="Novo geslo (naj bo dolgo vsaj 8 znakov)"
                type="password"
                value={password}
                onChange={handleInputChange}
              />
              {password && password.length < 8 ? (
                <h4 className="text-center">Geslo ni veljavno!</h4>
              ) : null}
            </div>
            <div className="form-group">
              <Input
                name="passwordRepeat"
                label="Ponovi geslo"
                type="password"
                value={passwordRepeat}
                onChange={handleInputChange}
              />
              {password && passwordRepeat && password !== passwordRepeat ? (
                <h4 className="text-center">Gesli se ne ujemata!</h4>
              ) : null}
            </div>
            <div className="form-group">
              {error ? (
                <h4 className="text-center">Napaka pri registraciji!</h4>
              ) : null}
              <Button type="submit" block disabled={isButtonDisabled}>
                Pošlji!
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

RegisterForm.propTypes = {
  canChangeUsername: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

RegisterForm.defaultProps = {
  canChangeUsername: true,
};
