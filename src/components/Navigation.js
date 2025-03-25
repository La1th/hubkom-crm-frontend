import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
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
      </div>
    </nav>
  );
};

export default Navigation; 