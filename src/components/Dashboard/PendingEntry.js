import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Button from '../FormControl/Button';
import AgrumentEditSwitcher from './AgrumentEditSwitcher';
import { submitPendingForVote } from '../../utils/dash';

class PendingEntry extends React.Component {
  constructor() {
    super();

    this.state = {
      editorShown: false,
    };
  }

  @autobind
  onEditorShowChange(value) {
    this.setState({ editorShown: value });
  }

  @autobind
  submitForVoting() {
    submitPendingForVote(this.props.data.id).end((err, res) => {
      if (err || !res.body) {
        console.log(err);
      } else {
        window.location.reload();
      }
    });
  }

  render() {
    return (
      <div className="component__entry component__entry--pending">
        <AgrumentEditSwitcher data={this.props.data} onEditorShowChange={this.onEditorShowChange} />
        {!this.state.editorShown ? (
          <Button block value="Oddaj" onClickFunc={this.submitForVoting} />
        ) : null}
      </div>
    );
  }
}

PendingEntry.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default PendingEntry;
