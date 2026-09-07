import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ companyName = "Greenery" }) {
  const menuItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/catalog', icon: 'shop', label: 'Shop' },
    { path: '/favorites', icon: 'heart', label: 'Favorites' },
    { path: '/feedback', icon: 'blog', label: 'Reviews' },
    { path: '/cart', icon: 'cart', label: 'Cart' },
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