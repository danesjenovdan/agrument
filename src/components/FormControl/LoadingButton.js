import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class LoadingButton extends React.Component {
  constructor() {
    super();

    this.state = {
      tid: null,
      didError: false,
      wasClicked: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.loading !== newProps.loading) {
      if (!newProps.loading) {
        const tid = setTimeout(() => {
          this.setState({
            tid: null,
            didError: newProps.error,
          });
        }, 2500);
        if (!newProps.error && this.state.wasClicked) {
          newProps.onSuccess();
        }
        this.setState({
          tid,
          didError: newProps.error,
          wasClicked: false,
        });
      } else if (this.state.tid) {
        clearTimeout(this.state.tid);
      }
    }
  }

  componentWillUnmount() {
    if (this.state.tid) {
      clearTimeout(this.state.tid);
    }
  }

  onClick = () => {
    if (this.props.onClick()) {
      this.setState({
        wasClicked: true,
      });
    }
  }

  render() {
    const {
      onClick,
      onSuccess,
      loading,
      error,
      values,
      ...otherProps
    } = this.props;

    const [
      defaultText,
      loadingText,
      successText,
      failureText,
    ] = values;
    let bgColor = null;
    let textValue = defaultText;
    if (loading) {
      textValue = loadingText;
    } else if (this.state.tid) {
      if (this.state.didError) {
        textValue = failureText;
        bgColor = '#d9534f';
      } else {
        textValue = successText;
        bgColor = '#5cb85c';
      }
    }

    const disabled = loading;
    return (
      <Button
        {...otherProps}
        style={{ backgroundColor: bgColor }}
        onClick={this.onClick}
        disabled={disabled}
        value={textValue}
      />
    );
  }
}

LoadingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuccess: PropTypes.func,
};

LoadingButton.defaultProps = {
  onSuccess: () => {},
};

export default LoadingButton;
