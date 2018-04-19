import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import RenderSpinner from '../../../hoc/RenderSpinner';
import TriangleHeading from '../../Card/TriangleHeading';
import SubmissionEditor from '../../../components/Dashboard/SubmissionEditor';
import { parseDate } from '../../../utils/date';

import store from '../../../store';


class Edit extends React.Component {
  componentDidMount() {
    const { match, state } = this.props;
    const date = parseDate(match.params.date, false);
    if (date) {
      store.emit('editable:fetch', date.getTime());
    }
    if (state.user.data.group === 'admin') {
      store.emit('users:fetch');
    }
  }

  render() {
    const { state } = this.props;
    const isLoading = state.editable.isLoading && (state.user.data.group === 'admin' && state.users.isLoading);
    const hasData = state.editable.data && (state.user.data.group !== 'admin' || state.users.data);
    return (
      <div className="row">
        <div className="col-md-12">
          <TriangleHeading title="Urejanje agrumenta" />
          <div className="card__content clearfix">
            <RenderSpinner
              isLoading={isLoading}
              data={hasData}
              error={state.editable.error}
            >
              {() => (
                <SubmissionEditor
                  key={state.editable.data.id}
                  entry={state.editable.data}
                  user={state.user.data}
                  users={state.users.data}
                />
              )}
            </RenderSpinner>
          </div>
        </div>
      </div>
    );
  }
}

Edit.propTypes = {
  state: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default withRouter(Edit);
