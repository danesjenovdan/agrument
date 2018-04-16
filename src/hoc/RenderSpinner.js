import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';

const RenderSpinner = (props) => {
  if (props.isLoading) {
    return <Spinner />;
  }
  if ('hasData' in props ? props.hasData : true) {
    return props.children;
  }
  if (props.error) {
    return 'Napaka pri nalaganju.';
  }
  return null;
};

RenderSpinner.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  hasData: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  error: PropTypes.any,
  children: PropTypes.node.isRequired,
};

export default RenderSpinner;
