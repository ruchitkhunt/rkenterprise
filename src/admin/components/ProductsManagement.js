import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductsList from './products/ProductsList';
import AddProduct from './products/AddProduct';
import EditProduct from './products/EditProduct';

const ProductsManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const isAddPage = location.pathname === '/admin/products/add';
  const isEditPage = location.pathname === '/admin/products/edit';

  // Get product from navigation state when on edit page
  useEffect(() => {
    if (isEditPage) {
      if (location.state?.product) {
        setEditingProduct(location.state.product);
      } else {
        // If no product in state, redirect back to products list
        alert('Please select a product to edit');
        navigate('/admin/products');
      }
    } else if (!isAddPage) {
      // Clear editing product when back on list
      setEditingProduct(null);
    }
  }, [isEditPage, isAddPage, navigate, location.state]);

  const handleEdit = (product) => {
    navigate('/admin/products/edit', { state: { product } });
  };

  const handleSuccess = (message) => {
    setRefreshKey(prev => prev + 1);
    setSuccessMessage(message);
    navigate('/admin/products');
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleClose = () => {
    navigate('/admin/products');
    setEditingProduct(null);
  };

  return (
    <div className="products-management">
      {!isAddPage && !isEditPage && (
        <>
          <div className="header-section">
            <h2>Products Management</h2>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/admin/products/add')}
            >
              <i className="lni lni-plus"></i> Add New Product
            </button>
          </div>

          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> {successMessage}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccessMessage('')}
                aria-label="Close"
              ></button>
            </div>
          )}

          <ProductsList 
            onEdit={handleEdit} 
            onRefresh={refreshKey}
          />
        </>
      )}

      {isAddPage && (
        <AddProduct
          onClose={handleClose}
          onSuccess={() => handleSuccess('Product added successfully!')}
        />
      )}

      {isEditPage && editingProduct && (
        <EditProduct
          product={editingProduct}
          onClose={handleClose}
          onSuccess={() => handleSuccess('Product updated successfully!')}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
