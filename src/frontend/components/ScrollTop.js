import React, { useState, useEffect } from 'react';

const SCROLL_THRESHOLD = 300;
const SCROLL_DURATION = 600; // milliseconds

const ScrollTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // initialize
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // animate scroll to top with custom duration
  const scrollToTop = (e) => {
    e && e.preventDefault();
    const start = window.pageYOffset;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      window.scrollTo(0, Math.round(start * (1 - ease)));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      className="scroll-top visible"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="lni lni-chevron-up" aria-hidden="true"></i>
    </button>
  );
};

export default ScrollTop;
