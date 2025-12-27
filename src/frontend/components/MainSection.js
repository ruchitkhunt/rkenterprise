import React from 'react';

const MAIN_CONTENT = {
  title: "Expert Adhesive Solutions and High-Quality Submersible Motor Products",
  description: "Discover our wide range of high-quality tapes and electrical insulation tapes. Trusted by industries for superior performance and reliability.",
  features: [
    { icon: "lni lni-checkmark-circle", text: "Premium Quality" },
    { icon: "lni lni-checkmark-circle", text: "Custom Specifications" },
    { icon: "lni lni-checkmark-circle", text: "Bulk Orders Available" }
  ],
  badges: [
    { icon: "lni lni-grid-alt", text: "Wide Range" },
    { icon: "lni lni-certificate", text: "Certified Quality" },
    { icon: "lni lni-delivery", text: "Fast Delivery" }
  ],
  backgroundImage: "/assets/img/hero/hero-5/hero-bg.svg",
  heroImage: "/assets/img/logo/rk.jfif"
};

const Hero = () => {
  return (
    <section 
      className="hero-section hero-style-5 product-header-section"
      style={{ backgroundImage: `url('${MAIN_CONTENT.backgroundImage}')` }}
    >
      <div className="product-header-overlay"></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content-wrapper product-header-content">
              <h1 className="wow fadeInUp" data-wow-delay=".2s">
                {MAIN_CONTENT.title} 
              </h1>
              <p className="wow fadeInUp" data-wow-delay=".4s">
                {MAIN_CONTENT.description}
              </p>
              <div className="hero-features header-features wow fadeInUp" data-wow-delay=".6s">
                {MAIN_CONTENT.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <i className={feature.icon}></i>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
