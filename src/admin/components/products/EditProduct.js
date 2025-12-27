import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

const EditProduct = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    summary: '',
    description: '',
    specifications: [],
    status: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        image: product.image || '',
        summary: product.summary || '',
        description: product.description || '',
        specifications: product.specifications || [],
        status: product.status
      });
      // Set preview to existing image
      if (product.image) {
        setImagePreview(`http://localhost:5000/${product.image}`);
      }
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Clear image error when file is selected
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    
    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setUploading(true);
      
      // Create FormData with all product data
      const formDataUpload = new FormData();
      
      // Add image if new one selected
      if (imageFile) {
        formDataUpload.append('image', imageFile);
      }
      
      // Add existing image path if no new image
      if (!imageFile && formData.image) {
        formDataUpload.append('existingImage', formData.image);
      }
      
      formDataUpload.append('name', formData.name);
      formDataUpload.append('summary', formData.summary);
      formDataUpload.append('description', formData.description);
      formDataUpload.append('specifications', JSON.stringify(formData.specifications));
      formDataUpload.append('status', formData.status);
      
      // Single API call with multipart form data
      await adminApi.uploadPut(`/admin/products/${product.id}`, formDataUpload);
      
      // Success - navigate back with success message
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Edit Product</h4>
        <button className="btn btn-secondary" onClick={onClose}>
          <i className="lni lni-arrow-left"></i> Back to Products
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Product Image *</label>
                <input
                  type="file"
                  className="form-control"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2 position-relative">
                    <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{maxWidth: '200px'}} />
                  </div>
                )}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Summary *</label>
                <textarea
                  className={`form-control ${errors.summary ? 'is-invalid' : ''}`}
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows="3"
                />
                {errors.summary && <div className="invalid-feedback">{errors.summary}</div>}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Specifications</label>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="spec-row">
                    <input
                      type="text"
                      placeholder="Label"
                      value={spec.label}
                      onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeSpecification(index)}
                    >
                      <i className="lni lni-close"></i>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add"
                  onClick={addSpecification}
                >
                  <i className="lni lni-plus"></i> Add Specification
                </button>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Status *</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: parseInt(e.target.value) }))}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
