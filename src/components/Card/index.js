import React, { PropTypes } from 'react';
import HeaderTriangle from './HeaderTriangle';

const Card = ({ title, children }) => (
  <div className="card__container">
    <HeaderTriangle title={title} />
    <div className="row">
      <div className="col-md-12">
        {children}
      </div>
    </div>
  </div>
);

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
