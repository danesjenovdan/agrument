import React from 'react';
import { Link } from 'react-router/es6';

const Navbar = () => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <span className="navbar-brand">Zdravo Miha!</span>
      </div>
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="">Shortener</Link></li>
        <li><Link to="/">Agrument</Link></li>
        <li><Link to="">Log out</Link></li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
