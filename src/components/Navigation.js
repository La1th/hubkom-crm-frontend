import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from '../auth/auth0-config';
import '../styles/Navigation.css';

const Navigation = () => {
  const { logout, user } = useAuth0();

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: auth0Config.redirectUri 
      }
    });
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>HUBKOM CRM</h1>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/prospects">Prospects</NavLink>
        </li>
        <li>
          <NavLink to="/pipeline">Pipeline</NavLink>
        </li>
      </ul>
      <div className="nav-actions">
        <button className="btn btn-primary">
          <NavLink to="/prospects/new">+ New Prospect</NavLink>
        </button>
        {user && (
          <div className="user-menu">
            <span className="user-name">{user.name || user.email}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 