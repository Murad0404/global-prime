import React, { useState } from 'react';
import { Globe, Phone, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Global Prime Logo" className="header-logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {isHome && (
          <nav className="desktop-nav">
            <a href="#catalog" className="nav-link">Katalog</a>
            <a href="#about" className="nav-link">Biz haqimizda</a>
            <a href="#contact" className="nav-link">Aloqa</a>
          </nav>
        )}

        <div className="contact-info desktop-only">
          <a href="tel:+998770000948" className="contact-link">
            <Phone size={18} />
            <span>+998 77 000 09 48</span>
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {isHome && (
            <nav className="mobile-nav">
              <a href="#catalog" className="mobile-nav-link" onClick={toggleMenu}>Katalog</a>
              <a href="#about" className="mobile-nav-link" onClick={toggleMenu}>Biz haqimizda</a>
              <a href="#contact" className="mobile-nav-link" onClick={toggleMenu}>Aloqa</a>
            </nav>
          )}
          <div className="mobile-contact">
            <a href="tel:+998770000948" className="mobile-contact-link">
              <Phone size={18} />
              <span>+998 77 000 09 48</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
