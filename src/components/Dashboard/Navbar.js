import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ username }) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <span className="navbar-brand">Zdravo {username}!</span>
      </div>
      <ul className="nav navbar-nav">
        <li><Link to="/dash">Dashboard</Link></li>
        <li><Link to="/dash/list">Seznam agrumentov</Link></li>
      </ul>
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/">Agrument</Link></li>
        <li><a href="https://djnd.si/short/" target="_blank" rel="noopener noreferrer">Shortener</a></li>
        <li><Link to="/login?logout=true">Odjavi se!</Link></li>
      </ul>
    </div>
  </nav>
);

Navbar.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Navbar;
