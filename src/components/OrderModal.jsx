import React, { useState } from 'react';
import { X } from 'lucide-react';
import './OrderModal.css';

const OrderModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = [product?.image1, product?.image2, product?.image3].filter(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log('Order submitted:', { product, ...formData });
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
            <h3>So'rovingiz qabul qilindi!</h3>
            <p>Tez orada siz bilan bog'lanamiz.</p>
          </div>
        ) : (
          <>
            <h2 className="modal-title">Buyurtma berish</h2>
            <div className="modal-product-info">
              <h4>{product.name}</h4>
              <p className="modal-price">${product.price}</p>
              
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
                      style={{ width: '100%', height: '300px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#f3f4f6' }} 
                    />
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      Kattalashtirish
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
                          style={{ 
                            width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                            border: currentImageIndex === idx ? '2px solid var(--primary-color)' : '2px solid transparent',
                            opacity: currentImageIndex === idx ? 1 : 0.6
                          }} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="order-form" style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label htmlFor="name">Ism-sharifingiz</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Ali Valiyev"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Telefon raqamingiz</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Qo'shimcha xabar (ixtiyoriy)</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="3" 
                  placeholder="Buyurtma haqida qo'shimcha ma'lumot qoldirishingiz mumkin..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 submit-btn">
                So'rov yuborish
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
