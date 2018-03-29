import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import PendingSubmissions from './PendingSubmissions';
import VotableSubmissions from './VotableSubmissions';
import AdminPanel from './AdminPanel';
import Blurb from './Blurb';

const Container = ({ state }) => (
  <div className="container dash__container">
    <Navbar username={state.user.data.name} />
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
  </div>
);

Container.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Container;
