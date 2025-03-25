import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { prospectService } from '../services/api';
import '../styles/ProspectDetail.css';

const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newActivity, setNewActivity] = useState({
    type: 'Call',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProspect = async () => {
      try {
        setLoading(true);
        const data = await prospectService.getProspect(id);
        setProspect(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch prospect details. Please try again later.');
        console.error('Error fetching prospect:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProspect();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    
    try {
      setSubmitting(true);
      
      const updatedProspect = await prospectService.addNote(id, { content: newNote });
      setProspect(updatedProspect);
      setNewNote('');
      setError(null);
    } catch (err) {
      setError('Failed to add note. Please try again later.');
      console.error('Error adding note:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    
    if (!newActivity.description.trim()) return;
    
    try {
      setSubmitting(true);
      
      const updatedProspect = await prospectService.addActivity(id, newActivity);
      setProspect(updatedProspect);
      setNewActivity({
        type: 'Call',
        description: ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to add activity. Please try again later.');
      console.error('Error adding activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    try {
      setSubmitting(true);
      
      const updatedProspect = await prospectService.updateStatus(id, newStatus);
      setProspect(updatedProspect);
      setError(null);
    } catch (err) {
      setError('Failed to update status. Please try again later.');
      console.error('Error updating status:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProspect = async () => {
    if (!window.confirm('Are you sure you want to delete this prospect?')) {
      return;
    }
    
    try {
      setSubmitting(true);
      await prospectService.deleteProspect(id);
      navigate('/prospects');
    } catch (err) {
      setError('Failed to delete prospect. Please try again later.');
      console.error('Error deleting prospect:', err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading prospect details...</div>;
  }

  if (error) {
    return <div className="error-message card">{error}</div>;
  }

  if (!prospect) {
    return <div className="error-message card">Prospect not found</div>;
  }

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="prospect-detail">
      <div className="prospect-header">
        <div>
          <h1>{prospect.fullName}</h1>
          <div className="prospect-subheader">
            <span className={`status-badge ${prospect.status.toLowerCase().replace(/\s+/g, '-').replace('/', '-')}`}>
              {prospect.status}
            </span>
            <span className="prospect-created">Created on {formatDate(prospect.createdAt)}</span>
          </div>
        </div>
        <div className="prospect-actions">
          <Link to={`/prospects/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button 
            className="btn btn-danger" 
            onClick={handleDeleteProspect}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div className="prospect-details-grid">
        <div className="prospect-info-card card">
          <h2>Contact Information</h2>
          <div className="info-item">
            <div className="info-label">Email:</div>
            <div className="info-value">
              <a href={`mailto:${prospect.email}`}>{prospect.email}</a>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Phone:</div>
            <div className="info-value">
              <a href={`tel:${prospect.phoneNumber}`}>{prospect.phoneNumber}</a>
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Last Contact:</div>
            <div className="info-value">{formatDate(prospect.lastContact)}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Status:</div>
            <div className="info-value">
              <select 
                value={prospect.status} 
                onChange={handleStatusChange}
                className="status-select"
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
          </div>
        </div>
        
        <div className="prospect-activities card">
          <h2>Activities</h2>
          
          <form onSubmit={handleAddActivity} className="add-activity-form">
            <div className="activity-form-row">
              <select 
                value={newActivity.type}
                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                className="activity-type-select"
                disabled={submitting}
              >
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
              </select>
              <input 
                type="text"
                placeholder="Add activity description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                className="activity-input"
                disabled={submitting}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting || !newActivity.description.trim()}
              >
                {submitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
          
          <div className="activities-list">
            {prospect.activities && prospect.activities.length > 0 ? (
              prospect.activities.map(activity => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-info">
                    <span className={`activity-type activity-${activity.type.toLowerCase()}`}>
                      {activity.type}
                    </span>
                    <span className="activity-date">{formatDate(activity.createdAt)}</span>
                  </div>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-user">by {activity.user}</div>
                </div>
              ))
            ) : (
              <div className="no-activities">No activities recorded yet.</div>
            )}
          </div>
        </div>
        
        <div className="prospect-notes card">
          <h2>Notes</h2>
          
          <form onSubmit={handleAddNote} className="add-note-form">
            <textarea
              placeholder="Add a note about this prospect..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="note-textarea"
              disabled={submitting}
            ></textarea>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting || !newNote.trim()}
            >
              {submitting ? 'Adding...' : 'Add Note'}
            </button>
          </form>
          
          <div className="notes-list">
            {prospect.notes && prospect.notes.length > 0 ? (
              prospect.notes.map(note => (
                <div key={note._id} className="note-item">
                  <div className="note-header">
                    <span className="note-date">{formatDate(note.createdAt)}</span>
                    <span className="note-user">by {note.user}</span>
                  </div>
                  <div className="note-content">{note.content}</div>
                </div>
              ))
            ) : (
              <div className="no-notes">No notes added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail; 