import React, { useState } from 'react';
import { Package, Settings as SettingsIcon, Droplet, Zap, Box, Truck, PenTool, Layers, Cpu, Wrench } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import ProductCard from './ProductCard';
import './ProductCatalog.css';

const ICONS = {
  Package: <Package size={18} />,
  Settings: <SettingsIcon size={18} />,
  Droplet: <Droplet size={18} />,
  Zap: <Zap size={18} />,
  Box: <Box size={18} />,
  Truck: <Truck size={18} />,
  Tool: <PenTool size={18} />,
  Layers: <Layers size={18} />,
  Cpu: <Cpu size={18} />,
  Wrench: <Wrench size={18} />
};

const ProductCatalog = ({ products = [], onOrderProduct, settings }) => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categoryNames = [...new Set(products.map(p => p.category))];
  const settingsCategories = settings?.categories || [];
  
  const getCategoryIcon = (catName) => {
    if (catName === 'ALL') return <Layers size={18} />;
    const found = settingsCategories.find(c => c.name === catName);
    return found && ICONS[found.icon] ? ICONS[found.icon] : <Package size={18} />;
  };

  const getCategoryName = (catName) => {
    if (catName === 'ALL') return t('catalog_all');
    const found = settingsCategories.find(c => c.name === catName);
    if (found) {
      if (language === 'ru' && found.nameRu) return found.nameRu;
      if (language === 'en' && found.nameEn) return found.nameEn;
      if (language === 'uz' && found.nameUz) return found.nameUz;
      return found.nameUz || found.name;
    }
    return catName;
  };

  const categories = ['ALL', ...categoryNames];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'ALL' || p.category === activeCategory;

    // Smart search logic like YouTube
    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const searchableText = `
      ${p.name || ''} 
      ${p.russianName || ''} 
      ${p.category || ''} 
      ${p.description || ''} 
      ${(p.features || []).join(' ')}
    `.toLowerCase();

    const matchSearch = searchTerms.length === 0 || searchTerms.every(term => searchableText.includes(term));

    return matchCategory && matchSearch;
  });

  return (
    <section id="catalog" className="catalog">
      <div className="container">
        <div className="catalog-header text-center">
          <h2 className="section-title">{t('catalog_title')}</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            {t('catalog_subtitle')}
          </p>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder={t('catalog_search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {getCategoryIcon(category)}
              {getCategoryName(category)}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index % 4) * 100}ms` }}
            >
              <ProductCard
                product={product}
                categoryName={getCategoryName(product.category)}
                onOrder={onOrderProduct}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <p>{t('catalog_empty')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
