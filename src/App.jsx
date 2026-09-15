import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
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
    const fetchData = async () => {
      try {
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);

        // Fetch hero slides
        const slidesSnapshot = await getDocs(collection(db, "heroSlides"));
        const slidesData = slidesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHeroSlides(slidesData);
      } catch (error) {
        console.error("Firebase'dan ma'lumotlarni yuklashda xatolik:", error);
      }
    };
    fetchData();
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
      const docRef = await addDoc(collection(db, "products"), newProduct);
      setProducts(prev => [...prev, { id: docRef.id, ...newProduct }]);
    } catch (err) {
      alert("Xatolik yuz berdi!");
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const productRef = doc(db, "products", updatedProduct.id);
      const dataToUpdate = { ...updatedProduct };
      delete dataToUpdate.id; // Don't write the ID inside the document fields unnecessarily
      await updateDoc(productRef, dataToUpdate);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Hero Slides Handlers ---
  const handleAddHeroSlide = async (newSlide) => {
    try {
      const docRef = await addDoc(collection(db, "heroSlides"), newSlide);
      setHeroSlides(prev => [...prev, { id: docRef.id, ...newSlide }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHeroSlide = async (id) => {
    try {
      await deleteDoc(doc(db, "heroSlides", id));
      setHeroSlides(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHeroSlide = async (updatedSlide) => {
    try {
      const slideRef = doc(db, "heroSlides", updatedSlide.id);
      const dataToUpdate = { ...updatedSlide };
      delete dataToUpdate.id;
      await updateDoc(slideRef, dataToUpdate);
      setHeroSlides(prev => prev.map(s => s.id === updatedSlide.id ? updatedSlide : s));
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
