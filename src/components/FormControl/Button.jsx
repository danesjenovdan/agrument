import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function getButtonType(type) {
  switch (type) {
    case 'reset':
      return 'reset';
    case 'submit':
      return 'submit';
    default:
      return 'button';
  }
}

export default function Button({
  value,
  block,
  external,
  children,
  type,
  href,
  disabled,
  onClick,
  className,
  ...otherProps
}) {
  const inside = !children ? value : children;
  const classes = classnames(
    'component__button',
    'btn',
    { 'btn-block': block },
    { 'disabled ': disabled },
    className
  );
  const buttonType = getButtonType(type);
  if (!href) {
    return (
      /* eslint-disable react/button-has-type */
      <button
        {...otherProps}
        className={classes}
        value={value}
        type={buttonType}
        onClick={onClick}
        disabled={disabled}
      >
        {inside}
      </button>
      /* eslint-enable react/button-has-type */
    );
  }
  const target = {};
  if (external) {
    target.target = '_blank';
    target.rel = 'noopener noreferrer';
  }
  return (
    <a
      {...otherProps}
      className={classes}
      href={href}
      {...target}
      onClick={onClick}
    >
      {inside}
    </a>
  );
}

Button.propTypes = {
  value: PropTypes.string,
  block: PropTypes.bool,
  external: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.string,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  value: '',
  block: false,
  external: false,
  children: null,
  type: 'button',
  href: '',
  disabled: false,
  onClick: () => {},
  className: '',
};
