import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from '../DatePicker';
import { parseDate } from '../../utils/date';
import Button from '../FormControl/Button';

import store from '../../store';

function changeSelectedUser(event) {
  store.emit('newsubmission:changeuser', +event.target.value);
}

function changeDate(value) {
  const date = parseDate(value, false);
  if (date) {
    store.emit('newsubmission:changedate', date.getTime());
  }
}

function createSubmission() {
  store.emit('newsubmission:create');
}

const AssignNewSubmission = ({ users, newArticle }) => (
  <div className="form-horizontal">
    <div className="form-group">
      <label htmlFor="newarticle-user" className="col-sm-2 control-label">
        Avtor
      </label>
      <div className="col-sm-10">
        <div className="component__input component__input--select">
          <select id="newarticle-user" value={newArticle.selectedUser} className="form-control" onChange={changeSelectedUser}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {`${user.name} (${user.username})`}
              </option>
            ))}
          </select>
          <span>
            <i className="glyphicon glyphicon-chevron-down" />
          </span>
        </div>
      </div>
    </div>
    <div className="form-group">
      <label htmlFor="newarticle-date" className="col-sm-2 control-label">
        Datum
      </label>
      <div className="col-sm-10">
        <DatePicker locale="sl-SI" value={new Date(newArticle.date)} onChange={changeDate} />
      </div>
    </div>
    <div className="form-group">
      <div className="col-sm-offset-2 col-sm-10">
        {newArticle.error && (
          <div>{newArticle.error}</div>
        )}
        <Button disabled={newArticle.isLoading} onClick={createSubmission}>
          Ustvari
        </Button>
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
    date: 0,
  }).isRequired,
};

export default AssignNewSubmission;
