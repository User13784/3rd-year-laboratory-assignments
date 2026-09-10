import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import CatalogPage from './components/pages/CatalogPage';
import CartPage from './components/pages/CartPage';
import FavoritesPage from './components/pages/FavoritesPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AdminPage from './components/pages/AdminPage';
import RegisterPage from './components/pages/RegisterPage';
import NotFoundPage from './components/pages/NotFoundPage';
import './App.css';

// ===== ШАПКА =====
function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirm'))) {
      logout();
    }
  };

  return (
    <header className="header-line">
      <div className="nav-left">
        {isAuthenticated ? (
          <>
            <div className="nav-item-with-icon">
              <img src="/assets/icons/human.png" alt="user" className="nav-icon" />
              <span className="nav-item">
                {user.firstName || user.email} {isAdmin && '👑'}
              </span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 {t('logout')}
            </button>
          </>
        ) : (
          <>
            <div className="nav-item-with-icon">
              <img src="/assets/icons/human.png" alt="user" className="nav-icon" />
              <Link className="nav-item" to="/register">{t('login')}</Link>
            </div>
            <div className="nav-item-with-icon">
              <img src="/assets/icons/door.png" alt="door" className="nav-icon" />
              <Link className="nav-item" to="/register">{t('signup')}</Link>
            </div>
          </>
        )}
      </div>

      <div className="nav-right">
        <div className="nav-item-with-icon">
          <img src="/assets/icons/email.png" alt="email" className="nav-icon" />
          <a className="nav-item" href="#">{t('mailing')}</a>
        </div>
        <div className="nav-item-with-icon">
          <img src="/assets/icons/symbol.png" alt="share" className="nav-icon" />
          <a className="nav-item" href="#">{t('share')}</a>
        </div>
        <div className="nav-item-with-icon">
          <img src="/assets/icons/cart.png" alt="cart" className="nav-icon" />
          <Link className="nav-item" to="/cart">{t('cart')}</Link>
        </div>

        {/* ===== КНОПКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ===== */}
        <button
          className="language-toggle"
          onClick={toggleLanguage}
          title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
        >
          {lang === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
        </button>
      </div>
    </header>
  );
}

// ===== ГЛАВНЫЙ КОМПОНЕНТ =====
function App() {
  const companyName = "Greenery";
  const mainTitle = "Best Furniture For Your Interior";

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Sidebar companyName={companyName} />
            <main className="main-content">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage title={mainTitle} />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Footer />
            </main>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;