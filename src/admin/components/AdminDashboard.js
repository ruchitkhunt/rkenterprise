import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './admin-style.css';
import { adminApiService } from '../services/adminApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import MenuApp from './MenuApp';
import Header from './Header';
import StatsCards from './StatsCards';
import Queries from './Queries';
import Users from './Users';
import Settings from './Settings';
import ProductsManagement from './ProductsManagement';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, getAdminUser } = useAdminAuth();
  
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const adminUser = getAdminUser();

  const fetchQueries = useCallback(async () => {
    try {
      const data = await adminApiService.fetchQueries();
      setQueries(data);
    } catch (error) {
      console.error('Error fetching queries:', error);
      if (error.message === 'UNAUTHORIZED') {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Only fetch queries on dashboard or queries tab
    if (activeTab === 'dashboard' || activeTab === 'queries') {
      fetchQueries();
    } else {
      setLoading(false);
    }
  }, [activeTab, fetchQueries]);

  // Update active tab when URL changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/queries')) setActiveTab('queries');
    else if (path.includes('/products')) setActiveTab('products');
    else if (path.includes('/users')) setActiveTab('users');
    else if (path.includes('/settings')) setActiveTab('settings');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) {
      return;
    }

    try {
      await adminApiService.deleteQuery(id);
      setQueries(queries.filter(q => q.id !== id));
      alert('Query deleted successfully');
    } catch (error) {
      console.error('Error deleting query:', error);
      alert('Failed to delete query');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <MenuApp activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-wrapper">
        <Header adminUser={adminUser} onLogout={logout} />

        <div className="main-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="content-header">
                <h1>Dashboard</h1>
              </div>
              <StatsCards queries={queries} />
            </>
          )}
          {activeTab === 'queries' && <Queries queries={queries} onDelete={handleDelete} />}
          {activeTab === 'products' && <ProductsManagement />}
          {activeTab === 'users' && <Users adminUser={adminUser} />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
