import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Button = ({ value, block, external, children, type = 'button', href, disabled, onClickFunc }) => {
  const inside = typeof children === 'undefined' ? value : children;
  const classes = classnames(
    'component__button',
    'btn',
    { 'btn-block': block },
    { 'disabled ': disabled },
  );
  if (typeof href === 'undefined') {
    return (
      <button className={classes} value={value} type={type} onClick={onClickFunc}>{inside}</button>
    );
  }
  const target = {};
  if (external) {
    target.target = '_blank';
    target.rel = 'noopener noreferrer';
  }
  return (<a className={classes} href={href} {...target} onClick={onClickFunc}>{inside}</a>);
};

Button.propTypes = {
  value: PropTypes.string,
  block: PropTypes.bool,
  external: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.string,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  onClickFunc: PropTypes.func,
};

export default Button;
