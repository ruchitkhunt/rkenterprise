import React, { useState, useEffect, useRef } from 'react';
import { API_URL_BACKEND } from '../../../constant';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const ProductSlider = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL_BACKEND}/api/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProductData(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProductData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) setSlidesPerView(3);
      else if (width >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || productData.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= productData.length - 1) {
          setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(0);
            setTimeout(() => {
              setIsTransitioning(true);
            }, 50);
          }, 500);
          return prev + 1;
        }
        return prev + 1;
      });
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, productData.length]);

  const calculateTransform = () => {
    const slideWidth = 100 / slidesPerView;
    return `translateX(-${currentIndex * slideWidth}%)`;
  };

  const getSlideStyle = () => {
    const slideWidth = 100 / slidesPerView;
    return {
      flex: `0 0 ${slideWidth}%`,
      minWidth: `${slideWidth}%`,
      maxWidth: `${slideWidth}%`,
      padding: '0 15px'
    };
  };

  const getTransitionStyle = () => {
    return isTransitioning ? 'transform 0.6s ease-in-out' : 'none';
  };

  // Show loading state
  if (loading) {
    return (
      <section id="products" className="product-section section-top">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="loading-spinner" style={{ padding: '100px 0' }}>
                <h3>Loading Products...</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="products" className="product-section section-top">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="error-message" style={{ padding: '100px 0', color: '#dc3545' }}>
                <h3>Failed to load products</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (productData.length === 0) {
    return (
      <section id="products" className="product-section section-top">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="empty-state" style={{ padding: '100px 0' }}>
                <h3>No Products Available</h3>
                <p>Check back soon for our latest products!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="products" className="product-section section-top">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center mb-60">
                <div className="row mb-5">
                  <div className="col-12">
                    <div className="text-center mb-5">
                      <h3 className="mb-15 wow fadeInUp" data-wow-delay=".2s">
                        Our Products
                      </h3>
                      <div className="section-title-underline"></div>
                    </div>
                  </div>
                </div>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  We are suppliers of premium quality adhesive tapes and submersible pump products.
                  Our products meet the highest standards and are available in various specifications
                  to meet your specific requirements.
                </p>
              </div>
            </div>
          </div>

          <div
            className="products-slider-wrapper wow fadeInUp"
            data-wow-delay=".4s"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="products-slider" ref={sliderRef}>
              <div
                className="products-track"
                style={{
                  transform: calculateTransform(),
                  transition: getTransitionStyle(),
                  display: 'flex',
                  width: '100%'
                }}
              >
                {[...productData, ...productData.slice(0, slidesPerView)].map((product, index) => (
                  <div key={`${product.id}-${index}`} style={getSlideStyle()}>
                    <ProductCard
                      product={product}
                      onClick={setSelectedProduct}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row mt-50">
            <div className="col-12 text-center">
              <div className="cta-box wow fadeInUp" data-wow-delay=".4s">
                <h4>Need Custom Specifications?</h4>
                <p>Contact us for custom sizes, bulk orders, and special requirements</p>
                <a href="#contact" className="button button-lg radius-30">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductSlider;
