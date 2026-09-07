import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import HomePage from './components/pages/HomePage';
import CatalogPage from './components/pages/CatalogPage';
import CartPage from './components/pages/CartPage';
import FavoritesPage from './components/pages/FavoritesPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AdminPage from './components/pages/AdminPage';
import './App.css';

function App() {
  const companyName = "Greenery";
  const mainTitle = "Best Furniture For Your Interior";

  return (
    <Router>
      <div className="app-container">
        <Sidebar companyName={companyName} />
        <main className="main-content">
          <header className="header-line">
            <div className="nav-left">
              <div className="nav-item-with-icon">
                <img src="/assets/icons/human.png" alt="user" className="nav-icon" />
                <a className="nav-item" href="/register">LOGIN</a>
              </div>
              <div className="nav-item-with-icon">
                <img src="/assets/icons/door.png" alt="door" className="nav-icon" />
                <a className="nav-item" href="/register">SIGN UP</a>
              </div>
            </div>
            <div className="nav-right">
              <div className="nav-item-with-icon">
                <img src="/assets/icons/email.png" alt="email" className="nav-icon" />
                <a className="nav-item" href="#">MAILING LIST</a>
              </div>
              <div className="nav-item-with-icon">
                <img src="/assets/icons/symbol.png" alt="share" className="nav-icon" />
                <a className="nav-item" href="#">SHARE</a>
              </div>
              <div className="nav-item-with-icon">
                <img src="/assets/icons/cart.png" alt="cart" className="nav-icon" />
                <a className="nav-item" href="/cart">CART</a>
              </div>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<HomePage title={mainTitle} />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;