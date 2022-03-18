import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner.jsx';

export default function RenderSpinner({ isLoading, data, error, children }) {
  if (isLoading) {
    return <Spinner />;
  }
  if (data) {
    return children(data);
  }
  if (error) {
    return 'Napaka pri nalaganju.';
  }
  return null;
}

RenderSpinner.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  error: PropTypes.shape(),
  children: PropTypes.func.isRequired,
};

RenderSpinner.defaultProps = {
  data: null,
  error: null,
};
