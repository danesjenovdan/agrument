import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import classnames from 'classnames';

class Input extends React.Component {
  constructor() {
    super();
    const id = uniqueId('input-');
    this.state = { id };
  }

  get value() {
    if (this.inputElement) {
      return this.inputElement.value;
    }
    return '';
  }

  shake() {
    this.inputElement.classList.add('shake');
    this.inputElement.addEventListener('animationend', () => {
      this.inputElement.classList.remove('shake');
    });
  }

  render() {
    const { inline, label, name, value, placeholder, type, onChange } =
      this.props;
    const { id } = this.state;
    const classes = classnames('component__input', {
      'component__input--inline': inline,
    });
    return (
      <div className={classes}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        <input
          id={id}
          className="form-control"
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          ref={(el) => {
            this.inputElement = el;
          }}
          onChange={onChange}
        />
      </div>
    );
  }
}

Input.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

Input.defaultProps = {
  name: undefined,
  value: undefined,
  placeholder: '',
  type: 'text',
  inline: false,
  onChange: () => {},
  label: undefined,
};

export default Input;
