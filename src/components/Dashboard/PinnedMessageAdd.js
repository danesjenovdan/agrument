import React from 'react';
import PropTypes from 'prop-types';
import { PinnedNotice } from './PinnedMessage';

import store from '../../store';

function showInput() {
  store.emit('pinned:showinput');
}

function resetInput() {
  store.emit('pinned:resetinput');
}

function onInputChange(event) {
  store.emit('pinned:updatemessage', event.target.value);
}

function addMessage() {
  store.emit('pinned:add');
}

const PinnedMessageAdd = ({ newMessage }) => {
  if (!newMessage.showInput) {
    return (
      <button className="btn btn-default btn-xs pinned__show-input" onClick={showInput}>
        <span>novo sporočilo</span>
      </button>
    );
  }
  if (newMessage.error) {
    return (
      <PinnedNotice title="Napaka">
        <button className="btn btn-default btn-xs" onClick={resetInput}>Poskusi ponovno</button>
      </PinnedNotice>
    );
  }
  return (
    <PinnedNotice title="Novo sporočilo">
      <textarea value={newMessage.message} onChange={onInputChange} />
      <button
        className="btn btn-success btn-xs"
        disabled={newMessage.isLoading}
        onClick={addMessage}
      >Potrdi</button>
    </PinnedNotice>
  );
};

PinnedMessageAdd.propTypes = {
  newMessage: PropTypes.shape({
    showInput: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
  }).isRequired,
};

export default PinnedMessageAdd;
