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
    let answer = true;
    if (vote === 'veto') {
      // eslint-disable-next-line no-alert
      answer = window.confirm('Si prepričan/-a, da želiš uveljaviti veto? Veto pomeni, da se ti zdi agrument nesprejemljiv do te mere, da ga ni mogoče nikakor popraviti oz. urediti. Tvoja odločitev je dokončna, agrument ne bo objavljen. Pravico do veta imaš enkrat mesečno.');
    }
    if (answer) {
      store.emit('votes:vote', post, vote);
    }
  };
}

const VoteButton = ({ entry, voteType }) => (
  <div className="vote-button">
    <div className="vote-button__icon">
      <button type="button" className="component__social-pulse-btn" onClick={submitVote(entry.id, voteType)}>
        <div className="pulse" />
        <div className={`glyphicon glyphicon-${iconMap[voteType]}`} />
      </button>
    </div>
    <div className="vote-button__text">
      {entry.votes.data.filter(v => v.vote === voteType).map(v => v.author_name).join(', ')}
    </div>
  </div>
);

VoteButton.propTypes = {
  entry: PropTypes.shape().isRequired,
  voteType: PropTypes.string.isRequired,
};

export default VoteButton;
