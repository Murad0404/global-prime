import React from 'react';
import { Globe, Phone, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Global Prime Logo" className="header-logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
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

        <button className="mobile-menu-btn">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
