import React, { useEffect, useState } from "react";

const sections = ["home", "about", "products", "contact"];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  /* ============================
     CLICK HANDLER
  ============================ */
  const handleClick = (id) => {
    setActive(id);
    setOpen(false);
  };

  /* ============================
     SCROLL SPY
  ============================ */
  useEffect(() => {
    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop - 120;
          if (window.scrollY >= top) {
            current = id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="header header-6">
      <div className="header-inner">

        {/* LOGO */}
        <a
          className="navbar-brand"
          href="#home"
          onClick={() => handleClick("home")}
        >
          <img src="/assets/img/logo/logo.png" alt="RK Enterprise" />
        </a>

        {/* HAMBURGER */}
        <button
          className={`menu-toggle ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAV */}
        <nav className={`main-nav ${open ? "open" : ""}`}>
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${active === id ? "active" : ""}`}
              onClick={() => handleClick(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default Header;
