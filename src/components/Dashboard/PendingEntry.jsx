import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toSloDateString } from '../../utils/date.js';
import SubmissionPreview from './SubmissionPreview.jsx';
import Button from '../FormControl/Button.jsx';

function submitForVoting(id) {
  return () => {
    // store.emit('pending:submit', id);
  };
}

export default function PendingEntry({ entry }) {
  return (
    <div className="component__entry component__entry--pending card__content clearfix">
      <div className="row entry__content">
        <div className="col-xs-12">
          <SubmissionPreview entry={entry} />
        </div>
      </div>
      <div className="row entry__buttons">
        <div className="col-sm-6">
          <Link
            to={`/dash/edit/${toSloDateString(entry.date)}`}
            className="component__button btn btn-block"
          >
            Uredi
          </Link>
        </div>
        <div className="col-sm-6">
          <Button
            block
            disabled={entry.disabled}
            value="Oddaj"
            onClick={submitForVoting(entry.id)}
          />
        </div>
      </div>
    </div>
  );
}

PendingEntry.propTypes = {
  entry: PropTypes.shape().isRequired,
};
