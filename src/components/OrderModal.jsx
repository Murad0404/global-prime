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
              
              {(product.image1 || product.image2) && (
                <div className="modal-images" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  {product.image1 && (
                    <img src={product.image1} alt={product.name} style={{ flex: 1, width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                  {product.image2 && (
                    <img src={product.image2} alt={`${product.name} 2`} style={{ flex: 1, width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
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
    </div>
  );
};

export default OrderModal;
