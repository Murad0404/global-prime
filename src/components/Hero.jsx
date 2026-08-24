import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = ({ slides = [] }) => {
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
            Sanoat uskunalari va <span className="highlight">qadoqlash texnologiyalari</span>
          </h1>
          <p className="hero-description animate-fade-in" style={{ animationDelay: '100ms' }}>
            Global Prime Uzbekistan - O'zbekistondagi ishonchli hamkoringiz. Biz yuqori sifatli suyuqlik quyish, etiketkalash va markirovka uskunalarini taklif etamiz.
          </p>
          <div className="hero-actions animate-fade-in" style={{ animationDelay: '200ms' }}>
            <a href="#catalog" className="btn btn-primary">Katalogni ko'rish</a>
            <a href="#contact" className="btn btn-outline">Biz bilan bog'lanish</a>
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
