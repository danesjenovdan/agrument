import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Input = ({ value, inline }) => {
  const classes = classnames(
    'component__input',
    'component__input--autofocus',
    { 'component__input--inline': inline },
  );
  return (
    <div className={classes}>
      <input className="form-control" value={value} readOnly onFocus={(e) => { e.target.select(); }} />
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  inline: PropTypes.bool,
};

export default Input;
