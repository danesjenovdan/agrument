import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Navbar = ({ username }) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <span className="navbar-brand">Zdravo {username}!</span>
      </div>
      <ul className="nav navbar-nav navbar-right">
        <li><a href="http://djnd.si/short/" target="_blank" rel="noopener noreferrer">Shortener</a></li>
        <li><Link to="/">Agrument</Link></li>
        <li><Link to={{ pathname: '/login', query: { logout: true } }}>Odjavi se!</Link></li>
      </ul>
    </div>
  </nav>
);

Navbar.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Navbar;
