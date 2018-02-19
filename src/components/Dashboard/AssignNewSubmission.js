import React from 'react'; import PropTypes from 'prop-types';
import { parseDate, toISODateString } from '../../utils/date';

import store from '../../store';

function changeSelectedUser(event) {
  store.trigger('newsubmission:changeuser', +event.target.value);
}

function changeDeadline(event) {
  const date = parseDate(event.target.value, false);
  if (date) {
    console.log(date);
    store.trigger('newsubmission:changedeadline', date.getTime());
  }
}

function createSubmission() {
  store.trigger('newsubmission:create');
}

const AssignNewAgrument = ({ users, newArticle }) => (
  <div className="form-inline mr">
    Ustvari nov agrument za:&nbsp;
    <select value={newArticle.selectedUser} className="form-control" onChange={changeSelectedUser}>
      {users.map(user => (
        <option key={user.id} value={user.id}>{user.name} ({user.group})</option>
      ))}
    </select>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deadline:&nbsp;
    <input
      type="date"
      className="form-control"
      value={toISODateString(newArticle.deadline)}
      onChange={changeDeadline}
    />
    <button
      className="btn btn-default"
      disabled={newArticle.isLoading}
      onClick={createSubmission}
    >Ustvari</button>
  </div>
);

AssignNewAgrument.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  newArticle: PropTypes.shape({
    isLoading: false,
    error: false,
    selectedUser: null,
    deadline: 0,
  }).isRequired,
};

export default AssignNewAgrument;
