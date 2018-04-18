import React from 'react';
import PropTypes from 'prop-types';
import Button from '../FormControl/Button';
import InputImmutable from '../FormControl/InputImmutableAutoFocus';
import RenderSpinner from '../../hoc/RenderSpinner';

import store from '../../store';

function createUser() {
  store.emit('newuser:create');
}

function getURL(id, token) {
  let url = '';
  if (typeof window !== 'undefined') {
    url += `${window.location.protocol}//${window.location.host}`;
  }
  url += `/register?id=${id}&token=${token}`;
  return url;
}

class AddUser extends React.Component {
  componentDidMount() {
    store.emit('users:fetchtokens');
  }

  render() {
    const { state } = this.props;
    const text = (state.newUser.id && state.newUser.token) ? getURL(state.newUser.id, state.newUser.token) : '';
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
            <RenderSpinner isLoading={state.tokenUsers.isLoading} data={state.tokenUsers.data}>
              {data => (
                <table className="table table-hover table-users-list">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(e => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{getURL(e.id, e.token)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </RenderSpinner>
            <table className="table table-hover table-users-list">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ime</th>
                </tr>
              </thead>
              <tbody>
                {state.users.data.map(e => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{`${e.name} (${e.username})`}</td>
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
