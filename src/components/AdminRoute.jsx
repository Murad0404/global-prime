import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

const AdminRoute = ({ 
  products, 
  onAddProduct, 
  onDeleteProduct, 
  onUpdateProduct,
  heroSlides,
  onAddHeroSlide,
  onDeleteHeroSlide,
  onUpdateHeroSlide,
  settings,
  onUpdateSettings
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user was already authenticated in this session
    const authStatus = sessionStorage.getItem('isAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAdminAuth', 'true');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminPanel 
      products={products} 
      onAddProduct={onAddProduct} 
      onDeleteProduct={onDeleteProduct}
      onUpdateProduct={onUpdateProduct}
      heroSlides={heroSlides}
      onAddHeroSlide={onAddHeroSlide}
      onDeleteHeroSlide={onDeleteHeroSlide}
      onUpdateHeroSlide={onUpdateHeroSlide}
      settings={settings}
      onUpdateSettings={onUpdateSettings}
    />
  );
};

export default AdminRoute;
