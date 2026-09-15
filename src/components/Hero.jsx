import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import './Hero.css';

const Hero = ({ slides = [] }) => {
  const { t } = useLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return; // No interval needed if 0 or 1 slide

    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            {t('hero_title')}<span className="highlight">{t('hero_title_highlight')}</span>
          </h1>
          <p className="hero-description animate-fade-in" style={{ animationDelay: '100ms' }}>
            {t('hero_desc')}
          </p>
          <div className="hero-actions animate-fade-in" style={{ animationDelay: '200ms' }}>
            <a href="#catalog" className="btn btn-primary">{t('btn_view_catalog')}</a>
            <a href="#contact" className="btn btn-outline">{t('btn_contact_us')}</a>
          </div>
        </div>
        
        <div className="hero-image-wrapper animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="hero-shape"></div>
          
          <div className="hero-slider-container">
            {slides.length > 0 ? (
              slides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={`hero-slide ${index === currentSlideIndex ? 'active' : ''}`}
                >
                  <img src={slide.image} alt={slide.title || 'Slide image'} className="slide-image" />
                </div>
              ))
            ) : (
              <div className="hero-placeholder-image">
                <div className="placeholder-content">
                  <h3>Global Prime</h3>
                  <p>Industrial Equipment</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
