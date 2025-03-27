import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth0();
  
  useEffect(() => {
    console.log('PrivateRoute - Auth State:', { 
      isAuthenticated, 
      isLoading, 
      user: user ? { name: user.name, email: user.email } : null,
      hasError: !!error
    });
    
    if (error) {
      console.error('PrivateRoute - Auth0 Error:', error);
    }
  }, [isAuthenticated, isLoading, user, error]);
  
  if (isLoading) {
    console.log('PrivateRoute - Loading auth state');
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  console.log('PrivateRoute - Auth check result:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute; 