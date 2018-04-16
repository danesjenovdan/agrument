import React from 'react';
import PropTypes from 'prop-types';
import AssignNewSubmission from './AssignNewSubmission';
import AddUser from './AddUser';
import SubmissionsTable from './SubmissionsTable';
import { addBulkSubmission } from '../../utils/dash';


import store from '../../store';

function chunk(arr, len) {
  const chunks = [];
  const n = arr.length;
  let i = 0;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}

// Execute a list of Promise return functions in series
function pseries(list) {
  const p = Promise.resolve();
  return list.reduce((pacc, fn) => pacc.then(fn), p);
}

function bulkUp() {
  const data = JSON.parse(this.bulkarea.value);
  const c = chunk(data, 25);

  const fnlist = c.map(e => addBulkSubmission.bind(null, e));
  pseries(fnlist).then(() => {
    console.log('done!');
  });
}

class AdminPanel extends React.PureComponent {
  componentDidMount() {
    store.emit('users:fetch');
    store.emit('submissions:fetch');
  }

  render() {
    const { state } = this.props;
    return (
      <div className="component__admin-panel">
        <hr />
        {state.users.data && (
          <AddUser newUser={state.newUser} />
        )}
        <br />
        {state.users.data && (
          <AssignNewSubmission users={state.users.data} newArticle={state.newArticle} />
        )}
        {state.submissions.data && (
          <SubmissionsTable submissions={state.submissions.data} />
        )}
        {/*
          THIS IS A COMMENT
          <hr />
          <textarea ref={(e) => { this.bulkarea = e; }} />
          <button onClick={bulkUp.bind(this)}>bulk upload</button>
        */}
      </div >
    );
  }
}

AdminPanel.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default AdminPanel;
