import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { parseDate } from '../../utils/date.js';
import { addSubmission } from '../../utils/requests/dash.js';
import { fetchSubmissionsPosts } from '../../store/slices/posts.js';
import DatePicker from '../DatePicker.jsx';
import Button from '../FormControl/Button.jsx';

export default function AssignNewSubmission({ users }) {
  const dispatch = useDispatch();

  const [{ selectedUser, selectedDate, loading, error }, setState] = useState({
    selectedUser: users?.[0]?.id || '',
    selectedDate: new Date(),
    loading: false,
    error: false,
  });

  const handleUserChange = (event) => {
    setState((state) => ({
      ...state,
      selectedUser: Number(event.target.value) || '',
    }));
  };

  const handleDateChange = (date) => {
    setState((state) => ({
      ...state,
      selectedDate: date,
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
      const timestamp = Number(parseDate(selectedDate));
      await addSubmission(selectedUser, timestamp);
      await dispatch(fetchSubmissionsPosts());
      setState((state) => ({
        ...state,
        loading: false,
      }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Adding submission failed!', err);
      setState((state) => ({
        ...state,
        error: err,
        loading: false,
      }));
    }
  };

  return (
    <div className="form-horizontal">
      <div className="form-group">
        <label htmlFor="newarticle-user" className="col-sm-2 control-label">
          Avtor
        </label>
        <div className="col-sm-10">
          <div className="component__input component__input--select">
            <select
              id="newarticle-user"
              value={selectedUser}
              className="form-control"
              onChange={handleUserChange}
            >
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
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="col-sm-offset-2 col-sm-10">
          {error ? (
            <h4 className="text-center">Napaka pri usvarjanju!</h4>
          ) : null}
          <Button block disabled={loading} onClick={onSubmitForm}>
            Ustvari
          </Button>
        </div>
      </div>
    </div>
  );
}

AssignNewSubmission.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
