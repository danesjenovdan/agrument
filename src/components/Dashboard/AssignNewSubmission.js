import React, { PropTypes } from 'react';

import store from '../../store';

function changeSelectedUser(event) {
  store.trigger('newsubmission:changeuser', +event.target.value);
}

function createSubmission() {
  store.trigger('newsubmission:create');
}

const AssignNewAgrument = ({ users, newArticle }) => (
  <div className="form-inline">
    Ustvari nov agrument za:
    <select value={newArticle.selectedUser} className="form-control" onChange={changeSelectedUser}>
      {users.map(user => (
        <option key={user.id} value={user.id}>{user.name} ({user.group})</option>
      ))}
    </select>
    <button className="btn btn-default" disabled={newArticle.isLoading} onClick={createSubmission}>Ustvari</button>
  </div>
);

AssignNewAgrument.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  newArticle: PropTypes.shape({
    isLoading: false,
    error: false,
    selectedUser: null,
  }).isRequired,
};

export default AssignNewAgrument;
