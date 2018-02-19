import React from 'react'; import PropTypes from 'prop-types';
import classnames from 'classnames';

class Input extends React.Component {
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
    const classes = classnames(
      'component__input',
      { 'component__input--inline': this.props.inline },
    );
    return (
      <div className={classes}>
        <input
          className="form-control"
          value={this.props.value}
          placeholder={this.props.placeholder}
          type={this.props.type}
          ref={(el) => { this.inputElement = el; }}
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
};

export default Input;
