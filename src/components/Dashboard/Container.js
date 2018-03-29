import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Navbar from './Navbar';
import PendingSubmissions from './PendingSubmissions';
import VotableSubmissions from './VotableSubmissions';
import Spinner from '../Spinner';
import AdminPanel from './AdminPanel';
import Blurb from './Blurb';

import store from '../../store';

class Container extends React.Component {
  componentDidMount() {
    store.trigger('user:fetch', this.props.history);
  }

  render() {
    const { state } = this.props;
    if (state.user.isLoading) {
      return (
        <div className="container dash__container">
          <Spinner />
        </div>
      );
    } else if (state.user.data) {
      return (
        <div className="container dash__container">
          <Navbar username={state.user.data.name} />
          <Blurb />
          {/* <PinnedMessages pinned={state.pinned} user={state.user.data} /> */}
          {state.user.data.group === 'admin' && (
            <AdminPanel state={state} />
          )}
          <div className="row">
            <div className="col-lg-6">
              <PendingSubmissions pending={state.pending} currentEditor={state.currentEditor} />
            </div>
            <div className="col-lg-6">
              <VotableSubmissions
                user={state.user.data}
                votable={state.votable}
                currentEditor={state.currentEditor}
                votes={state.votes}
              />
            </div>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

Container.propTypes = {
  state: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(Container);
