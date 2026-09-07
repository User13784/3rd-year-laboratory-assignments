import React, { useState } from 'react';
import { api } from '../../services/api';

function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

  const toggleFavorite = async () => {
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
          category: product.category
        });
        setIsFavorite(true);
        await api.updateProduct(product.id, { isFavorite: true });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToCart = async () => {
    try {
      await api.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      alert(`${product.name.en} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getTranslatedName = () => {
    const lang = localStorage.getItem('language') || 'en';
    return product.name[lang] || product.name.en;
  };

  const getTranslatedDescription = () => {
    const lang = localStorage.getItem('language') || 'en';
    return product.description[lang] || product.description.en;
  };

  const generateStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < Math.floor(rating) ? '★' : '☆';
    }
    return stars;
  };

  return (
    <article className="product-card">
      <div className="card-image">
        <img src={product.image} alt={getTranslatedName()} />
        <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-info">
        <h3 className="card-title">{getTranslatedName()}</h3>
        <div className="card-category">{product.category}</div>
        <div className="card-price">£{product.price.toFixed(2)}</div>
        <div className="card-rating">{generateStars(product.rating)}</div>
        <span className={`card-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>
          {product.inStock ? '✓ In stock' : '✗ Out of stock'}
        </span>
        <p className="card-description">{getTranslatedDescription()?.substring(0, 60)}...</p>
        <button className="add-to-cart-btn" onClick={addToCart} disabled={!product.inStock}>
          {product.inStock ? '🛒 Add to cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;