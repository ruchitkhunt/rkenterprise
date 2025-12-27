import React from 'react';
import { useNavigate } from 'react-router-dom';

const MenuApp = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-img">RK</div>
          <div className="logo-text">
            <span className="brand">RK Enterprise</span>
            <span className="version">Admin Panel</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <div className="nav-header">MAIN NAVIGATION</div>
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigation('dashboard', '/admin/dashboard')}
        >
          <i className="lni lni-dashboard"></i>
          <span>Dashboard</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => handleNavigation('queries', '/admin/queries')}
        >
          <i className="lni lni-comments"></i>
          <span>Contact Queries</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleNavigation('products', '/admin/products')}
        >
          <i className="lni lni-package"></i>
          <span>Products</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleNavigation('users', '/admin/users')}
        >
          <i className="lni lni-users"></i>
          <span>Users</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleNavigation('settings', '/admin/settings')}
        >
          <i className="lni lni-cog"></i>
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default MenuApp;
