import React, { PropTypes } from 'react';

const Input = ({ value }) => (
  <div className="component__input component__input--autofocus">
    <input className="form-control" value={value} readOnly onFocus={(e) => { e.target.select(); }} />
  </div>
);

Input.propTypes = {
  value: PropTypes.string,
};

export default Input;
