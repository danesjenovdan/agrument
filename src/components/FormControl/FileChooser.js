import React from 'react'; import PropTypes from 'prop-types';
import classnames from 'classnames';
import { uniqueId } from 'lodash';
import { autobind } from 'core-decorators';
import Button from './Button';

class FileChooser extends React.Component {
  componentWillMount() {
    const id = uniqueId('filechooser-');
    this.setState({ id });
  }

  @autobind
  onClick() {
    if (this.input) {
      this.input.click();
    }
  }

  @autobind
  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    const classes = classnames(
      'component__filechooser',
      { 'component__filechooser--inline': this.props.inline },
    );
    return (
      <div className={classes}>
        <input style={{ display: 'none' }} type="file" onChange={this.handleChange} ref={(input) => { this.input = input; }} />
        <Button value={this.props.value} onClick={this.onClick} />
      </div>
    );
  }
}

FileChooser.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  inline: PropTypes.bool,
};

FileChooser.defaultProps = {
  onChange: () => { },
  inline: false,
};

export default FileChooser;
