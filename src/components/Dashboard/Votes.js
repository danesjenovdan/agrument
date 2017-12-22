import React, { PropTypes } from 'react';

import store from '../../store';

const Votes = ({ votes }) => {
    console.log(store.get().users.data);
    const voteMap = {
        for: 'ZA',
        against: 'PROTI',
        veto: 'VETO',
    };
    if (votes.data) {
        const content = votes.data.map(vote => (
            <div className="col-md-2" key={vote.id}>
                <div className="author">
                    {store.get().users.data.filter(user => user.id === vote.author)[0].name}
                </div>
                <div className="option">
                    {voteMap[vote.vote]}
                </div>
            </div>
        ));
        return (
            <div className="row votes">
                { content }
            </div>
        );
    } else {
        return (
            <div className="row votes">
                <div className="col-md-12">
                    <h1>GLASOV ZAENKRAT ŠE NI</h1>
                </div>
            </div>
        );
    }
};

Votes.propTypes = {
    votes: PropTypes.shape().isRequired,
};

Votes.defaultProps = {
    votes: {},
};

export default Votes;
