import React from 'react';
import PropTypes from 'prop-types';

import store from '../../store';

const voteMap = {
  for: 'ZA',
  against: 'PROTI',
  veto: 'VETO',
};

const Votes = ({ votes }) => {
  console.log(votes);
  return (
    <div />
  );
  // if (votes.data) {
  //   const content = votes.data.map(vote => (
  //     <div className="col-md-2" key={vote.id}>
  //       <div className="author">
  //         {store.get().users.data.filter(user => user.id === vote.author)[0].name}
  //       </div>
  //       <div className="option">
  //         {voteMap[vote.vote]}
  //       </div>
  //     </div>
  //   ));
  //   return (
  //     <div className="row votes">
  //       {content}
  //     </div>
  //   );
  // }
  // return (
  //   <div className="row votes">
  //     <div className="col-md-12">
  //       <h1>GLASOV ZAENKRAT ŠE NI</h1>
  //     </div>
  //   </div>
  // );
};

Votes.propTypes = {
  votes: PropTypes.shape(),
};

Votes.defaultProps = {
  votes: {},
};

export default Votes;

// votes[0] = {
//   'for': [],
//   'against': [],
//   'veto': [],
// };

/**
{/* <div className="row voting">
      <div className="col-md-4">
        <Button block value="Glasuj ZA" onClick={voteFor(user.id, entry.id)} />
      </div>
      <div className="col-md-4">
        <Button block value="Glasuj PROTI" onClick={voteAgainst(user.id, entry.id)} />
      </div>
      <div className="col-md-4">
        <Button block value="Vloži VETO" onClick={voteVeto(user.id, entry.id)} />
      </div>
    </div>
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
