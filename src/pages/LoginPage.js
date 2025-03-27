import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const { isAuthenticated, loginWithRedirect, isLoading, user, error } = useAuth0();
  
  useEffect(() => {
    console.log('LoginPage - Auth State:', { 
      isAuthenticated, 
      isLoading, 
      user: user ? { name: user.name, email: user.email } : null,
      hasError: !!error
    });
    
    if (error) {
      console.error('Auth0 Error:', error);
    }
  }, [isAuthenticated, isLoading, user, error]);
  
  if (isLoading) {
    console.log('LoginPage - Loading auth state');
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }
  
  if (isAuthenticated) {
    console.log('LoginPage - User authenticated, redirecting to dashboard');
    return <Navigate to="/" />;
  }
  
  const handleLogin = () => {
    console.log('LoginPage - Login button clicked');
    loginWithRedirect();
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Simple CRM</h1>
        <p>Manage your prospects and pipeline effectively</p>
        <button 
          className="login-button" 
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 