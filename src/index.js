import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ===== ИНИЦИАЛИЗАЦИЯ МОБИЛЬНОГО МЕНЮ =====
function initMobileMenu() {
  const burger = document.getElementById('burgerMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');

  if (!burger || !mobileMenu || !overlay) {
    // Если элементы еще не загружены, пробуем позже
    setTimeout(initMobileMenu, 100);
    return;
  }

  function toggleMenu() {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Закрываем меню при клике на ссылку
  mobileMenu.querySelectorAll('.menu-item').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Закрываем при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Закрываем при изменении размера окна на десктопный
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      closeMenu();
    }
  });
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ===== ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ =====
// Ждем полной загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();