import React from 'react';
import PropTypes from 'prop-types';

import store from '../../store';

function createUser() {
  store.trigger('newuser:create');
}

function getURL(id, token) {
  let url = '';
  if (typeof window !== 'undefined') {
    url += `${window.location.protocol}//${window.location.host}`;
  }
  url += `/register?id=${id}&token=${token}`;
  return url;
}

const AddUser = ({ newUser }) => {
  const text = (newUser.id && newUser.token)
    ? getURL(newUser.id, newUser.token)
    : '';
  return (
    <div className="row">
      <div className="col-sm-3">
        <button
          className="btn btn-default btn-block"
          disabled={newUser.isLoading}
          onClick={createUser}
        >Ustvari povezavo za registracijo <br />novega uporabnika</button>
      </div>
      <div className="col-sm-9">
        <input className="form-control" value={text} readOnly onFocus={(e) => { e.target.select(); }} />
      </div>
    </div>
  );
};

AddUser.propTypes = {
  newUser: PropTypes.shape({
    id: PropTypes.number,
    token: PropTypes.string,
    isLoading: PropTypes.bool,
  }).isRequired,
};

export default AddUser;
