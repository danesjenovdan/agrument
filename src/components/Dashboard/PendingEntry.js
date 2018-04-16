import React from 'react';
import PropTypes from 'prop-types';
import SubmissionPreview from './SubmissionPreview';
import SubmissionEditor from './SubmissionEditor';
import Button from '../FormControl/Button';

import store from '../../store';

function submitForVoting(id) {
  return () => {
    store.emit('pending:submit', id);
  };
}

function showEditor(id) {
  return () => {
    store.emit('editor:showeditor', id);
  };
}

function discardChanges() {
  store.emit('editor:discardeditor');
}

function saveChanges(id) {
  return () => {
    store.emit('pending:edit', id);
  };
}

const PendingEntry = ({ entry, currentEditor }) => {
  if (!currentEditor || currentEditor.id !== entry.id) {
    return (
      <div className="component__entry component__entry--pending card__content clearfix">
        <div className="row entry__content">
          <div className="col-xs-12">
            <SubmissionPreview entry={entry} />
          </div>
        </div>
        <div className="row entry__buttons">
          <div className="col-xs-6">
            <Button block disabled={entry.disabled || !!currentEditor} value="Uredi" onClick={showEditor(entry.id)} />
          </div>
          <div className="col-xs-6">
            <Button block disabled={entry.disabled} value="Oddaj" onClick={submitForVoting(entry.id)} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="component__entry component__entry--pending card__content clearfix">
      <div className="row entry__content">
        <div className="col-xs-12">
          <SubmissionEditor entry={currentEditor} />
        </div>
      </div>
      <div className="row entry__buttons">
        <div className="col-xs-6">
          <Button block value="Prekliči" disabled={entry.disabled} onClick={discardChanges} />
        </div>
        <div className="col-xs-6">
          <Button block value="Shrani" disabled={entry.disabled} onClick={saveChanges(entry.id)} />
        </div>
      </div>
    </div>
  );
};

PendingEntry.propTypes = {
  entry: PropTypes.shape().isRequired,
  currentEditor: PropTypes.shape(),
};

PendingEntry.defaultProps = {
  currentEditor: null,
};

export default PendingEntry;
