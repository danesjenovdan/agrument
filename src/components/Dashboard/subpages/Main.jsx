import React from 'react';
import Blurb from '../Blurb.jsx';
import VotableSubmissions from '../VotableSubmissions.jsx';
import PendingSubmissions from '../PendingSubmissions.jsx';

export default function Main() {
  return (
    <>
      <Blurb />
      <div className="row">
        <div className="col-lg-6">
          <VotableSubmissions />
        </div>
        <div className="col-lg-6">
          <PendingSubmissions />
        </div>
      </div>
    </>
  );
}
