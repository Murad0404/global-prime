import React, { useState } from 'react';
import { Globe, Phone, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './Header.css';

const Header = ({ settings }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const phone = settings?.phone || '+998 77 000 09 48';
  const phoneLink = `tel:${phone.replace(/\s+/g, '')}`;

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Global Prime Logo" className="header-logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {isHome && (
          <nav className="desktop-nav">
            <a href="#catalog" className="nav-link">{t('nav_catalog')}</a>
            <a href="#about" className="nav-link">{t('nav_about')}</a>
            <a href="#contact" className="nav-link">{t('nav_contact')}</a>
          </nav>
        )}

        <div className="contact-info desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            <option value="uz">O'Z</option>
            <option value="ru">РУ</option>
            <option value="en">EN</option>
          </select>
          <a href={phoneLink} className="contact-link">
            <Phone size={18} />
            <span>{phone}</span>
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
              <a href="#catalog" className="mobile-nav-link" onClick={toggleMenu}>{t('nav_catalog')}</a>
              <a href="#about" className="mobile-nav-link" onClick={toggleMenu}>{t('nav_about')}</a>
              <a href="#contact" className="mobile-nav-link" onClick={toggleMenu}>{t('nav_contact')}</a>
            </nav>
          )}
          <div className="mobile-contact" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <select 
              value={language} 
              onChange={(e) => {
                changeLanguage(e.target.value);
                toggleMenu();
              }}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', maxWidth: '200px', cursor: 'pointer', textAlign: 'center' }}
            >
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <a href={phoneLink} className="mobile-contact-link">
              <Phone size={18} />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
