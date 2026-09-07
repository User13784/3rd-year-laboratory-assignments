import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import ProductCard from '../product/ProductCard';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (favorites.length === 0) {
    return (
      <div className="empty-favorites">
        <h2>😔 Favorites is empty</h2>
        <p>Add items to favorites to see them here</p>
        <a href="/catalog" className="back-link">Go to catalog</a>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="catalog-header">
        <h1>❤️ Favorites</h1>
        <p>Your favorite items</p>
      </div>
      <div className="catalog-container">
        {favorites.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;