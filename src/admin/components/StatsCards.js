import React from 'react';

const StatsCards = ({ queries }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card queries">
        <div className="stat-card-border"></div>
        <div className="stat-card-content">
          <div className="stat-icon">
            <i className="lni lni-comments-alt"></i>
          </div>
          <div className="stat-info">
            <h3>Total Queries</h3>
            <p>{queries.length}</p>
          </div>
        </div>
      </div>
      <div className="stat-card users">
        <div className="stat-card-border"></div>
        <div className="stat-card-content">
          <div className="stat-icon">
            <i className="lni lni-users"></i>
          </div>
          <div className="stat-info">
            <h3>Active Users</h3>
            <p>1</p>
          </div>
        </div>
      </div>
      <div className="stat-card pending">
        <div className="stat-card-border"></div>
        <div className="stat-card-content">
          <div className="stat-icon">
            <i className="lni lni-alarm-clock"></i>
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p>{queries.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
