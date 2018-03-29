import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {

  componentDidMount() {
    document.body.classList.add('modal-open');
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open');
  }

  render() {
    return (
      <div>
        <div className="modal-backdrop in" />
        <div className="modal" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closePortal} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  closePortal: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Modal;
