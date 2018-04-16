import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PendingSubmissions from '../PendingSubmissions';
import VotableSubmissions from '../VotableSubmissions';
import AdminPanel from '../AdminPanel';
import Blurb from '../Blurb';

const Main = ({ state }) => (
  <Fragment>
    <Blurb />
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
  </Fragment>
);

Main.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Main;
