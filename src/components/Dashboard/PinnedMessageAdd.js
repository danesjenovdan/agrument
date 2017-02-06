import React, { PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { addPinned } from '../../utils/dash';

class MessageAdd extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      error: false,
      textareaShown: false,
    };
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  @autobind
  onShowTextarea() {
    if (!this.textarea) {
      this.setState({ textareaShown: true });
    }
  }

  @autobind
  onAdd() {
    this.setState({ loading: true });
    this.dataRequest = addPinned(this.textarea.value).end((err, res) => {
      this.setState({ loading: false });
      this.dataRequest = null;
      if (err || !res.ok) {
        console.log(err);
        this.setState({ error: true });
      } else {
        this.props.onChanged();
        this.setState({ textareaShown: false });
      }
    });
  }

  @autobind
  resetState() {
    this.setState({ loading: false, error: false, textareaShown: true });
    this.dataRequest = null;
  }

  render() {
    if (this.state.error) {
      return (
        <div className="pinned__wrapper">
          <div className="pinned__content">
            <div>Napaka :(</div>
            <button className="btn btn-success btn-xs" onClick={this.resetState}>poskusi ponovno</button>
          </div>
        </div>
      );
    }
    if (!this.state.textareaShown) {
      return (
        <button className="btn btn-default btn-xs pinned__show-textarea" onClick={this.onShowTextarea}>
          <span>novo sporočilo</span>
        </button>
      );
    }
    return (
      <div className="pinned__wrapper">
        <div className="pinned__content">
          <textarea ref={(e) => { this.textarea = e; }} />
          <button className="btn btn-success btn-xs" disabled={this.state.loading} onClick={this.onAdd}>Potrdi</button>
        </div>
      </div>
    );
  }
}

MessageAdd.propTypes = {
  onChanged: PropTypes.func,
};

MessageAdd.defaultProps = {
  onChanged: _.noop,
};

export default MessageAdd;
