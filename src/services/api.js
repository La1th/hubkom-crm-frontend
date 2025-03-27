import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { createContext, useContext, useMemo } from 'react';

// Create a context for the API service
const ApiContext = createContext(null);

// Provider component that creates the API service with auth tokens
export const ApiProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
  // Create the API service with authentication
  const apiService = useMemo(() => {
    // Create an axios instance with default config
    const api = axios.create({
      baseURL: 'https://hubkom-crm-backend.onrender.com/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to include auth token
    api.interceptors.request.use(async (config) => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Added authentication token to request');
        } catch (error) {
          console.error('Error getting token', error);
          // Continue with the request without the token
          console.warn('Proceeding without authentication token');
        }
      } else {
        console.warn('User not authenticated, proceeding without token');
      }
      return config;
    });

    // Prospect API methods
    const prospectService = {
      // Get all prospects with optional filters
      getProspects: async (filters = {}) => {
        try {
          const { status, search } = filters;
          let url = '/prospects';
          
          // Add query parameters if provided
          const params = new URLSearchParams();
          if (status) params.append('status', status);
          if (search) params.append('search', search);
          
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
          
          const response = await api.get(url);
          return response.data;
        } catch (error) {
          console.error('Error fetching prospects:', error);
          throw error;
        }
      },

      // Get a specific prospect by ID
      getProspect: async (id) => {
        try {
          const response = await api.get(`/prospects/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching prospect:', error);
          throw error;
        }
      },

      // Create a new prospect
      createProspect: async (prospectData) => {
        try {
          const response = await api.post('/prospects', prospectData);
          return response.data;
        } catch (error) {
          console.error('Error creating prospect:', error);
          throw error;
        }
      },

      // Update a prospect
      updateProspect: async (id, prospectData) => {
        try {
          const response = await api.put(`/prospects/${id}`, prospectData);
          return response.data;
        } catch (error) {
          console.error('Error updating prospect:', error);
          throw error;
        }
      },

      // Delete a prospect
      deleteProspect: async (id) => {
        try {
          const response = await api.delete(`/prospects/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error deleting prospect:', error);
          throw error;
        }
      },

      // Add a note to a prospect
      addNote: async (id, noteData) => {
        try {
          const response = await api.post(`/prospects/${id}/notes`, noteData);
          return response.data;
        } catch (error) {
          console.error('Error adding note:', error);
          throw error;
        }
      },

      // Add an activity to a prospect
      addActivity: async (id, activityData) => {
        try {
          const response = await api.post(`/prospects/${id}/activities`, activityData);
          return response.data;
        } catch (error) {
          console.error('Error adding activity:', error);
          throw error;
        }
      },

      // Update a prospect's status (used for drag-and-drop in Kanban board)
      updateStatus: async (id, status) => {
        try {
          const response = await api.put(`/prospects/${id}`, { status });
          return response.data;
        } catch (error) {
          console.error('Error updating prospect status:', error);
          throw error;
        }
      }
    };

    return { api, prospectService };
  }, [getAccessTokenSilently, isAuthenticated]);

  return (
    <ApiContext.Provider value={apiService}>
      {children}
    </ApiContext.Provider>
  );
};

// Hook to use the API service
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Export the prospectService directly for backward compatibility
// This is a simplified version that doesn't use Auth0 hooks directly
export const prospectService = {
  getProspects: async (filters = {}) => {
    console.warn('Direct use of prospectService is deprecated. Please use the useApi hook instead.');
    
    // Create a basic API instance without authentication
    const api = axios.create({
      baseURL: 'https://hubkom-crm-backend.onrender.com/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    try {
      const { status, search } = filters;
      let url = '/prospects';
      
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching prospects:', error);
      throw error;
    }
  },
  
  // Add other methods as needed with the same pattern
  getProspect: async (id) => {
    console.warn('Direct use of prospectService is deprecated. Please use the useApi hook instead.');
    const api = axios.create({
      baseURL: 'https://hubkom-crm-backend.onrender.com/api'
    });
    
    try {
      const response = await api.get(`/prospects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prospect:', error);
      throw error;
    }
  },
  
  // Add other methods as needed
}; 