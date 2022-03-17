import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Input from '../FormControl/Input.jsx';
import Button from '../FormControl/Button.jsx';
import { parseQuery } from '../../utils/query.js';

// import store from '../../store';

function onValueChange(key) {
  return (event) => {
    const { value } = event.target;
    // store.emit('registerform:update', key, value);
  };
}

function isButtonDisabled(data) {
  if (data.isLoading) {
    return true;
  }
  if (
    !data.password ||
    data.password.length < 8 ||
    data.password !== data.passwordRepeat
  ) {
    return true;
  }
  return false;
}

export default function RegisterForm({ data, canChangeUsername, title }) {
  const location = useLocation();

  const { id, token } = parseQuery(location.search);

  const onSubmitForm = async (event) => {
    event.preventDefault();
    // store.emit('registerform:submit', id, token, history);
  };

  if (!id || !token) {
    return <div>TODO: redirect to /</div>;
  }

  return (
    <div className="container dash__container">
      <form onSubmit={onSubmitForm}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="form-group">
              <h3>{title}</h3>
            </div>
            {canChangeUsername ? (
              <div className="form-group">
                <Input
                  label="Uporabniško ime"
                  value={data.username}
                  onChange={onValueChange('username')}
                />
              </div>
            ) : null}
            <div className="form-group">
              <Input
                label="Ime in priimek"
                value={data.name}
                onChange={onValueChange('name')}
              />
            </div>
            <div className="form-group">
              <Input
                label="Novo geslo (naj bo dolgo vsaj 8 znakov)"
                type="password"
                value={data.password}
                onChange={onValueChange('password')}
              />
              {data.password && data.password.length < 8 ? (
                <h4 className="text-center">Geslo ni veljavno!</h4>
              ) : null}
            </div>
            <div className="form-group">
              <Input
                label="Ponovi geslo"
                type="password"
                value={data.passwordRepeat}
                onChange={onValueChange('passwordRepeat')}
              />
              {data.password &&
              data.passwordRepeat &&
              data.password !== data.passwordRepeat ? (
                <h4 className="text-center">Gesli se ne ujemata!</h4>
              ) : null}
            </div>
            <div className="form-group">
              {data.error ? (
                <h4 className="text-center">Napaka pri registraciji!</h4>
              ) : null}
              <Button type="submit" block disabled={isButtonDisabled(data)}>
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
  data: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.bool,
    name: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    passwordRepeat: PropTypes.string,
  }).isRequired,
  canChangeUsername: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

RegisterForm.defaultProps = {
  canChangeUsername: true,
};
