import React from 'react';
import { API_BASE_URL } from '../../../constant';

const ProductCard = ({ product, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(product);
  };

  return (
    <div
      className="single-product-card wow fadeInUp"
      data-wow-delay=".2s"
    >
      <div className="product-image" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img
          src={`${API_BASE_URL}${product.image}`}
          alt={product.name}
        />
        <div className="product-overlay">
          <span className="view-details">
            <i className="lni lni-eye"></i> View Details
          </span>
        </div>
      </div>
      <div className="product-content">
        <span className="category-badge">{product.name}</span>
        <h4 className="product-title">{product.name}</h4>
        <p className="product-summary">{product.summary}</p>
        <div className="product-footer">
          <button className="learn-more-btn" onClick={handleClick}>
            More Details <i className="lni lni-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
