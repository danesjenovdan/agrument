import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class SideMenuItem extends React.Component {
  render() {
    const { text, link, active, color } = this.props;
    const classes = classnames(
      'sidemenu__item',
      { 'active': active }
    );
    return (
      <div className={classes}>
        <div className="sidemenu__item-ribbon" style={{ backgroundColor: color }} />
        <a href={link} target="_blank" rel="noopener noreferrer">{text}</a>
      </div>
    );
  }
}

SideMenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  active: PropTypes.bool,
  color: PropTypes.string,
};

SideMenuItem.defaultProps = {
  active: false,
  color: '#c2d8d8',
};

export default SideMenuItem;
