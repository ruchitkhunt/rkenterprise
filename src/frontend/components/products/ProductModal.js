import React, { useEffect } from 'react';
import { API_BASE_URL } from '../../../constant';

const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('product-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal-content">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <i className="lni lni-close"></i>
        </button>

        <div className="modal-header">
          <div className="modal-image">
            <img
              src={`${API_BASE_URL}${product.image}`}
              alt={product.name}
            />
          </div>
          <div className="modal-title-section">
            <span className="modal-category">{product.name}</span>
            <h2>{product.name}</h2>
            <p className="modal-summary">{product.summary}</p>
          </div>
        </div>

        <div className="modal-body">
          {product.description && (
            <div className="modal-section">
              <h5><i className="lni lni-text-format"></i> Description</h5>
              <p>{product.description}</p>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className="modal-section">
              <h5><i className="lni lni-list"></i> Specifications</h5>
              <div className="specifications-grid">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="spec-item">
                    <strong>{spec.label}:</strong>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.applications && product.applications.length > 0 && (
            <div className="modal-section">
              <h5><i className="lni lni-checkmark-circle"></i> Applications</h5>
              <ul className="detail-list">
                {product.applications.map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="modal-section">
              <h5><i className="lni lni-star"></i> Features</h5>
              <ul className="detail-list">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <a href="#contact" className="button button-primary radius-30" onClick={onClose}>
            <i className="lni lni-envelope"></i> Contact Us for Inquiry
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
