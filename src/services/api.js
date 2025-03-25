import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://hubkom-crm-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Prospect API methods
export const prospectService = {
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

export default api; 