import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'ravshan' && password === 'ravshanAdmin95') {
      setError('');
      onLogin(); // notify parent component
    } else {
      setError('Login yoki parol xato!');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Admin Panelga Kirish</h2>
        <p className="login-subtitle">Faqat tizim ma'murlari uchun</p>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Login</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Foydalanuvchi nomi"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Parol</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Tizimga kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
