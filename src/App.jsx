import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import OrderModal from './components/OrderModal';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import { products as initialProducts } from './data/products';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);

  useEffect(() => {
    // Fetch products
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Products API error:", data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Products yuklashda xatolik:", err);
        setProducts([]);
      });

    // Fetch hero slides
    fetch(`/api/heroSlides`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHeroSlides(data);
        } else {
          console.error("Slides API error:", data);
          setHeroSlides([]);
        }
      })
      .catch(err => {
        console.error("Slides yuklashda xatolik:", err);
        setHeroSlides([]);
      });
  }, []);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // --- Product Handlers ---
  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch(`/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      setProducts(prev => [...prev, data]);
    } catch (err) {
      alert("Xatolik! Backend ishlayotganiga ishonch hosil qiling.");
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      const data = await res.json();
      setProducts(prev => prev.map(p => String(p.id) === String(data.id) ? data : p));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Hero Slides Handlers ---
  const handleAddHeroSlide = async (newSlide) => {
    try {
      const res = await fetch(`/api/heroSlides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlide)
      });
      const data = await res.json();
      setHeroSlides([...heroSlides, data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHeroSlide = async (id) => {
    try {
      await fetch(`/api/heroSlides/${id}`, { method: 'DELETE' });
      setHeroSlides(heroSlides.filter(s => String(s.id) !== String(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHeroSlide = async (updatedSlide) => {
    try {
      const res = await fetch(`/api/heroSlides/${updatedSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlide)
      });
      const data = await res.json();
      setHeroSlides(heroSlides.map(s => String(s.id) === String(data.id) ? data : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero slides={heroSlides} />
                <ProductCatalog products={products} onOrderProduct={handleOrderClick} />
              </>
            } />
            <Route path="/admin" element={
              <AdminRoute
                products={products}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProduct={handleUpdateProduct}
                heroSlides={heroSlides}
                onAddHeroSlide={handleAddHeroSlide}
                onDeleteHeroSlide={handleDeleteHeroSlide}
                onUpdateHeroSlide={handleUpdateHeroSlide}
              />
            } />
          </Routes>
        </main>
        <Footer />

        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
