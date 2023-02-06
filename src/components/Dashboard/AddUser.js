import React from 'react';
import PropTypes from 'prop-types';
import Button from '../FormControl/Button';
import InputImmutable from '../FormControl/InputImmutableAutoFocus';
import RenderSpinner from '../../hoc/RenderSpinner';

import store from '../../store';

function createUser() {
  store.emit('newuser:create');
}

function createToken(id) {
  return () => {
    store.emit('users:createtoken', id);
  };
}

function disableUser(id, disabled) {
  return () => {
    store.emit('users:disable', id, disabled);
  };
}

function getRegisterURL(id, token) {
  let url = '';
  if (typeof window !== 'undefined') {
    url += `${window.location.protocol}//${window.location.host}`;
  }
  url += `/register?id=${id}&token=${token}`;
  return url;
}

function getResetURL(id, token) {
  let url = '';
  if (typeof window !== 'undefined') {
    url += `${window.location.protocol}//${window.location.host}`;
  }
  url += `/reset?id=${id}&token=${token}`;
  return url;
}

class AddUser extends React.Component {
  componentDidMount() {
    store.emit('users:fetchtokens');
  }

  render() {
    const { state } = this.props;
    const text = (state.newUser.id && state.newUser.token) ? getRegisterURL(state.newUser.id, state.newUser.token) : '';
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-12">
            <Button block disabled={state.newUser.isLoading} onClick={createUser}>
              Ustvari povezavo za registracijo novega uporabnika
            </Button>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <InputImmutable value={text} readOnly onFocus={(e) => { e.target.select(); }} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <div className="text-center text-uppercase">
              <strong>Neaktivirane povezave</strong>
            </div>
            <RenderSpinner isLoading={state.tokenUsers.isLoading} data={state.tokenUsers.data}>
              {(data) => (
                <table className="table table-hover table-users-list">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((e) => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{getRegisterURL(e.id, e.token)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </RenderSpinner>
            <div className="text-center text-uppercase">
              <strong>Aktivni uporabniki</strong>
            </div>
            <table className="table table-hover table-users-list">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ime</th>
                  <th className="text-right">Uredi</th>
                </tr>
              </thead>
              <tbody>
                {state.users.data.filter((e) => !e.disabled).map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>
                      <div>{`${e.name} (${e.username})`}</div>
                      {e.token && (
                        <div><small>{getResetURL(e.id, e.token)}</small></div>
                      )}
                    </td>
                    <td className="text-right">
                      <button type="button" className="btn btn-primary btn-xs" onClick={createToken(e.id)} title="Ustvari povezavo za urejanje gesla">
                        <i className="glyphicon glyphicon-link" />
                      </button>
                      <button type="button" className="btn btn-danger btn-xs" onClick={disableUser(e.id, 1)} title="Onemogoči uporabnika">
                        <i className="glyphicon glyphicon-ban-circle" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center text-uppercase">
              <strong>Onemogočeni uporabniki</strong>
            </div>
            <table className="table table-hover table-users-list">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ime</th>
                  <th className="text-right">Uredi</th>
                </tr>
              </thead>
              <tbody>
                {state.users.data.filter((e) => e.disabled === 1).map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>
                      <div>{`${e.name} (${e.username})`}</div>
                      {e.token && (
                        <div><small>{getResetURL(e.id, e.token)}</small></div>
                      )}
                    </td>
                    <td className="text-right">
                      <button type="button" className="btn btn-success btn-xs" onClick={disableUser(e.id, 0)} title="Aktiviraj uporabnika">
                        <i className="glyphicon glyphicon-ok" />
                      </button>
                      <button type="button" className="btn btn-danger btn-xs" onClick={disableUser(e.id, 2)} title="Izbriši uporabnika">
                        <i className="glyphicon glyphicon-ban-circle" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

AddUser.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default AddUser;
