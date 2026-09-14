import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';   // ← React Bootstrap
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
        `🔒 Для "${actionName}" необходимо войти в аккаунт.`
      );
      if (goToLogin) navigate('/register');
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
        if (favItem) await api.removeFromFavorites(favItem.id);
        setIsFavorite(false);
      } else {
        await api.addToFavorites({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating || 5
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error:', error);
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
      console.error('Error:', error);
    }
  };

  // ===== ПЕРЕВОДЫ =====
  const getTranslatedName = () => {
    const lang = localStorage.getItem('language') || 'en';
    if (!product.name) return 'Product';
    if (typeof product.name === 'string') return product.name;
    return product.name[lang] || product.name.en || 'Product';
  };

  const generateStars = (rating) => {
    const stars = rating || 5;
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += i < Math.floor(stars) ? '★' : '☆';
    }
    return result;
  };

  if (!product) return null;

  return (
    <Card className="h-100 shadow-sm product-card-bs">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.image || '/assets/images/placeholder.jpg'}
          alt={getTranslatedName()}
          style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
          onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
        />

        {/* Кнопка избранного */}
        <Button
          variant={isFavorite ? 'danger' : 'light'}
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle"
          onClick={toggleFavorite}
          style={{ width: '40px', height: '40px', padding: 0 }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </Button>

        {/* Бейдж "Top" */}
        {product.rating >= 4.5 && (
          <Badge
            bg="warning"
            text="dark"
            className="position-absolute top-0 start-0 m-2"
          >
            ⭐ Top
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{getTranslatedName()}</Card.Title>

        <Badge bg="info" className="align-self-start mb-2">
          {product.category || 'General'}
        </Badge>

        <Card.Text className="text-primary fw-bold fs-5 mb-2">
          £{(product.price || 0).toFixed(2)}
        </Card.Text>

        <div className="text-warning mb-2">
          {generateStars(product.rating)}
        </div>

        <Badge
          bg={product.inStock ? 'success' : 'danger'}
          className="align-self-start mb-3"
        >
          {product.inStock ? '✓ In stock' : '✗ Out of stock'}
        </Badge>

        <Button
          variant="primary"
          className="mt-auto w-100"
          onClick={addToCart}
          disabled={!product.inStock}
        >
          🛒 Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;