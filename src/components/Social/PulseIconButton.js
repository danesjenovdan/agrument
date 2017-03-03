import React, { PropTypes } from 'react';

const PulseButton = ({ iconName, onClick }) => (
  <button className="component__social-pulse-btn" onClick={onClick}>
    <div className="pulse" />
    <div className={`icon icon-${iconName}`} />
  </button>
);

PulseButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

PulseButton.defaultProps = {
  onClick: () => { },
};

export default PulseButton;
