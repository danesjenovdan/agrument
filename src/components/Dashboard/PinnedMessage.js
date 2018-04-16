import React from 'react';
import PropTypes from 'prop-types';
import LocalizedTimeAgo from '../LocalizedTimeAgo';

import store from '../../store';

function removeMessage(id) {
  return () => {
    store.emit('pinned:remove', id);
  };
}

const PinnedMessage = ({ message, user }) => (
  <div className="pinned__wrapper">
    {(message.author === user.id || user.group === 'admin') && (
      <button
        disabled={message.disabled}
        className="btn btn-danger btn-xs pull-right pinned__remove"
        onClick={removeMessage(message.id)}
      >×</button>
    )}
    <div className="pinned__content">
      <small><LocalizedTimeAgo date={message.timestamp} /></small>
      <h4>{message.author_name ? message.author_name : `Neznan avtor #${message.author}`}</h4>
      <p>{message.message}</p>
    </div>
  </div>
);

PinnedMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    author_name: PropTypes.string,
    disabled: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
  }).isRequired,
};

export default PinnedMessage;

const PinnedNotice = ({ title, children }) => (
  <div className="pinned__wrapper">
    <div className="pinned__content">
      <h4>{title}</h4>
      {children}
    </div>
  </div>
);

PinnedNotice.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

PinnedNotice.defaultProps = {
  children: null,
};

export {
  PinnedNotice,
};
