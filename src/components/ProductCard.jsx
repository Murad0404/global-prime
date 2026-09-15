import React from 'react';
import { Package, Settings, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './ProductCard.css';

const ProductCard = ({ product, onOrder }) => {
  const { language, t } = useLanguage();
  const oldP = parseFloat(product.oldPrice);
  const newP = parseFloat(product.price);
  const hasDiscount = !isNaN(oldP) && !isNaN(newP) && oldP > newP;

  // Calculate discount percentage
  const discountPercent = hasDiscount
    ? Math.round(((oldP - newP) / oldP) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <div className="product-badges">
          {hasDiscount && (
            <div className="badge discount-badge">-{discountPercent}% {t('discount')}</div>
          )}
          <div className={`badge stock-badge ${product.stockStatus === 'on_order' ? 'on-order' : 'in-stock'}`}>
            {product.stockStatus === 'on_order' ? t('status_on_order') : t('status_in_stock')}
          </div>
        </div>

        {product.image1 ? (
          <img src={product.image1} alt={product.name} className="product-real-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="product-image-placeholder">
            <Package size={48} className="placeholder-icon" />
            <span className="placeholder-text">{product.category}</span>
          </div>
        )}
        <div className="product-price-container">
          {hasDiscount && <span className="old-price">${product.oldPrice}</span>}
          <span className="current-price">${product.price}</span>
        </div>
      </div>

      <div className="product-content">
        <h3 className="product-title">
          {language === 'ru' ? (product.russianName || product.name) : (language === 'en' && product.englishName ? product.englishName : product.name)}
        </h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-features">
          {product.features && product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="feature-item">
              <Settings size={14} className="feature-icon" />
              <span>{feature}</span>
            </div>
          ))}
          {product.features && product.features.length > 3 && (
            <div className="feature-item more-features">
              <span>{t('more_features')} {product.features.length - 3} {t('features_count')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="product-footer">
        <button className="btn btn-primary w-100" onClick={() => onOrder(product)}>
          {t('btn_order_now')} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
