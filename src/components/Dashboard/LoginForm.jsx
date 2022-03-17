import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../store/slices/user.js';
import { parseQuery } from '../../utils/query.js';
import { login, logout } from '../../utils/requests/login.js';
import Button from '../FormControl/Button.jsx';
import Input from '../FormControl/Input.jsx';

export default function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [{ username, password, loading, error }, setState] = useState({
    username: '',
    password: '',
    loading: false,
    error: false,
  });

  useEffect(() => {
    const { logout: logoutQuery } = parseQuery(location.search);
    if (logoutQuery) {
      logout().then(() => {
        navigate('/login', { replace: true });
      });
    } else {
      dispatch(fetchUser())
        .unwrap()
        .then(() => {
          navigate('/dash', { replace: true });
        });
    }
  }, []);

  const isButtonDisabled = !username || !password || loading;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((state) => ({
      ...state,
      [name]: value,
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
      await login(username, password);
      navigate('/dash', { replace: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed!', err);
      setState((state) => ({
        ...state,
        error: err,
        loading: false,
      }));
    }
  };

  return (
    <div className="container dash__container">
      <form action="/api/login" method="post" onSubmit={onSubmitForm}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="form-group">
              <h3>Prijava</h3>
            </div>
            <div className="form-group">
              <Input
                name="username"
                placeholder="username"
                value={username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <Input
                name="password"
                placeholder="password"
                type="password"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              {error ? (
                <h4 className="text-center">Napaka pri prijavi!</h4>
              ) : null}
              <Button type="submit" block disabled={isButtonDisabled}>
                Prijavi se!
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
