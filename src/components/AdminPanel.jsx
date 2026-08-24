import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ 
  products, onAddProduct, onDeleteProduct, onUpdateProduct,
  heroSlides, onAddHeroSlide, onDeleteHeroSlide, onUpdateHeroSlide
}) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'hero'
  const [message, setMessage] = useState('');

  // --- PRODUCT STATE ---
  const existingCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const [customCategories, setCustomCategories] = useState([]);
  const allCategories = [...new Set([...existingCategories, ...customCategories])];
  const [newCategory, setNewCategory] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [productFormData, setProductFormData] = useState({
    name: '', russianName: '', price: '', oldPrice: '', category: '', 
    description: '', features: '', image1: '', image2: '',
    stockStatus: 'in_stock' // 'in_stock' or 'on_order'
  });

  // --- HERO SLIDE STATE ---
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [slideFormData, setSlideFormData] = useState({
    image: ''
  });

  // --- UTILS ---
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const compressImage = (file, targetForm, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = targetForm === 'hero' ? 1350 : 800; // Hero vs Product
        const MAX_HEIGHT = targetForm === 'hero' ? 1080 : 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality
      };
    };
  };

  const handleImageUpload = (e, targetForm, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Fayl hajmi 5MB dan kichik bo\'lishi kerak!', 'error');
        e.target.value = '';
        return;
      }
      compressImage(file, targetForm, (compressedBase64) => {
        if (targetForm === 'product') {
          setProductFormData(prev => ({ ...prev, [fieldName]: compressedBase64 }));
        } else if (targetForm === 'hero') {
          setSlideFormData(prev => ({ ...prev, [fieldName]: compressedBase64 }));
        }
      });
    }
  };

  const handleMultipleProductImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 2); // maximum 2 files
    if (files.length === 0) return;

    setProductFormData(prev => ({ ...prev, image1: '', image2: '' }));

    files.forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Fayl hajmi 5MB dan kichik bo\'lishi kerak!', 'error');
        return;
      }
      compressImage(file, 'product', (compressedBase64) => {
        const fieldName = index === 0 ? 'image1' : 'image2';
        setProductFormData(prev => ({ ...prev, [fieldName]: compressedBase64 }));
      });
    });
  };

  // --- PRODUCT HANDLERS ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !allCategories.includes(newCategory.trim())) {
      setCustomCategories([...customCategories, newCategory.trim()]);
      if (!productFormData.category) {
        setProductFormData({ ...productFormData, category: newCategory.trim() });
      }
      setNewCategory('');
      showMessage('Kategoriya muvaffaqiyatli qo\'shildi!');
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({ ...productFormData, [name]: value });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.price || !productFormData.category) {
      showMessage('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'error');
      return;
    }

    const data = {
      name: productFormData.name,
      russianName: productFormData.russianName,
      price: Number(productFormData.price),
      oldPrice: productFormData.oldPrice ? Number(productFormData.oldPrice) : null,
      stockStatus: productFormData.stockStatus,
      category: productFormData.category,
      description: productFormData.description,
      features: productFormData.features.split('\n').filter(f => f.trim() !== ''),
      image1: productFormData.image1,
      image2: productFormData.image2
    };

    if (editingProductId) {
      onUpdateProduct({ ...data, id: editingProductId });
      showMessage('Mahsulot muvaffaqiyatli yangilandi!');
    } else {
      onAddProduct(data);
      showMessage('Mahsulot muvaffaqiyatli qo\'shildi!');
    }
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '', russianName: '', price: '', oldPrice: '', category: '', 
      description: '', features: '', image1: '', image2: '',
      stockStatus: 'in_stock'
    });
    const fileInputs = document.querySelectorAll('#product-form input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductFormData({
      name: product.name,
      russianName: product.russianName || '',
      price: product.price,
      oldPrice: product.oldPrice || '',
      stockStatus: product.stockStatus || 'in_stock',
      category: product.category,
      description: product.description || '',
      features: (product.features || []).join('\n'),
      image1: product.image1 || '',
      image2: product.image2 || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- HERO SLIDE HANDLERS ---
  const handleSlideChange = (e) => {
    const { name, value } = e.target;
    setSlideFormData({ ...slideFormData, [name]: value });
  };

  const handleSlideSubmit = (e) => {
    e.preventDefault();
    if (!slideFormData.image) {
      showMessage('Iltimos reklama rasmini yuklang.', 'error');
      return;
    }

    const data = {
      image: slideFormData.image
    };

    if (editingSlideId) {
      onUpdateHeroSlide({ ...data, id: editingSlideId });
      showMessage('Reklama slaydi yangilandi!');
    } else {
      onAddHeroSlide(data);
      showMessage('Reklama slaydi qo\'shildi!');
    }
    resetSlideForm();
  };

  const resetSlideForm = () => {
    setEditingSlideId(null);
    setSlideFormData({ image: '' });
    const fileInputs = document.querySelectorAll('#hero-form input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleEditSlide = (slide) => {
    setEditingSlideId(slide.id);
    setSlideFormData({
      image: slide.image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-panel container">
      <div className="admin-header text-center">
        <h2 className="section-title">Admin Panel</h2>
        <div className="title-underline"></div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Mahsulotlar
        </button>
        <button 
          className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          Reklamalar
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* --- PRODUCTS TAB --- */}
      {activeTab === 'products' && (
        <>
          <div className="admin-grid">
            <div className="admin-card">
              <h3>Yangi Kategoriya Qo'shish</h3>
              <form onSubmit={handleAddCategory} className="admin-form">
                <div className="form-group">
                  <label>Kategoriya nomi</label>
                  <div className="input-group">
                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Masalan: Maxsus uskunalar" />
                    <button type="submit" className="btn-primary">Qo'shish</button>
                  </div>
                </div>
              </form>
              <div className="categories-list">
                <h4>Mavjud Kategoriyalar:</h4>
                <div className="tags">
                  {allCategories.map((cat, idx) => (
                    <span key={idx} className="tag">{cat}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-card" id="product-form">
              <h3>{editingProductId ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}</h3>
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group half">
                    <label>Mahsulot Nomi (O'zbekcha) *</label>
                    <input type="text" name="name" value={productFormData.name} onChange={handleProductChange} required />
                  </div>
                  <div className="form-group half">
                    <label>Mahsulot Nomi (Ruscha)</label>
                    <input type="text" name="russianName" value={productFormData.russianName} onChange={handleProductChange} />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Sotuv narxi ($) *</label>
                    <input type="number" name="price" value={productFormData.price} onChange={handleProductChange} required min="0" />
                  </div>
                  <div className="form-group half">
                    <label>Eski narxi / Chegirmasiz narxi ($)</label>
                    <input type="number" name="oldPrice" value={productFormData.oldPrice} onChange={handleProductChange} min="0" placeholder="Chegirma bo'lsa kiriting" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label>Kategoriya *</label>
                    <select name="category" value={productFormData.category} onChange={handleProductChange} required>
                      <option value="">Tanlang...</option>
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group half">
                    <label>Holati (Mavjudlik)</label>
                    <select name="stockStatus" value={productFormData.stockStatus} onChange={handleProductChange}>
                      <option value="in_stock">Omborda mavjud</option>
                      <option value="on_order">Buyurtma asosida</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Rasmlar (maksimal 2 ta rasm yuklash mumkin)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleMultipleProductImageUpload} 
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {productFormData.image1 && <div className="img-preview"><img src={productFormData.image1} alt="Preview 1" /></div>}
                    {productFormData.image2 && <div className="img-preview"><img src={productFormData.image2} alt="Preview 2" /></div>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Ta'rifi</label>
                  <textarea name="description" value={productFormData.description} onChange={handleProductChange} rows="3"></textarea>
                </div>

                <div className="form-group">
                  <label>Xususiyatlari (har birini yangi qatorda yozing)</label>
                  <textarea name="features" value={productFormData.features} onChange={handleProductChange} rows="4" placeholder="Model: HZK-160&#10;Kuchlanish: 220V"></textarea>
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    {editingProductId ? 'O\'zgarishlarni Saqlash' : 'Mahsulotni Saqlash'}
                  </button>
                  {editingProductId && (
                    <button type="button" className="btn-secondary" onClick={resetProductForm} style={{ flex: 1 }}>
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          <div className="admin-card product-list-card mt-4" style={{ marginTop: '30px' }}>
            <div className="table-header-flex">
              <h3>Barcha Mahsulotlar ({products.length} ta)</h3>
              <div className="per-page-selector">
                <label>Sahifada ko'rsatish: </label>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Nomi</th>
                    <th>Narxi</th>
                    <th>Kategoriya</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          {product.image1 ? (
                            <img src={product.image1} alt={product.name} className="table-img" />
                          ) : (
                            <div className="table-img-placeholder">Rasmsiz</div>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEditProduct(product)}>Tahrirlash</button>
                            <button className="btn-delete" onClick={() => {
                                if(window.confirm('Rostdan ham ushbu mahsulotni o\'chirmoqchimisiz?')) onDeleteProduct(product.id);
                              }}>O'chirish</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center py-4">Mahsulotlar topilmadi.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo; Oldingi</button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button key={number} className={`page-btn ${currentPage === number ? 'active' : ''}`} onClick={() => paginate(number)}>{number}</button>
                  ))}
                </div>
                <button className="page-btn" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Keyingi &raquo;</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- HERO SLIDER TAB --- */}
      {activeTab === 'hero' && (
        <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="admin-card" id="hero-form">
            <h3>{editingSlideId ? 'Reklamani Tahrirlash' : 'Yangi Reklama Qo\'shish'}</h3>
            <p style={{marginBottom: '15px', color: '#6b7280', fontSize: '0.9rem'}}>Asosiy sahifadagi 4 burchakli slayderga rasm va matn yuklash.</p>
            <form onSubmit={handleSlideSubmit} className="admin-form">
              <div className="form-group">
                <label>Reklama rasmi (1350x1080 tavsiya etiladi) *</label>
                <div className="file-upload-wrapper">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'hero', 'image')}
                    className="file-input"
                  />
                  {slideFormData.image && (
                    <div className="image-preview">
                      <img src={slideFormData.image} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '15px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  {editingSlideId ? 'O\'zgarishlarni Saqlash' : 'Reklamani Qo\'shish'}
                </button>
                {editingSlideId && (
                  <button type="button" className="btn-secondary" onClick={resetSlideForm} style={{ width: '100%', marginTop: '10px' }}>
                    Bekor qilish
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-card product-list-card mt-4" style={{ marginTop: '30px' }}>
            <h3>Barcha Reklama Slaydlari ({heroSlides.length} ta)</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {heroSlides.length > 0 ? (
                    heroSlides.map((slide) => (
                      <tr key={slide.id}>
                        <td>
                          {slide.image ? (
                            <img src={slide.image} alt="Slide" className="table-img" style={{width: '120px', height: 'auto', maxHeight: '80px'}} />
                          ) : (
                            <div className="table-img-placeholder">Rasmsiz</div>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEditSlide(slide)}>Tahrirlash</button>
                            <button className="btn-delete" onClick={() => {
                                if(window.confirm('Rostdan ham ushbu slaydni o\'chirmoqchimisiz?')) onDeleteHeroSlide(slide.id);
                              }}>O'chirish</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center py-4">Reklamalar qo'shilmagan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
