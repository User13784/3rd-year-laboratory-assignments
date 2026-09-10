import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      const goToLogin = window.confirm(
        '🔒 Для добавления в корзину необходимо войти в аккаунт.\n\nПерейти на страницу входа?'
      );
      if (goToLogin) {
        onClose();
        navigate('/register');
      }
      return;
    }
    onAddToCart(product);
    onClose();
  };

  const getTranslatedName = () => {
    const lang = localStorage.getItem('language') || 'en';
    if (typeof product.name === 'string') return product.name;
    return product.name?.[lang] || product.name?.en || 'Product';
  };

  const getTranslatedDescription = () => {
    const lang = localStorage.getItem('language') || 'en';
    if (typeof product.description === 'string') return product.description;
    return product.description?.[lang] || product.description?.en || '';
  };

  const generateStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < Math.floor(rating || 5) ? '★' : '☆';
    }
    return stars;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTranslatedName()}>
      <div className="product-modal">
        <div className="product-modal-image">
          <img src={product.image} alt={getTranslatedName()} />
        </div>
        <div className="product-modal-info">
          <div className="product-modal-category">{product.category}</div>
          <div className="product-modal-price">£{product.price.toFixed(2)}</div>
          <div className="product-modal-rating">{generateStars(product.rating)}</div>
          <p className="product-modal-description">{getTranslatedDescription()}</p>
          <span className={`card-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>
            {product.inStock ? '✓ In stock' : '✗ Out of stock'}
          </span>

          {/* Предупреждение для гостей */}
          {!isAuthenticated && (
            <div className="modal-auth-warning">
              ℹ️ <a href="/register">Войдите в аккаунт</a>, чтобы добавить в корзину
            </div>
          )}

          <button 
            className="modal-add-to-cart"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            🛒 Add to cart
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProductModal;