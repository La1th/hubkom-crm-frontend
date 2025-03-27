import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from '../auth/auth0-config';
import '../styles/Navigation.css';

const Navigation = () => {
  const { logout, user } = useAuth0();
  
  // Debug user object
  useEffect(() => {
    if (user) {
      console.log('Auth0 User Object:', user);
    }
  }, [user]);

  // Function to extract first name from user object
  const getFirstName = () => {
    if (!user) return '';
    
    // Debug email extraction
    console.log('Email before extraction:', user.email);
    
    // If Auth0 provides a name, extract the first name
    if (user.name) {
      console.log('Using name from user.name:', user.name.split(' ')[0]);
      return user.name.split(' ')[0];
    }
    
    // If only email is available, extract name part before @
    if (user.email) {
      const username = user.email.split('@')[0];
      console.log('Extracted username from email:', username);
      return username;
    }
    
    return 'User';
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: auth0Config.redirectUri 
      }
    });
  };

  // Get the display name here for debugging
  const displayName = getFirstName();
  console.log('Final display name:', displayName);

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
            <span className="user-name">★ Hello, {displayName} ★</span>
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