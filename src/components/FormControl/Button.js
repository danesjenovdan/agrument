import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Button = ({ value, block, external, children, type, href, disabled, onClick }) => {
  const inside = !children ? value : children;
  const classes = classnames(
    'component__button',
    'btn',
    { 'btn-block': block },
    { 'disabled ': disabled },
  );
  if (!href) {
    return (
      <button
        className={classes}
        value={value}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >{inside}</button>
    );
  }
  const target = {};
  if (external) {
    target.target = '_blank';
    target.rel = 'noopener noreferrer';
  }
  return (<a className={classes} href={href} {...target} onClick={onClick}>{inside}</a>);
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
};

export default Button;
