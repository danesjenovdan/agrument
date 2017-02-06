import React, { PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import TimeAgo from 'react-timeago';
import sloStrings from 'react-timeago/lib/language-strings/sl';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { removePinned } from '../../utils/dash';

const slFormatter = buildFormatter(sloStrings);

class Message extends React.Component {

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  @autobind
  onDelete(event) {
    const button = event.target;
    button.disabled = true;
    this.dataRequest = removePinned(this.props.data.id).end((err, res) => {
      this.dataRequest = null;
      if (err || !res.ok) {
        console.log(err);
      }
      this.props.onChanged();
    });
  }

  render() {
    return (
      <div className="pinned__wrapper" id={this.props.data.id}>
        <button className="btn btn-danger btn-xs pull-right pinned__remove" onClick={this.onDelete}>×</button>
        <div className="pinned__content">
          <small><TimeAgo formatter={slFormatter} date={this.props.data.timestamp} /></small>
          <h4>{this.props.data.author_name ? this.props.data.author_name : `Neznan avtor #${this.props.data.author}`}</h4>
          <p>{this.props.data.message}</p>
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    author_name: PropTypes.string,
  }).isRequired,
  onChanged: PropTypes.func,
};

Message.defaultProps = {
  onChanged: _.noop,
};

export default Message;
