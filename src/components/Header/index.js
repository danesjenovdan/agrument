import React, { PropTypes } from 'react';
import './style.scss';

const { string } = PropTypes;

const Header = ({ title, subTitle }) => (
  <div className="row" id="header">
    <div className="container">
      <div className="row">
        <div id="menu">
          <div className="menutoggle">
            <div className="icon-menu" />
          </div>
          <h1 className="nologo">Meni</h1>
        </div>
        <div className="col-md-12">
          <h1 id="intro">
            <span id="title">{title} / </span>
            {subTitle}
          </h1>
        </div>
      </div>
    </div>
  </div>
);

Header.propTypes = {
  title: string,
  subTitle: string,
};

export default Header;
