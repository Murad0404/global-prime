import React, { useState } from 'react';
import ProductCard from './ProductCard';
import './ProductCatalog.css';

const ProductCatalog = ({ products = [], onOrderProduct }) => {
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = ['Barchasi', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'Barchasi' || p.category === activeCategory;

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
          <h2 className="section-title">Bizning Mahsulotlar</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            Eng sifatli va ishonchli uskunalar bilan tanishing
          </p>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Mahsulot yoki kategoriya nomi orqali qidirish..."
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
            >
              {category}
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
                onOrder={onOrderProduct}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <p>Bu toifada mahsulot topilmadi.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
