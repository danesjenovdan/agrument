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
    return (
      <RenderSpinner isLoading={isLoading} data={entry.votes && entry.votes.data}>
        {() => (
          <div className="row voting">
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

// const Votes2 = ({ entry }) => {
//   console.log(entry)
//   return (
//     <div />
//   );
//   // if (votes.data) {
//   //   const content = votes.data.map(vote => (
//   //     <div className="col-md-2" key={vote.id}>
//   //       <div className="author">
//   //         {store.get().users.data.filter(user => user.id === vote.author)[0].name}
//   //       </div>
//   //       <div className="option">
//   //         {voteMap[vote.vote]}
//   //       </div>
//   //     </div>
//   //   ));
//   //   return (
//   //     <div className="row votes">
//   //       {content}
//   //     </div>
//   //   );
//   // }
//   // return (
//   //   <div className="row votes">
//   //     <div className="col-md-12">
//   //       <h1>GLASOV ZAENKRAT ŠE NI</h1>
//   //     </div>
//   //   </div>
//   // );
// };

Votes.propTypes = {
  entry: PropTypes.shape().isRequired,
};

export default Votes;

/**
{/*
    <hr />
    <h3>Rezultati glasovanja</h3>


// function getVotes() {
//   store.emit('votes:fetch');
// }

function voteFor(user, post) {
  return () => {
    store.emit('vote:for', { user, post });
  };
}
function voteAgainst(user, post) {
  return () => {
    store.emit('vote:against', { user, post });
  };
}
function voteVeto(user, post) {
  return () => {
    store.emit('vote:veto', { user, post });
  };
}
 */
