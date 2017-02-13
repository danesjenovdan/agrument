import React, { PropTypes } from 'react';
import AssignNewSubmission from './AssignNewSubmission';
import SubmissionsTable from './SubmissionsTable';

import store from '../../store';

class AdminPanel extends React.PureComponent {
  componentDidMount() {
    store.trigger('users:fetch');
    store.trigger('submissions:fetch');
  }

  render() {
    const { state } = this.props;
    return (
      <div className="component__admin-panel">
        <hr />
        {state.users.data && (
          <AssignNewSubmission users={state.users.data} newArticle={state.newArticle} />
        )}
        {state.submissions.data && (
          <SubmissionsTable submissions={state.submissions.data} />
        )}
        <hr />
      </div >
    );
  }
}

AdminPanel.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default AdminPanel;
