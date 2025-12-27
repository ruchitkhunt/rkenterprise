import React, { useState } from 'react';

const Header = ({ adminUser, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="menu-toggle">
          <i className="lni lni-menu"></i>
        </button>
        <div className="header-title">
          <div className="header-logo">RK</div>
          <div className="header-brand-text">
            <span className="brand-name">RK Enterprise</span>
            <span className="brand-subtitle">Admin Panel</span>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-menu">
          <button 
            className="user-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              {adminUser.username ? adminUser.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="user-name">{adminUser.username || 'admin'}</span>
            <i className="lni lni-chevron-down dropdown-arrow"></i>
          </button>
          
          <div className={`user-dropdown ${!dropdownOpen ? 'hidden' : ''}`}>
            <div className="dropdown-header">
              <p className="dropdown-user-name">{adminUser.username || 'Administrator'}</p>
              <p className="dropdown-user-email">admin@rkenterprise.com</p>
            </div>
            <div className="dropdown-body">
              <button className="dropdown-item">
                <i className="lni lni-user"></i>
                <span>Profile</span>
              </button>
              <button className="dropdown-item">
                <i className="lni lni-cog"></i>
                <span>Settings</span>
              </button>
              <button className="dropdown-item" onClick={onLogout}>
                <i className="lni lni-exit"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
