import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ user }) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <span className="navbar-brand">Zdravo {user.name}!</span>
      </div>
      <ul className="nav navbar-nav">
        <li><NavLink to="/dash" exact activeClassName="active">Čakalnica</NavLink></li>
        <li><NavLink to="/dash/list" activeClassName="active">Objavljeni</NavLink></li>
        {user.group === 'admin' && <li><NavLink to="/dash/admin" activeClassName="active">Admin</NavLink></li>}
      </ul>
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/">Agrument</Link></li>
        <li><a href="https://djnd.si/short/" target="_blank" rel="noopener noreferrer">Shortener</a></li>
        <li><Link to="/login?logout=true">Odjavi se</Link></li>
      </ul>
    </div>
  </nav>
);

Navbar.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default Navbar;
