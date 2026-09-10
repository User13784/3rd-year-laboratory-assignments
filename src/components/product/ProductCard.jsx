import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

  // ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
  const requireAuth = (actionName) => {
    if (!isAuthenticated) {
      const goToLogin = window.confirm(
        `🔒 Для "${actionName}" необходимо войти в аккаунт.\n\nПерейти на страницу входа?`
      );
      if (goToLogin) {
        navigate('/register');
      }
      return false;
    }
    return true;
  };

  // ===== ИЗБРАННОЕ =====
  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!requireAuth('добавления в избранное')) return;

    try {
      if (isFavorite) {
        const favorites = await api.getFavorites();
        const favItem = favorites.find(f => f.productId === product.id);
        if (favItem) {
          await api.removeFromFavorites(favItem.id);
        }
        setIsFavorite(false);
        await api.updateProduct(product.id, { isFavorite: false });
      } else {
        await api.addToFavorites({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating || 5,
          description: product.description || { en: '', ru: '' },
          inStock: product.inStock !== undefined ? product.inStock : true
        });
        setIsFavorite(true);
        await api.updateProduct(product.id, { isFavorite: true });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // ===== КОРЗИНА =====
  const addToCart = async (e) => {
    e.stopPropagation();

    if (!requireAuth('добавления в корзину')) return;

    try {
      await api.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      alert(`✅ "${getTranslatedName()}" добавлен в корзину!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Ошибка добавления в корзину');
    }
  };

  // ===== ПЕРЕВОДЫ =====
  const getTranslatedName = () => {
    const lang = localStorage.getItem('language') || 'en';
    if (!product.name) return 'Product';
    if (typeof product.name === 'string') return product.name;
    return product.name[lang] || product.name.en || 'Product';
  };

  const getTranslatedDescription = () => {
    const lang = localStorage.getItem('language') || 'en';
    if (!product.description) return '';
    if (typeof product.description === 'string') return product.description;
    return product.description[lang] || product.description.en || '';
  };

  const generateStars = (rating) => {
    const stars = rating || 5;
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += i < Math.floor(stars) ? '★' : '☆';
    }
    return result;
  };

  if (!product) {
    return <div className="product-card-error">Product not found</div>;
  }

  return (
    <article className="product-card">
      <div className="card-image">
        <img 
          src={product.image || '/assets/images/placeholder.jpg'} 
          alt={getTranslatedName()} 
          onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
        />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`} 
          onClick={toggleFavorite}
          title={isAuthenticated ? 'Добавить в избранное' : 'Войдите, чтобы добавить в избранное'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-info">
        <h3 className="card-title">{getTranslatedName()}</h3>
        <div className="card-category">{product.category || 'General'}</div>
        <div className="card-price">£{(product.price || 0).toFixed(2)}</div>
        <div className="card-rating">{generateStars(product.rating)}</div>
        <span className={`card-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>
          {product.inStock ? '✓ In stock' : '✗ Out of stock'}
        </span>
        <p className="card-description">{getTranslatedDescription().substring(0, 60)}...</p>
        <button 
          className="add-to-cart-btn" 
          onClick={addToCart} 
          disabled={!product.inStock}
          title={isAuthenticated ? 'Добавить в корзину' : 'Войдите, чтобы добавить в корзину'}
        >
          {product.inStock ? '🛒 Add to cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;