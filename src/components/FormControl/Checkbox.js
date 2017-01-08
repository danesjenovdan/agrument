import React, { PropTypes } from 'react';
import { uniqueId } from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';

class Checkbox extends React.Component {
  componentWillMount() {
    const id = uniqueId('checkbox-');
    this.setState({ id, checked: false });
  }

  @autobind
  handleChange(event) {
    this.setState({ checked: event.target.checked });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    const classes = classnames(
      'checkbox',
      'component__checkbox',
      { 'component__checkbox--large': this.props.large },
    );
    return (
      <div className={classes}>
        <input id={this.state.id} type="checkbox" onChange={this.handleChange} />
        <label htmlFor={this.state.id}>{this.props.label}</label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  large: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checkbox;
