import React from 'react'; import PropTypes from 'prop-types';

const Content = ({ children }) => (
  <div className="card__content">
    <div className="row">
      <div className="col-md-12">
        {children}
      </div>
    </div>
  </div>
);

Content.propTypes = {
  children: PropTypes.node,
};

export default Content;
