import React, { PropTypes } from 'react';

const PulseButton = ({ iconName, onClickFunc }) => (
  <button className="component__social-pulse-btn" onClick={onClickFunc}>
    <div className="pulse" />
    <div className={`icon icon-${iconName}`} />
  </button>
);

PulseButton.propTypes = {
  iconName: PropTypes.string,
  onClickFunc: PropTypes.func,
};

export default PulseButton;
