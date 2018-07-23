import React from 'react';
import PropTypes from 'prop-types';

class ScrollBodyOnFirstRender extends React.Component {
  state = {
    scrolled: false,
  };

  render() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.props.enabled && !this.state.scrolled) {
          const element = document.querySelector(this.props.selector);
          if (element) {
            element.scrollIntoView(true);
            document.documentElement.scrollTop -= 20;
            this.setState({ scrolled: true });
          }
        }
      });
    });
    return this.props.children;
  }
}

ScrollBodyOnFirstRender.propTypes = {
  selector: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ScrollBodyOnFirstRender;
