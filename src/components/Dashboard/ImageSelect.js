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
    const { onChange } = this.props;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({ name: file.name });
      if (onChange) {
        onChange(reader.result, file.name);
      }
    };

    reader.readAsDataURL(file);
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
