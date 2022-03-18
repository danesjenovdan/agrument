import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import classnames from 'classnames';

export default function Input({ inline, label, ...props }) {
  const [id] = useState(uniqueId('input-'));

  const classes = classnames('component__input', {
    'component__input--inline': inline,
  });

  return (
    <div className={classes}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <input {...props} id={id} className="form-control" />
    </div>
  );
}

// shake() {
//   this.inputElement.classList.add('shake');
//   this.inputElement.addEventListener('animationend', () => {
//     this.inputElement.classList.remove('shake');
//   });
// }

Input.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  type: 'text',
  inline: false,
  onChange: () => {},
  label: undefined,
};
