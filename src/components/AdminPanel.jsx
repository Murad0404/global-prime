import React, { useState, useEffect } from 'react';
import { Package, Settings as SettingsIcon, Droplet, Zap, Box, Truck, PenTool, Layers, Cpu, Wrench, X } from 'lucide-react';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import './AdminPanel.css';

export const ICONS = {
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

const AdminPanel = ({
  products, onAddProduct, onDeleteProduct, onUpdateProduct,
  heroSlides, onAddHeroSlide, onDeleteHeroSlide, onUpdateHeroSlide,
  settings, onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'hero', 'settings'
  const [message, setMessage] = useState('');

  // --- SETTINGS STATE ---
  const [settingsFormData, setSettingsFormData] = useState({
    phone: settings?.phone || '+998 90 123 45 67',
    email: settings?.email || 'info@globalprime.uz',
    address: settings?.address || 'Toshkent shahar, Chilonzor tumani',
    telegramBotToken: settings?.telegramBotToken || '8876444321:AAH7etXOVPSqoq4jXleTy9LiZA-Ebi3klOk',
    telegramChatId: settings?.telegramChatId || ''
  });

  useEffect(() => {
    if (settings) {
      setSettingsFormData(settings);
    }
  }, [settings]);

  // --- PRODUCT STATE ---
  const existingCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const categoriesFromSettings = settings?.categories || [];
  const legacyCategories = existingCategories.filter(c => !categoriesFromSettings.find(sc => sc.name === c));
  const allCategories = [
    ...categoriesFromSettings,
    ...legacyCategories.map(c => ({ name: c, icon: 'Package' }))
  ];

  const [newCategoryUz, setNewCategoryUz] = useState('');
  const [newCategoryRu, setNewCategoryRu] = useState('');
  const [newCategoryEn, setNewCategoryEn] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Package');
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New state for viewing images full size
  const [viewImage, setViewImage] = useState(null);

  const [productFormData, setProductFormData] = useState({
    name: '', russianName: '', price: '', oldPrice: '', category: '',
    description: '', features: '', image1: '', image2: '', image3: '',
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

  const [isUploading, setIsUploading] = useState(false);

  const uploadToFirebase = async (base64, filename) => {
    // Firebase Storage pullik tarif so'ragani uchun, rasmlarni to'g'ridan-to'g'ri
    // siqilgan Base64 formatida Firestore ichida saqlaymiz.
    // Bu mutlaqo bepul va tez ishlaydi.
    return base64;
  };

  const handleImageUpload = (e, targetForm, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Fayl hajmi 5MB dan kichik bo\'lishi kerak!', 'error');
        e.target.value = '';
        return;
      }
      setIsUploading(true);
      compressImage(file, targetForm, async (compressedBase64) => {
        const url = await uploadToFirebase(compressedBase64, `${Date.now()}_${file.name}`);
        if (url) {
          if (targetForm === 'product') {
            setProductFormData(prev => ({ ...prev, [fieldName]: url }));
          } else if (targetForm === 'hero') {
            setSlideFormData(prev => ({ ...prev, [fieldName]: url }));
          }
        }
        setIsUploading(false);
      });
    }
  };

  const handleMultipleProductImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // maximum 3 files
    if (files.length === 0) return;

    setProductFormData(prev => ({ ...prev, image1: '', image2: '', image3: '' }));
    setIsUploading(true);

    let uploadsCompleted = 0;
    files.forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Fayl hajmi 5MB dan kichik bo\'lishi kerak!', 'error');
        uploadsCompleted++;
        if (uploadsCompleted === files.length) setIsUploading(false);
        return;
      }
      compressImage(file, 'product', async (compressedBase64) => {
        const url = await uploadToFirebase(compressedBase64, `${Date.now()}_${file.name}`);
        if (url) {
          const fieldName = index === 0 ? 'image1' : index === 1 ? 'image2' : 'image3';
          setProductFormData(prev => ({ ...prev, [fieldName]: url }));
        }
        uploadsCompleted++;
        if (uploadsCompleted === files.length) setIsUploading(false);
      });
    });
  };

  // --- SETTINGS HANDLERS ---
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsFormData({ ...settingsFormData, [name]: value });
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    onUpdateSettings(settingsFormData);
    showMessage("Sozlamalar muvaffaqiyatli saqlandi!");
  };

  // --- PRODUCT HANDLERS ---
  const handleDeleteCategory = (catName) => {
    const productsInCat = products.filter(p => p.category === catName);
    
    const performDelete = () => {
      const updatedCategories = categoriesFromSettings.filter(c => c.name !== catName);
      onUpdateSettings({ ...settingsFormData, categories: updatedCategories });
      showMessage("Kategoriya o'chirildi!");
    };

    if (productsInCat.length > 0) {
      const confirmDelete = window.confirm(`Bu kategoriya ${productsInCat.length} ta mahsulotga ulangan. Aniq o'chirishni xohlaysizmi? (Unga tegishli mahsulotlar ham o'chiriladi)`);
      if (confirmDelete) {
        productsInCat.forEach(p => {
          onDeleteProduct(p.id);
        });
        performDelete();
      }
    } else {
      const confirmDelete = window.confirm("Rostdan ham ushbu kategoriyani o'chirmoqchimisiz?");
      if (confirmDelete) {
        performDelete();
      }
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const uz = newCategoryUz.trim();
    if (uz && !allCategories.find(c => c.name === uz)) {
      const newCatObj = { 
        name: uz, 
        nameUz: uz, 
        nameRu: newCategoryRu.trim() || uz, 
        nameEn: newCategoryEn.trim() || uz, 
        icon: newCategoryIcon 
      };
      const updatedCategories = [...categoriesFromSettings, newCatObj];
      onUpdateSettings({ ...settingsFormData, categories: updatedCategories });
      
      if (!productFormData.category) {
        setProductFormData({ ...productFormData, category: uz });
      }
      setNewCategoryUz('');
      setNewCategoryRu('');
      setNewCategoryEn('');
      setNewCategoryIcon('Package');
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
      image2: productFormData.image2,
      image3: productFormData.image3
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
      description: '', features: '', image1: '', image2: '', image3: '',
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
      image2: product.image2 || '',
      image3: product.image3 || ''
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
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Sozlamalar
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="admin-card">
            <h3>Sayt Sozlamalari (Aloqa ma'lumotlari)</h3>
            <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '0.9rem' }}>
              Bu yerdagi ma'lumotlar saytning eng tepasi (Header) va eng pastida (Footer) mijozlarga ko'rinadi.
            </p>
            <form onSubmit={handleSettingsSubmit} className="admin-form">
              <div className="form-group">
                <label>Telefon raqam *</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={settingsFormData.phone} 
                  onChange={handleSettingsChange} 
                  required 
                  placeholder="+998 90 123 45 67" 
                />
              </div>
              <div className="form-group">
                <label>Email manzil</label>
                <input 
                  type="email" 
                  name="email" 
                  value={settingsFormData.email} 
                  onChange={handleSettingsChange} 
                  placeholder="info@globalprime.uz" 
                />
              </div>
              <div className="form-group">
                <label>Manzil (Adres)</label>
                <input 
                  type="text" 
                  name="address" 
                  value={settingsFormData.address} 
                  onChange={handleSettingsChange} 
                  placeholder="Toshkent shahar, Chilonzor tumani..." 
                />
              </div>
              <div className="form-group" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ marginBottom: '15px' }}>Telegram Bot Sozlamalari (Buyurtmalar uchun)</h4>
                <label>Bot Token</label>
                <input 
                  type="text" 
                  name="telegramBotToken" 
                  value={settingsFormData.telegramBotToken} 
                  onChange={handleSettingsChange} 
                  placeholder="8876444321:AAH7etXOVPSqoq4jXleTy9LiZA-Ebi3klOk" 
                />
              </div>
              <div className="form-group">
                <label>Telegram Chat ID (Sizning ID raqamingiz) *</label>
                <input 
                  type="text" 
                  name="telegramChatId" 
                  value={settingsFormData.telegramChatId} 
                  onChange={handleSettingsChange} 
                  placeholder="Masalan: 123456789" 
                  required
                />
                <small style={{ color: '#6b7280', display: 'block', marginTop: '5px' }}>
                  O'zingizning Chat ID raqamingizni bilish uchun Telegramda <b>@userinfobot</b> ga kiring va Start bosing. U sizga ID raqamingizni beradi. O'sha raqamni shu yerga yozing.
                </small>
              </div>
              <div className="form-actions" style={{ marginTop: '15px' }}>
                <button type="submit" className="btn-primary" style={{ width: '200px' }}>
                  Saqlash
                </button>
              </div>
            </form>
          </div>
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
                  <label>Kategoriya nomi (O'zbek, Rus, Ingliz) va Belgisi</label>
                  <div className="input-group" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input style={{ flex: '1', minWidth: '150px' }} type="text" value={newCategoryUz} onChange={(e) => setNewCategoryUz(e.target.value)} placeholder="O'zbekcha (Maxsus uskunalar)" required />
                    <input style={{ flex: '1', minWidth: '150px' }} type="text" value={newCategoryRu} onChange={(e) => setNewCategoryRu(e.target.value)} placeholder="Ruscha" />
                    <input style={{ flex: '1', minWidth: '150px' }} type="text" value={newCategoryEn} onChange={(e) => setNewCategoryEn(e.target.value)} placeholder="Inglizcha" />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {Object.keys(ICONS).map(iconKey => (
                        <div 
                          key={iconKey}
                          onClick={() => setNewCategoryIcon(iconKey)}
                          title={iconKey}
                          style={{
                            padding: '8px',
                            border: newCategoryIcon === iconKey ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: newCategoryIcon === iconKey ? 'var(--color-primary-light, #eff6ff)' : 'transparent',
                            color: newCategoryIcon === iconKey ? 'var(--color-primary)' : 'var(--color-text-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          {ICONS[iconKey]}
                        </div>
                      ))}
                    </div>
                    <button type="submit" className="btn-primary">Qo'shish</button>
                  </div>
                </div>
              </form>
              <div className="categories-list">
                <h4>Mavjud Kategoriyalar:</h4>
                <div className="tags">
                  {allCategories.map((cat, idx) => (
                    <span key={idx} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      {ICONS[cat.icon] || ICONS.Package} {cat.nameUz || cat.name}
                      <button 
                        type="button" 
                        onClick={() => handleDeleteCategory(cat.name)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: '0 5px', fontSize: '1.2rem', lineHeight: '1' }}
                        title="O'chirish"
                      >
                        &times;
                      </button>
                    </span>
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
                        <option key={cat.name} value={cat.name}>{cat.nameUz || cat.name}</option>
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
                  <label>Rasmlar (maksimal 3 ta rasm yuklash mumkin)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleProductImageUpload}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {productFormData.image1 && <div className="img-preview"><img src={productFormData.image1} alt="Preview 1" /></div>}
                    {productFormData.image2 && <div className="img-preview"><img src={productFormData.image2} alt="Preview 2" /></div>}
                    {productFormData.image3 && <div className="img-preview"><img src={productFormData.image3} alt="Preview 3" /></div>}
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
                  <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={isUploading}>
                    {isUploading ? 'Rasm yuklanmoqda...' : (editingProductId ? 'O\'zgarishlarni Saqlash' : 'Mahsulotni Saqlash')}
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
                            <img 
                              src={product.image1} 
                              alt={product.name} 
                              className="table-img" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => setViewImage({ images: [product.image1, product.image2, product.image3].filter(Boolean), index: 0 })} 
                            />
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
                              if (window.confirm('Rostdan ham ushbu mahsulotni o\'chirmoqchimisiz?')) onDeleteProduct(product.id);
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
            <p style={{ marginBottom: '15px', color: '#6b7280', fontSize: '0.9rem' }}>Asosiy sahifadagi 4 burchakli slayderga rasm va matn yuklash.</p>
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
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isUploading}>
                  {isUploading ? 'Rasm yuklanmoqda...' : (editingSlideId ? 'O\'zgarishlarni Saqlash' : 'Reklamani Qo\'shish')}
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
                            <img 
                              src={slide.image} 
                              alt="Slide" 
                              className="table-img" 
                              style={{ width: '120px', height: 'auto', maxHeight: '80px', cursor: 'pointer' }} 
                              onClick={() => setViewImage({ images: [slide.image], index: 0 })}
                            />
                          ) : (
                            <div className="table-img-placeholder">Rasmsiz</div>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => handleEditSlide(slide)}>Tahrirlash</button>
                            <button className="btn-delete" onClick={() => {
                              if (window.confirm('Rostdan ham ushbu slaydni o\'chirmoqchimisiz?')) onDeleteHeroSlide(slide.id);
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

      {/* --- IMAGE VIEW MODAL --- */}
      {viewImage && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
          }}
          onClick={() => setViewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setViewImage(null); }}
              style={{
                position: 'absolute', top: '-40px', right: '0', 
                background: 'none', border: 'none', color: 'white', 
                fontSize: '35px', cursor: 'pointer', zIndex: 10
              }}
            >
              &times;
            </button>

            {viewImage.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewImage({ ...viewImage, index: viewImage.index === 0 ? viewImage.images.length - 1 : viewImage.index - 1 });
                }}
                style={{
                  position: 'absolute', left: '-50px',
                  background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                  fontSize: '40px', cursor: 'pointer', padding: '10px 15px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
              >
                &lsaquo;
              </button>
            )}

            <img 
              src={viewImage.images[viewImage.index]} 
              alt="Full size preview" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} 
              onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
            />

            {viewImage.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewImage({ ...viewImage, index: viewImage.index === viewImage.images.length - 1 ? 0 : viewImage.index + 1 });
                }}
                style={{
                  position: 'absolute', right: '-50px',
                  background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                  fontSize: '40px', cursor: 'pointer', padding: '10px 15px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
              >
                &rsaquo;
              </button>
            )}
          </div>
          
          {/* Thumbnails Indicator */}
          {viewImage.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '8px' }}>
              {viewImage.images.map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: viewImage.index === idx ? 'white' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => { e.stopPropagation(); setViewImage({ ...viewImage, index: idx }); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
