import React, { PropTypes } from 'react';
import Portal from 'react-portal';
import Cropper from 'react-cropper';
import { autobind } from 'core-decorators';
import Modal from '../Modal';
import Button from '../FormControl/Button';
import FileChooser from '../FormControl/FileChooser';
import Input from '../FormControl/Input';

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
  onLoadLink(event) {
    event.preventDefault();
    if (this.linkInput) {
      this.setState({ image: this.linkInput.value });
    }
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
      <div className="col-md-6">
        <Button value="Naloži sliko" onClick={this.openModal} />
        <Portal closeOnEsc isOpened={this.state.modalOpen} onClose={this.closeModal}>
          <Modal title="Naloži sliko">
            <div className="modal-body">
              <div className="row">
                <div className="form-inline">
                  <div className="col-md-4 col-md-offset-4">
                    <FileChooser inline value="Uploadaj sliko" onChange={this.onFileSelected} />
                  </div>
                  {/* <div className="col-md-4">
                    <Input inline placeholder="Prilepi link" ref={(linkInput) => { this.linkInput = linkInput; }} />
                  </div>
                  <div className="col-md-4">
                    <Button value="Naloži preko linka" onClick={this.onLoadLink} />
                  </div> */}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Cropper
                    src={this.state.image}
                    ref={(cropper) => { this.cropper = cropper; }}
                    style={{ width: '100%', maxHeight: '80vh' }}
                    zoomable={false}
                    autoCropArea={1}
                    viewMode={1}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default component__button" onClick={this.closeModal}>Zapri</button>
              <button type="button" className="btn btn-primary component__button" onClick={this.onDone}>Shrani</button>
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

ImageEdit.defaultProps = {
  onDone: () => { },
};

export default ImageEdit;
