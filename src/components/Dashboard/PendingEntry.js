import React, { PropTypes } from 'react';
import SubmissionPreview from './SubmissionPreview';
import SubmissionEditor from './SubmissionEditor';
import Button from '../FormControl/Button';

import store from '../../store';

function submitForVoting(id) {
  return () => {
    store.trigger('pending:submit', id);
  };
}

function showEditor(id) {
  return () => {
    store.trigger('editor:showeditor', id);
  };
}

function discardChanges() {
  store.trigger('editor:discardeditor');
}

function saveChanges(id) {
  return () => {
    store.trigger('pending:edit', id);
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
            <Button block disabled={entry.disabled || !!currentEditor} value="Uredi" onClickFunc={showEditor(entry.id)} />
          </div>
          <div className="col-xs-6">
            <Button block disabled={entry.disabled} value="Oddaj" onClickFunc={submitForVoting(entry.id)} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="component__entry component__entry--pending card__content clearfix">
      <div className="row entry__content">
        <SubmissionEditor entry={entry} />
      </div>
      <div className="row entry__buttons">
        <div className="col-xs-6">
          <Button block value="Prekliči" disabled={entry.disabled} onClickFunc={discardChanges} />
        </div>
        <div className="col-xs-6">
          <Button block value="Shrani" disabled={entry.disabled} onClickFunc={saveChanges(entry.id)} />
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
