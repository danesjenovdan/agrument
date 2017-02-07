import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import Button from '../FormControl/Button';
import AgrumentEditSwitcher from './AgrumentEditSwitcher';
import { publishToPublic } from '../../utils/dash';

class VotableEntry extends React.Component {
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
  publishArticle() {
    publishToPublic(this.props.data.id).end((err, res) => {
      if (err || !res.body) {
        console.log(err);
      } else {
        browserHistory.push('/');
      }
    });
  }

  render() {
    return (
      <div className="component__entry component__entry--pending">
        <AgrumentEditSwitcher data={this.props.data} onEditorShowChange={this.onEditorShowChange} />
        {!this.state.editorShown ? (
          <Button block value="Objavi" onClickFunc={this.publishArticle} />
        ) : null}
      </div>
    );
  }
}

VotableEntry.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default VotableEntry;
