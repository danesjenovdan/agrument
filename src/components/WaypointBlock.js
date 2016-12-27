import React, { PropTypes } from 'react';
import Waypoint from 'react-waypoint';
import { autobind } from 'core-decorators';

class WaypointBlock extends React.Component {

  @autobind
  handleWaypointEnter() {
    if (this.props.onEnterFunc) {
      this.props.onEnterFunc();
    }
  }

  render() {
    return (
      <div>
        <Waypoint onEnter={() => { this.handleWaypointEnter('top'); }} bottomOffset="75%" />
        {this.props.children}
        <Waypoint onEnter={() => { this.handleWaypointEnter('bottom'); }} topOffset="75%" />
      </div>
    );
  }
}

WaypointBlock.propTypes = {
  children: PropTypes.node,
  onEnterFunc: PropTypes.func,
};

export default WaypointBlock;
