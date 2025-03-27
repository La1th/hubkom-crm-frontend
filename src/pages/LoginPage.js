import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  
  if (isLoading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Simple CRM</h1>
        <p>Manage your prospects and pipeline effectively</p>
        <button 
          className="login-button" 
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 