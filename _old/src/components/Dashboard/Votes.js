import React from 'react';
import PropTypes from 'prop-types';
import RenderSpinner from '../../hoc/RenderSpinner';
import VoteButton from './VoteButton';

import store from '../../store';

class Votes extends React.PureComponent {
  componentDidMount() {
    store.emit('votes:fetch', this.props.entry.id);
  }

  render() {
    const { entry } = this.props;
    const isLoading = (entry.votes && entry.votes.isLoading) || false;
    const voteError = entry.votes && entry.votes.voteError;
    return (
      <RenderSpinner isLoading={isLoading} data={entry.votes && entry.votes.data}>
        {() => (
          <div className="row">
            <div className="col-md-12">
              {!!voteError && (
                <div className="entry__votes-error">
                  {voteError}
                </div>
              )}
            </div>
            <div className="col-md-4">
              <VoteButton entry={entry} voteType="for" />
            </div>
            <div className="col-md-4">
              <VoteButton entry={entry} voteType="against" />
            </div>
            <div className="col-md-4">
              <VoteButton entry={entry} voteType="veto" />
            </div>
          </div>
        )}
      </RenderSpinner>
    );
  }
}

Votes.propTypes = {
  entry: PropTypes.shape().isRequired,
};

export default Votes;
