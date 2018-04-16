import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import RenderSpinner from '../../../hoc/RenderSpinner';
import SubmissionEditor from '../../../components/Dashboard/SubmissionEditor';
import { parseDate } from '../../../utils/date';

import store from '../../../store';


class EditAgrument extends React.Component {
  componentDidMount() {
    const date = parseDate(this.props.match.params.date, false);
    if (date) {
      store.trigger('editable:fetch', date);
    }
  }

  render() {
    const { state } = this.props;
    return (
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <RenderSpinner
            isLoading={state.editable.isLoading}
            hasData={state.editable.data}
            error={state.editable.error}
          >
            <SubmissionEditor entry={state.editable.data} />
          </RenderSpinner>
        </div>
      </div>
    );
  }
}

EditAgrument.propTypes = {
  state: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default withRouter(EditAgrument);
