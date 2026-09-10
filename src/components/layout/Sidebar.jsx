import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

function Sidebar({ companyName = "Greenery" }) {
  const { t } = useLanguage();

  const menuItems = [
    { path: '/', icon: 'home', label: t('home') },
    { path: '/catalog', icon: 'shop', label: t('shop') },
    { path: '/favorites', icon: 'heart', label: t('favorites') },
    { path: '/feedback', icon: 'blog', label: t('reviews') },
    { path: '/cart', icon: 'cart', label: t('cart') },
  ];

  return (
    <nav className="sidebar">
      <div className="logo-container">
        <img src="/assets/icons/logo.png" alt={companyName} />
        <h2>{companyName}</h2>
      </div>
      <div className="menu-container">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `menu-item ${isActive ? 'active' : ''}`
            }
          >
            <img src={`/assets/icons/${item.icon}.png`} alt={item.label} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;