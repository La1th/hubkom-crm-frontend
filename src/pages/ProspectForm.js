import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../services/api';
import '../styles/ProspectForm.css';

const ProspectForm = () => {
  const { prospectService } = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    status: 'New Lead',
    notes: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchProspect = async () => {
        try {
          setLoading(true);
          const data = await prospectService.getProspect(id);
          
          setFormData({
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            status: data.status,
            notes: data.notes && data.notes.length > 0 ? data.notes[0].content : '',
          });
          
          setError('');
        } catch (err) {
          setError('Failed to fetch prospect data. Please try again later.');
          console.error('Error fetching prospect:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProspect();
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare data for API
      const prospectData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        status: formData.status,
      };
      
      // Add notes if provided (only for new prospects)
      if (!isEditing && formData.notes.trim()) {
        prospectData.notes = formData.notes;
      }
      
      if (isEditing) {
        await prospectService.updateProspect(id, prospectData);
        
        // If notes were added in edit mode, add them separately
        if (formData.notes.trim()) {
          await prospectService.addNote(id, { content: formData.notes });
        }
      } else {
        await prospectService.createProspect(prospectData);
      }
      
      navigate('/prospects');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} prospect. Please try again later.`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} prospect:`, err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading prospect data...</div>;
  }

  return (
    <div className="prospect-form-page">
      <h1>{isEditing ? 'Edit Prospect' : 'Add New Prospect'}</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="prospect-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter full name"
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email address"
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter phone number"
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
              disabled={submitting}
            >
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Contract Sent">Contract Sent</option>
              <option value="Won/Sold">Won/Sold</option>
              <option value="Lost">Lost</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              {isEditing ? 'Add a New Note' : 'Initial Notes'}
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              placeholder={isEditing ? "Add a new note about this prospect" : "Enter initial notes about this prospect"}
              rows="4"
              disabled={submitting}
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/prospects')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEditing ? 'Update Prospect' : 'Add Prospect')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProspectForm; 