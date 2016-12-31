import React, { PropTypes } from 'react';

// TODO: <Link to={link}>
const SideMenuItem = ({ text, link }) => (
  <div className="sidemenu__item">
    <div className="sidemenu__item-ribbon" />
    <span>{text}</span>
  </div>
);

SideMenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SideMenuItem;
