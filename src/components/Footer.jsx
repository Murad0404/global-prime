import React from 'react';
import { Globe, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './Footer.css';

const Footer = ({ settings }) => {
  const { t } = useLanguage();
  const phone = settings?.phone || '+998 77 000 09 48';
  const phoneLink = `tel:${phone.replace(/\s+/g, '')}`;
  const email = settings?.email || 'info@globalprime.uz';
  const emailLink = `mailto:${email}`;
  const address = settings?.address || 'Улица Асака, 39 NGKA бизнес центр Напротив Darkhan Avenue';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-container mb-2">
              <img src="/logo.png" alt="Global Prime Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <p className="footer-desc">
              {t('footer_desc')}
            </p>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-heading">{t('footer_quick_links')}</h4>
            <ul>
              <li><a href="#catalog">{t('nav_catalog')}</a></li>
              <li><a href="#about">{t('nav_about')}</a></li>
              <li><a href="#contact">{t('nav_contact')}</a></li>
            </ul>
          </div>
          
          <div className="footer-contact" id="contact">
            <h4 className="footer-heading">{t('nav_contact')}</h4>
            <ul>
              <li>
                <Phone size={18} />
                <a href={phoneLink}>{phone}</a>
              </li>
              <li>
                <Mail size={18} />
                <a href={emailLink}>{email}</a>
              </li>
              <li>
                <MapPin size={18} />
                <span>{address}</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <a href="https://www.instagram.com/globalprime.uz/" target="_blank" rel="noopener noreferrer">{t('footer_instagram')}</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                <a href="https://t.me/GlobalPrimeUzbekistan" target="_blank" rel="noopener noreferrer">{t('footer_telegram')}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Global Prime Uzbekistan. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
