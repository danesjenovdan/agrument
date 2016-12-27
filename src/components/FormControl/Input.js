import React, { PropTypes } from 'react';

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
    return (
      <div className="component__input">
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
};

export default Input;
