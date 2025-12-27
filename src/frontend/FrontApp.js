import React, { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import MainSection from './components/MainSection';
import About from './components/About';
import Product from './components/Product';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';

const FrontApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = () => {
      // Hide preloader after 1 second
      const preloaderTimer = setTimeout(() => setLoading(false), 1000);

      // Initialize WOW.js for scroll animations
      if (window.WOW) {
        const wow = new window.WOW({
          boxClass: 'wow',
          animateClass: 'animated',
          offset: 0,
          mobile: true,
          live: true,
          resetAnimation: true
        });
        wow.init();
        
        // Reinitialize after a short delay to catch dynamically loaded content
        setTimeout(() => {
          if (wow.sync) {
            wow.sync();
          }
        }, 500);
      }

      return () => {
        clearTimeout(preloaderTimer);
      };
    };

    return initializeApp();
  }, []);

  return (
    <>
      {loading && <Preloader />}
      
      <section id="home" className="hero-section-wrapper-5">
        <Header />
        <MainSection />
      </section>

      <About />
      <Product />
      <Contact />
      <Footer />
      <ScrollTop />
    </>
  );
};

export default FrontApp;
