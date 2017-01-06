import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Header = ({ title, subTitle, small }) => {
  const classes = classnames(
    'row',
    'component__header',
    { 'component__header--small': small },
  );
  return (
    <div className={classes}>
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
};

Header.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  small: PropTypes.bool,
};

export default Header;
