import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Header({ title, subTitle, small }) {
  const classes = classnames('row', 'component__header', {
    'component__header--small': small,
  });
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
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

Header.defaultProps = {
  small: false,
};
