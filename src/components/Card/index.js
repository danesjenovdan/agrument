import React, { PropTypes } from 'react';
import classnames from 'classnames';
import HeaderTriangle from './_HeaderTriangle';

const Card = ({ title, children }) => {
  const hasContent = !!children;
  const classes = classnames(
    'card__container',
    { 'card__container--has-content': hasContent },
  );
  const content = hasContent ? (
    <div className="row">
      <div className="col-md-12">
        {children}
      </div>
    </div>
  ) : null;
  return (
    <div className={classes}>
      <HeaderTriangle title={title} />
      {content}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
