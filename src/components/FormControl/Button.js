import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Button = ({
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
}) => {
  const inside = !children ? value : children;
  const classes = classnames(
    'component__button',
    'btn',
    { 'btn-block': block },
    { 'disabled ': disabled },
    className,
  );
  if (!href) {
    return (
      <button
        {...otherProps}
        className={classes}
        value={value}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {inside}
      </button>
    );
  }
  const target = {};
  if (external) {
    target.target = '_blank';
    target.rel = 'noopener noreferrer';
  }
  return (
    <a {...otherProps} className={classes} href={href} {...target} onClick={onClick}>{inside}</a>
  );
};

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
  onClick: () => { },
  className: '',
};

export default Button;
