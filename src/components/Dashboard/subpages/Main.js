import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PendingSubmissions from '../PendingSubmissions';
import VotableSubmissions from '../VotableSubmissions';
import Blurb from '../Blurb';

const Main = ({ state }) => (
  <Fragment>
    <Blurb />
    <div className="row">
      <div className="col-lg-6">
        <VotableSubmissions state={state} />
      </div>
      <div className="col-lg-6">
        <PendingSubmissions state={state} />
      </div>
    </div>
  </Fragment>
);

Main.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Main;
