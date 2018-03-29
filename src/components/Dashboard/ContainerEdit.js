import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Dashboard/Navbar';
import Spinner from '../../components/Spinner';
import SubmissionEditor from '../../components/Dashboard/SubmissionEditor';
import { parseDate } from '../../utils/date';

import store from '../../store';


class EditAgrument extends React.Component {
  componentDidMount() {
    const date = parseDate(this.props.match.params.date);
    store.trigger('editable:fetch', date);
  }

  render() {
    const { state } = this.props;

    let content = null;
    if (state.editable.isLoading) {
      content = (
        <Spinner />
      );
    } else if (state.editable.data) {
      content = (
        <SubmissionEditor entry={state.editable.data} />
      );
    } else {
      content = 'napaka';
    }

    return (
      <div className="container dash__container">
        <Navbar username={state.user.data.name} />
        {content}
      </div>
    );
  }
}

EditAgrument.propTypes = {
  state: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default withRouter(EditAgrument);
