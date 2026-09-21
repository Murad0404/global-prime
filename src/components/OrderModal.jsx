import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './OrderModal.css';

const OrderModal = ({ product, onClose, settings }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [countryCode, setCountryCode] = useState('+998');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = [product?.image1, product?.image2, product?.image3].filter(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || formData.phone.trim().length < 7) {
      alert(t('form_phone_error') || "Iltimos, yaroqli telefon raqamini kiriting");
      return;
    }

    setIsSending(true);

    const token = settings?.telegramBotToken || '8876444321:AAH7etXOVPSqoq4jXleTy9LiZA-Ebi3klOk';
    const chatId = settings?.telegramChatId;

    if (token && chatId) {
      const productLink = `https://${window.location.host}/?productId=${product.id}`;
      
      const text = `
🛒 <b>Yangi buyurtma!</b>

📦 <b>Mahsulot:</b> ${product.name}
💰 <b>Narxi:</b> $${product.price}
🔗 <b>Mahsulot havolasi:</b> <a href="${productLink}">Saytda ko'rish</a>
👤 <b>Mijoz:</b> ${formData.name}
📞 <b>Telefon:</b> ${countryCode} ${formData.phone}
📝 <b>Xabar:</b> ${formData.message || "Yo'q"}
      `;
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.error('Telegram error:', err);
      }
    } else {
      console.log('Order submitted locally (Telegram not configured):', { product, ...formData });
    }

    setIsSending(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 3000);
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>{t('form_success_title')}</h3>
            <p>{t('form_success_desc')}</p>
          </div>
        ) : (
          <>
            <h2 className="modal-title">{t('modal_title')}</h2>
            <div className="modal-product-info">
              <h4>
                {language === 'ru' ? (product.russianName || product.name) : (language === 'en' && product.englishName ? product.englishName : product.name)}
              </h4>
              <p className="modal-price">{t('modal_price')} ${product.price}</p>
              
              {(product.image1 || product.image2 || product.image3) && (
                <div className="modal-images-slider">
                  <div 
                    className="main-image-container" 
                    style={{ cursor: 'pointer', position: 'relative', marginBottom: '10px' }}
                    onClick={() => setLightboxImage(images[currentImageIndex])}
                  >
                    <img 
                      src={images[currentImageIndex]} 
                      alt={product.name} 
                      className="modal-main-image"
                    />
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {t('modal_zoom')}
                    </div>
                  </div>
                  
                  {images.length > 1 && (
                    <div className="thumbnails" style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                      {images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`} 
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`modal-thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="order-form" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label htmlFor="name">{t('form_name_label')}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder={t('form_name_placeholder')}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">{t('form_phone_label')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={countryCode} 
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      fontSize: '15px',
                      cursor: 'pointer',
                      outline: 'none',
                      color: '#333'
                    }}
                  >
                    <option value="+998">🇺🇿 +998</option>
                    <option value="+7">🇷🇺/🇰🇿 +7</option>
                    <option value="+996">🇰🇬 +996</option>
                    <option value="+992">🇹🇯 +992</option>
                    <option value="+993">🇹🇲 +993</option>
                  </select>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    minLength="7"
                    placeholder={t('form_phone_placeholder')}
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t('form_msg_label')}</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="3" 
                  placeholder={t('form_msg_placeholder')}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 submit-btn" disabled={isSending}>
                {isSending ? t('form_sending') : t('form_submit')}
              </button>
            </form>
          </>
        )}
      </div>

      {/* --- IMAGE VIEW LIGHTBOX MODAL --- */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100000,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setLightboxImage(null);
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
              style={{
                position: 'absolute', top: '-40px', right: '0', 
                background: 'none', border: 'none', color: 'white', 
                fontSize: '35px', cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <img 
              src={lightboxImage} 
              alt="Kattalashtirilgan rasm" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModal;
