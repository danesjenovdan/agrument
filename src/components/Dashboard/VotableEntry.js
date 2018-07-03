import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubmissionPreview from './SubmissionPreview';
import Button from '../FormControl/Button';
import Votes from './Votes';
import { toSloDateString } from '../../utils/date';

import store from '../../store';

function publishArticle(id) {
  return () => {
    store.emit('votable:publish', id);
  };
}

const VotableEntry = ({ entry, state }) => (
  <div className="component__entry component__entry--votable card__content clearfix">
    <div className="row entry__content">
      <div className="col-xs-12">
        <SubmissionPreview entry={entry} />
      </div>
    </div>
    <div className="row entry__buttons">
      <div className="col-sm-6">
        <Link to={`/dash/edit/${toSloDateString(entry.date)}`} className="component__button btn btn-block">Uredi</Link>
      </div>
      <div className="col-sm-6">
        {state.user.data.group === 'admin' && (
          <Button block disabled={entry.disabled} value="Objavi" onClick={publishArticle(entry.id)} />
        )}
      </div>
    </div>
    <div className="row entry__votes">
      <div className="col-xs-12">
        <Votes entry={entry} />
      </div>
    </div>
  </div>
);

VotableEntry.propTypes = {
  entry: PropTypes.shape().isRequired,
  state: PropTypes.shape().isRequired,
};

export default VotableEntry;
