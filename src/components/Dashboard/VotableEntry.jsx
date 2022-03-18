import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toSloDateString } from '../../utils/date.js';
import SubmissionPreview from './SubmissionPreview.jsx';
import Button from '../FormControl/Button.jsx';
// import Votes from './Votes';

function publishArticle(id) {
  return () => {
    //     store.emit('votable:publish', id);
  };
}

export default function VotableEntry({ entry }) {
  const user = useSelector((state) => state.user.data);

  return (
    <div className="component__entry component__entry--votable card__content clearfix">
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
          {user.group === 'admin' ? (
            <Button
              block
              disabled={entry.disabled}
              value="Objavi"
              onClick={publishArticle(entry.id)}
            />
          ) : (
            <Button block disabled value="Objavi" />
          )}
        </div>
      </div>
      {user.group === 'admin' && entry.publishErrors && (
        <div className="row entry__publish-errors">
          <div className="col-sm-12">
            <div>Ni mogoče objaviti. {entry.publishErrors.join(', ')}</div>
          </div>
        </div>
      )}
      <div className="row entry__votes">
        <div className="col-xs-12">{/* <Votes entry={entry} /> */}</div>
      </div>
    </div>
  );
}

VotableEntry.propTypes = {
  entry: PropTypes.shape().isRequired,
};
