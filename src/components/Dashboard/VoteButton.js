import React from 'react';
import PropTypes from 'prop-types';

import store from '../../store';

const iconMap = {
  for: 'thumbs-up',
  against: 'thumbs-down',
  veto: 'remove',
};

function submitVote(post, vote) {
  return () => {
    store.emit('votes:vote', post, vote);
  };
}

const VoteButton = ({ entry, voteType }) => (
  <div className="text-center">
    <div>
      <button className="component__social-pulse-btn" onClick={submitVote(entry.id, voteType)}>
        <div className="pulse" />
        <div className={`glyphicon glyphicon-${iconMap[voteType]}`} />
      </button>
    </div>
    <div>
      {entry.votes.data.filter(v => v.vote === voteType).map(v => v.author_name).join(', ')}
    </div>
  </div>
);

VoteButton.propTypes = {
  entry: PropTypes.shape().isRequired,
  voteType: PropTypes.string.isRequired,
};

export default VoteButton;
