import React from 'react';

const Queries = ({ queries, onDelete }) => {
  return (
    <div className="box">
      <div className="box-header">
        <h3>Contact Queries</h3>
      </div>
      <div className="box-body">
        {queries.length === 0 ? (
          <p className="no-queries">No queries yet</p>
        ) : (
          <div className="queries-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Number</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query.id}>
                    <td>{query.id}</td>
                    <td>{query.name}</td>
                    <td>{query.email}</td>
                    <td>{query.number || 'N/A'}</td>
                    <td>{query.subject || 'N/A'}</td>
                    <td className="message-cell">{query.message}</td>
                    <td>{new Date(query.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => onDelete(query.id)} 
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queries;
