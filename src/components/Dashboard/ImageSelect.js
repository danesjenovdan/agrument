import React from 'react';
import PropTypes from 'prop-types';

class ImageSelect extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
    };
  }

  onFileSelected = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    this.setState({ name: file.name });

    const { onChange } = this.props;
    if (onChange) {
      onChange(file, file.name);
    }
  }

  render() {
    return (
      <div className="component__fileinput">
        <label>
          {this.state.name || 'Izberi sliko'}
          <input type="file" onChange={this.onFileSelected} />
        </label>
      </div>
    );
  }
}

ImageSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ImageSelect;
