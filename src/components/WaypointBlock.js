import React, { PropTypes } from 'react';
import Waypoint from 'react-waypoint';
import { autobind } from 'core-decorators';

class WaypointBlock extends React.Component {

  @autobind
  handleWaypointEnter(event, position) {
    if ((event.previousPosition === 'below' && position === 'top') || (event.previousPosition === 'above' && position === 'bottom')) {
      if (this.props.onEnterFunc) {
        this.props.onEnterFunc();
      }
    }
  }

  render() {
    return (
      <div>
        <Waypoint onEnter={(event) => { this.handleWaypointEnter(event, 'top'); }} bottomOffset="50%" />
        {this.props.children}
        <Waypoint onEnter={(event) => { this.handleWaypointEnter(event, 'bottom'); }} topOffset="50%" />
      </div>
    );
  }
}

WaypointBlock.propTypes = {
  children: PropTypes.node,
  onEnterFunc: PropTypes.func,
};

export default WaypointBlock;
