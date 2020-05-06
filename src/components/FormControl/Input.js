import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import classnames from 'classnames';

class Input extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const id = uniqueId('input-');
    this.setState({ id });
  }

  get value() {
    if (this.inputElement) {
      return this.inputElement.value;
    }
    return '';
  }

  shake() {
    this.inputElement.classList.add('shake');
    this.inputElement.addEventListener('animationend', () => { this.inputElement.classList.remove('shake'); });
  }

  render() {
    const {
      inline, label, value, placeholder, type, onChange,
    } = this.props;
    const classes = classnames(
      'component__input',
      { 'component__input--inline': inline },
    );
    return (
      <div className={classes}>
        {label ? <label htmlFor={this.state.id}>{label}</label> : null}
        <input
          id={this.state.id}
          className="form-control"
          value={value}
          placeholder={placeholder}
          type={type}
          ref={(el) => { this.inputElement = el; }}
          onChange={onChange}
        />
      </div>
    );
  }
}

Input.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

Input.defaultProps = {
  value: undefined,
  placeholder: '',
  type: 'text',
  inline: false,
  onChange: () => {},
  label: undefined,
};

export default Input;
