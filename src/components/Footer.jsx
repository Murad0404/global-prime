import React from 'react';
import { Globe, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-container mb-2">
              <img src="/logo.png" alt="Global Prime Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <p className="footer-desc">
              O'zbekiston bo'ylab sanoat uskunalari va qadoqlash texnologiyalarini yetkazib berish bo'yicha ishonchli hamkoringiz.
            </p>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-heading">Tezkor havolalar</h4>
            <ul>
              <li><a href="#catalog">Katalog</a></li>
              <li><a href="#about">Biz haqimizda</a></li>
              <li><a href="#contact">Aloqa</a></li>
            </ul>
          </div>
          
          <div className="footer-contact" id="contact">
            <h4 className="footer-heading">Bog'lanish</h4>
            <ul>
              <li>
                <Phone size={18} />
                <a href="tel:+998770000948">+998 77 000 09 48</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:info@globalprime.uz">info@globalprime.uz</a>
              </li>
              <li>
                <MapPin size={18} />
                <span>Улица Асака, 39 NGKA бизнес центр Напротив Darkhan Avenue</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <a href="https://www.instagram.com/globalprime.uz/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                <a href="https://t.me/GlobalPrimeUzbekistan" target="_blank" rel="noopener noreferrer">Telegram</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Global Prime Uzbekistan. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
