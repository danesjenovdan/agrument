import React, { PropTypes } from 'react';
import Portal from 'react-portal';
import Cropper from 'react-cropper';
import { autobind } from 'core-decorators';
import Modal from '../Modal';
import Button from '../FormControl/Button';

class ImageEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      image: null,
      modalOpen: false,
    };
  }

  @autobind
  onFileSelected(event) {
    event.preventDefault();
    let files;
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else if (event.target) {
      files = event.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ image: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  @autobind
  onDone() {
    if (this.props.onDone && this.cropper && this.cropper.getCroppedCanvas()) {
      this.props.onDone(this.cropper.getCroppedCanvas().toDataURL('image/jpeg'));
      this.closeModal();
    }
  }

  @autobind
  openModal() {
    this.setState({ modalOpen: true });
  }

  @autobind
  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {
    return (
      <div>
        <Button value="Naloži sliko" onClickFunc={this.openModal} />
        <Portal closeOnEsc isOpened={this.state.modalOpen} onClose={this.closeModal}>
          <Modal title="Naloži sliko">
            <div className="modal-body">
              <input type="file" onChange={this.onFileSelected} />
              <Cropper
                src={this.state.image}
                ref={(cropper) => { this.cropper = cropper; }}
                style={{ width: '100%', maxHeight: '80vh' }}
                zoomable={false}
                autoCropArea={1}
                viewMode={1}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.closeModal}>Zapri</button>
              <button type="button" className="btn btn-primary" onClick={this.onDone}>Shrani</button>
            </div>
          </Modal>
        </Portal>
      </div>
    );
  }
}

ImageEdit.propTypes = {
  onDone: PropTypes.func,
};

export default ImageEdit;
