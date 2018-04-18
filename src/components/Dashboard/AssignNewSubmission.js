import React from 'react';
import PropTypes from 'prop-types';
import { parseDate, toISODateString } from '../../utils/date';
import Button from '../FormControl/Button';

import store from '../../store';

function changeSelectedUser(event) {
  store.emit('newsubmission:changeuser', +event.target.value);
}

function changeDeadline(event) {
  const date = parseDate(event.target.value, false);
  if (date) {
    store.emit('newsubmission:changedeadline', date.getTime());
  }
}

function createSubmission() {
  store.emit('newsubmission:create');
}

const AssignNewSubmission = ({ users, newArticle }) => (
  <div className="form-horizontal">
    <div className="form-group">
      <label htmlFor="newarticle-user" className="col-sm-2 control-label">Avtor</label>
      <div className="col-sm-10">
        <select id="newarticle-user" value={newArticle.selectedUser} className="form-control" onChange={changeSelectedUser}>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="form-group">
      <label htmlFor="newarticle-date" className="col-sm-2 control-label">Deadline</label>
      <div className="col-sm-10">
        <input id="newarticle-date" type="date" className="form-control" value={toISODateString(newArticle.deadline)} onChange={changeDeadline} />
      </div>
    </div>
    <div className="form-group">
      <div className="col-sm-offset-2 col-sm-10">
        <Button disabled={newArticle.isLoading} onClick={createSubmission}>Ustvari</Button>
      </div>
    </div>
  </div>
);

AssignNewSubmission.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  newArticle: PropTypes.shape({
    isLoading: false,
    error: false,
    selectedUser: null,
    deadline: 0,
  }).isRequired,
};

export default AssignNewSubmission;
