import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const user = useSelector((state) => state.user.data);

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <span className="navbar-brand">Zdravo {user.name}!</span>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <NavLink to="/dash" end>
              Čakalnica
            </NavLink>
          </li>
          <li>
            <NavLink to="/dash/list">Objavljeni</NavLink>
          </li>
          {user.group === 'admin' && (
            <li>
              <NavLink to="/dash/admin">Admin</NavLink>
            </li>
          )}
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a
              href="https://danesjenovdan.si/agrument"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agrument
            </a>
          </li>
          <li>
            <a
              href="https://djnd.si/short/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shortener
            </a>
          </li>
          <li>
            <Link to="/login?logout=true">Odjavi se</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
