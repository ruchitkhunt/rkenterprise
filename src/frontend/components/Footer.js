import React from 'react';

const SOCIAL_LINKS = [
  // { id: 1, icon: 'lni lni-facebook-filled', label: 'Facebook', url: 'https://facebook.com' },
  // { id: 2, icon: 'lni lni-twitter-filled', label: 'Twitter', url: 'https://twitter.com' },
  // { id: 3, icon: 'lni lni-instagram-filled', label: 'Instagram', url: 'https://instagram.com' },
  // { id: 4, icon: 'lni lni-linkedin-original', label: 'LinkedIn', url: 'https://linkedin.com' },
];

const QUICK_LINKS = [
  { name: 'Home', link: '#home' },
  { name: 'About', link: '#about' },
  { name: 'Products', link: '#products' },
  { name: 'Contact', link: '#contact' }
];

const PRODUCT_CATEGORIES = [
  'Electrical Insulation Tapes',
  'Submersible Pump Products',  
];

const CONTACT_INFO = [
  { icon: 'lni lni-phone', text: '+91 9724803488' },
  { icon: 'lni lni-phone', text: '+91 9825400703' },
  { icon: 'lni lni-envelope', text: 'rkenterprise.p@gmail.com' },
  { icon: 'lni lni-map-marker', text: 'Warehouse: Somnath Industrial Area, Somnath Main Road, Opp. Balaji Pan, Kothariya, Rajkot-360022' }
];

const Footer = () => (
  <footer className="footer footer-style-4">
    <div className="container">
      <div className="widget-wrapper">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="footer-widget wow fadeInUp" data-wow-delay=".2s">
              <div className="logo">
                <a href="#home" aria-label="Home" > 
                  <img 
                    src="/assets/img/logo/logo.png" 
                    alt="RK ENTERPRISE" 
                    className='footer-logo'
                  /> 
                </a>
              </div>
              <p className="desc" style={{ textAlign: 'justify' }}>
                RK ENTERPRISE a Leading Manufacturer in the Submersible Pump Industry Since 2014. We are committed to delivering top-notch quality products and innovative solutions.
              </p>
              <ul className="socials">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.id}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <i className={social.icon}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
            <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget wow fadeInUp" data-wow-delay=".3s">
                <h6>Quick Link</h6>
                <ul className="links">
                  {QUICK_LINKS.map((item, index) => (
                    <li key={index}>
                      <a href={item.link}>{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget wow fadeInUp" data-wow-delay=".4s">
                <h6>Product Categories</h6>
                <ul className="links">
                  {PRODUCT_CATEGORIES.map((category, index) => (
                    <li key={index}>
                      <a href="#products">{category}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div className="footer-widget wow fadeInUp" data-wow-delay=".5s">
                <h6>Contact Info</h6>
                <ul className="links">
                  {CONTACT_INFO.map((info, index) => (
                    <li key={index}>
                      <i className={info.icon}></i>     {info.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-wrapper wow fadeInUp" data-wow-delay=".2s">
          <p>
            &copy; {new Date().getFullYear()} RK ENTERPRISE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
);

export default Footer;
