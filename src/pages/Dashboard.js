import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { prospectService } = useApi();
  const [stats, setStats] = useState({
    totalProspects: 0,
    newLeads: 0,
    qualified: 0,
    negotiation: 0,
    won: 0,
    lost: 0
  });

  const [recentProspects, setRecentProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all prospects
        const prospects = await prospectService.getProspects();
        
        // Calculate stats
        const dashboardStats = {
          totalProspects: prospects.length,
          newLeads: prospects.filter(p => p.status === 'New Lead').length,
          contacted: prospects.filter(p => p.status === 'Contacted').length,
          qualified: prospects.filter(p => p.status === 'Qualified').length,
          proposal: prospects.filter(p => p.status === 'Proposal').length,
          negotiation: prospects.filter(p => p.status === 'Negotiation').length,
          contractSent: prospects.filter(p => p.status === 'Contract Sent').length,
          won: prospects.filter(p => p.status === 'Won/Sold').length,
          lost: prospects.filter(p => p.status === 'Lost').length,
          inactive: prospects.filter(p => p.status === 'Inactive').length
        };
        
        setStats(dashboardStats);
        
        // Get recent prospects (sorted by creation date)
        const sortedProspects = [...prospects].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Take the 5 most recent prospects
        setRecentProspects(sortedProspects.slice(0, 5));
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {error && (
        <div className="error-message card">{error}</div>
      )}
      
      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Prospects</h3>
              <div className="stat-value">{stats.totalProspects}</div>
            </div>
            <div className="stat-card">
              <h3>New Leads</h3>
              <div className="stat-value">{stats.newLeads}</div>
            </div>
            <div className="stat-card">
              <h3>Qualified</h3>
              <div className="stat-value">{stats.qualified}</div>
            </div>
            <div className="stat-card">
              <h3>In Negotiation</h3>
              <div className="stat-value">{stats.negotiation}</div>
            </div>
            <div className="stat-card">
              <h3>Deals Won</h3>
              <div className="stat-value">{stats.won}</div>
            </div>
            <div className="stat-card">
              <h3>Deals Lost</h3>
              <div className="stat-value">{stats.lost}</div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Prospects</h2>
              <Link to="/prospects" className="view-all">View All</Link>
            </div>
            <div className="card">
              {recentProspects.length > 0 ? (
                <table className="prospects-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Last Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProspects.map(prospect => (
                      <tr key={prospect._id}>
                        <td>{prospect.fullName}</td>
                        <td>{prospect.email}</td>
                        <td>
                          <span className={`status-badge ${prospect.status.toLowerCase().replace(/\s+/g, '-').replace('/', '-')}`}>
                            {prospect.status}
                          </span>
                        </td>
                        <td>{formatDate(prospect.lastContact)}</td>
                        <td>
                          <Link to={`/prospects/${prospect._id}`} className="view-link">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-prospects">
                  No prospects yet. <Link to="/prospects/new">Add your first prospect</Link> to get started!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 