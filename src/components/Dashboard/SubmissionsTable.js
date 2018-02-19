import React from 'react'; import PropTypes from 'prop-types';
import { toSloDateString } from '../../utils/date';

import store from '../../store';

function removeSubmission(id) {
  return () => {
    store.trigger('submissions:remove', id);
  };
}

const SubmissionsTable = ({ submissions }) => (
  <div>
    <h3>Agrumenti, ki čakajo na oddajo:</h3>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>id</th>
          <th>deadline</th>
          <th>avtor</th>
          <th>izbriši</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map(entry => (
          <tr key={entry.id}>
            <td>{entry.id}</td>
            <td>{toSloDateString(entry.deadline)}</td>
            <td>{entry.author_name}</td>
            <td>
              <button
                className="btn btn-danger btn-xs"
                onClick={removeSubmission(entry.id)}
                disabled={entry.disabled}
              >×</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

SubmissionsTable.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default SubmissionsTable;
