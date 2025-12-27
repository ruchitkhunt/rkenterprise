import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { API_BASE_URL } from '../../../constant';

const ProductsList = ({ onEdit, onRefresh }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [onRefresh]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/products');
      setProducts(response.products || []);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminApi.delete(`/admin/products/${id}`);
      setSuccessMessage('Product deleted successfully!');
      setErrorMessage('');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product');
      setSuccessMessage('');
      
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? 'activated' : 'deactivated';
    
    try {
      await adminApi.patch(`/admin/products/${id}/status`, { status: newStatus });
      
      setSuccessMessage(`Product ${statusText} successfully!`);
      setErrorMessage('');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      fetchProducts();
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage(error.message || 'Failed to update product status');
      setSuccessMessage('');
      
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-table">
      {successMessage && (
        <div className="alert alert-success" style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          <i className="lni lni-checkmark-circle" style={{ marginRight: '8px' }}></i>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger" style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <i className="lni lni-close" style={{ marginRight: '8px' }}></i>
          {errorMessage}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Image</th>
            <th>Name</th>
            <th>Status</th>
            <th>Summary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>
                <img 
                  src={`${API_BASE_URL}${product.image}`} 
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
              </td>
              <td>{product.name}</td>
              <td>
                <button
                  className={`status-badge ${product.status === 1 ? 'active' : 'inactive'}`}
                  onClick={() => toggleStatus(product.id, product.status)}
                >
                  {product.status === 1 ? 'active' : 'inactive'}
                </button>
              </td>
              <td>{product.summary}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(product)}
                    title="Edit"
                  >
                    <i className="lni lni-pencil"></i>
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                    title="Delete"
                  >
                    <i className="lni lni-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
