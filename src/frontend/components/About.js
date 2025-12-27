import React from 'react';

const About = () => {



  return (
    <section id="about" className="about-section section-top">
      <div className="container">
        {/* About Us Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center mb-5">
              <h3 className="mb-15 wow fadeInUp" data-wow-delay=".2s">
                About Us
              </h3>
              <div className="section-title-underline"></div>
            </div>
          </div>
        </div>

        {/* Company Introduction */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="about-image-wrapper wow fadeInLeft" data-wow-delay=".3s">
              <img 
                src="/assets/img/about/tape-products.jpg" 
                alt="Tape Products" 
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content wow fadeInRight" data-wow-delay=".4s">
              <h3 className="company-title">RK ENTERPRISE</h3>
              <p className="text-muted mb-3">
                <strong>RK ENTERPRISE</strong> A Leading Manufacturer in the Submersible Pump Industry Since 2014.
              </p>
              <p className="text-muted mb-3">
                <strong>RK ENTERPRISE</strong> is the authorized distributors of 3M.
              </p>
              <p className="text-muted">
                We are dealing in various range of Products to all India by giving highly qualitative 
                Products & keeping long-term business relationship with satisfaction to End User of each product.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="row align-items-center vision-section">
          <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
            <div className="vision-image-wrapper wow fadeInRight" data-wow-delay=".3s">
              <img 
                src="/assets/img/about/vision-tape.jpg" 
                alt="Vision" 
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-lg-6 order-lg-1 px-4">
            <div className="vision-content wow fadeInLeft" data-wow-delay=".4s">
              <h3 className="vision-title">Vision</h3>
              <p className="text-muted">
                Our commitment is to elevate customer experiences by delivering top-notch quality products 
                from our diverse portfolio. We are driven by the ambition to develop innovative solutions 
                that anticipate and meet future demands, exceeding the expectations of our valued customers. 
                Our ultimate goal is to be the first choice for our customers.
              </p>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default About;
