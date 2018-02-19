import React from 'react'; import PropTypes from 'prop-types';

const Heading = ({ title }) => (
  <div className="card__header">
    <h1 className="card__title">{title}</h1>
  </div>
);

Heading.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Heading;
