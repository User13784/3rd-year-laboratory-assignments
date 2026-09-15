import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Badge, ListGroup } from 'react-bootstrap';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import Modal from '../common/Modal';

function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!product) return null;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTranslatedName()}
      size="lg"
    >
      <Row>
        <Col md={5} className="text-center mb-3 mb-md-0">
          <img
            src={product.image || '/assets/images/placeholder.jpg'}
            alt={getTranslatedName()}
            className="img-fluid rounded"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
            onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
          />
        </Col>

        <Col md={7}>
          <Badge bg="info" className="mb-2">
            {product.category || 'General'}
          </Badge>

          <h3 className="text-primary">
            £{(product.price || 0).toFixed(2)}
          </h3>

          <div className="text-warning fs-5 mb-3">
            {generateStars(product.rating)}
          </div>

          <p className="text-muted">
            {getTranslatedDescription()}
          </p>

          <Badge
            bg={product.inStock ? 'success' : 'danger'}
            className="mb-3 fs-6"
          >
            {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
          </Badge>

          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>
              <strong>ID:</strong> {product.id}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Категория:</strong> {product.category}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Рейтинг:</strong> {product.rating} / 5
            </ListGroup.Item>
          </ListGroup>

          {!isAuthenticated && (
            <div className="alert alert-warning small">
              ℹ️ <a href="/register" className="alert-link">Войдите</a>, чтобы добавить в корзину
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-100"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            🛒 Добавить в корзину
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default ProductModal;