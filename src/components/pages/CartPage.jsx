import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

function CartPage() {
  const { t, lang } = useLanguage();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, [lang]);

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCartItems(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(id);
      return;
    }
    try {
      await api.updateCartItem(id, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTranslatedName = (name) => {
    const currentLang = lang || localStorage.getItem('language') || 'en';
    if (!name) return 'Product';
    if (typeof name === 'string') return name;
    return name[currentLang] || name.en || 'Product';
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">{t('loadingProducts')}</p>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>{t('emptyCart')}</h2>
          <p>{t('emptyCartHint')}</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          {t('goToCatalog')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">{t('shoppingCart')}</h1>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>{t('product')}</th>
            <th>{t('name')}</th>
            <th>{t('price')}</th>
            <th>{t('quantity')}</th>
            <th>{t('total')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.image || '/assets/images/placeholder.jpg'}
                  alt={getTranslatedName(item.name)}
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
                />
              </td>
              <td>{getTranslatedName(item.name)}</td>
              <td>£{item.price.toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</Button>
                  <Badge bg="secondary" className="fs-6">{item.quantity}</Badge>
                  <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>
              </td>
              <td className="fw-bold text-primary">£{(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Alert variant="success" className="text-end">
        <h3 className="mb-0">{t('total')}: £{total.toFixed(2)}</h3>
      </Alert>

      <div className="d-flex justify-content-between flex-wrap gap-2">
        <Button as={Link} to="/catalog" variant="outline-secondary" size="lg">
          {t('continueShopping')}
        </Button>
        <Button variant="success" size="lg">{t('checkout')}</Button>
      </div>
    </Container>
  );
}

export default CartPage;