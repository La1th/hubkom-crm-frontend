import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../services/api';
import '../styles/ProspectList.css';

const ProspectList = () => {
  const { prospectService } = useApi();
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const data = await prospectService.getProspects();
      setProspects(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prospects. Please try again later.');
      console.error('Error fetching prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter !== 'All') filters.status = statusFilter;
      
      const data = await prospectService.getProspects(filters);
      setProspects(data);
      setError(null);
    } catch (err) {
      setError('Failed to search prospects. Please try again later.');
      console.error('Error searching prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  return (
    <div className="prospect-list">
      <div className="prospect-list-header">
        <h1>Prospects</h1>
        <Link to="/prospects/new" className="btn btn-primary">+ Add Prospect</Link>
      </div>
      
      <div className="filters-wrapper card">
        <div className="filters">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="status-filter-wrapper">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="All">All Statuses</option>
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
      
      {error && (
        <div className="error-message card">{error}</div>
      )}
      
      {loading ? (
        <div className="loading">Loading prospects...</div>
      ) : (
        <div className="card">
          <table className="prospects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prospects.length > 0 ? (
                prospects.map(prospect => (
                  <tr key={prospect._id}>
                    <td>{prospect.fullName}</td>
                    <td>{prospect.email}</td>
                    <td>{prospect.phoneNumber}</td>
                    <td>
                      <span className={`status-badge ${prospect.status.toLowerCase().replace(/\s+/g, '-').replace('/', '-')}`}>
                        {prospect.status}
                      </span>
                    </td>
                    <td>{prospect.lastContact ? new Date(prospect.lastContact).toLocaleDateString() : 'Never'}</td>
                    <td className="action-buttons">
                      <Link to={`/prospects/${prospect._id}`} className="btn-action btn-view">View</Link>
                      <Link to={`/prospects/${prospect._id}/edit`} className="btn-action btn-edit">Edit</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-prospects">
                    No prospects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProspectList; 