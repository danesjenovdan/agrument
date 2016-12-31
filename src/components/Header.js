import React, { PropTypes } from 'react';

const Header = ({ title, subTitle }) => (
  <div className="row component__header">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="header__intro">
            <span className="header__title">{title} / </span>
            {subTitle}
          </h1>
        </div>
      </div>
    </div>
  </div>
);

Header.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

export default Header;
