import React, { useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchCart,
  updateCartQuantity,
  removeFromCartAsync,
  selectCartItems,
  selectCartTotal,
  selectCartLoading
} from '../../features/cart/cartSlice';
import { useLanguage } from '../../context/LanguageContext';

function CartPage() {
  const dispatch = useAppDispatch();
  const { t, lang } = useLanguage();

  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const loading = useAppSelector(selectCartLoading);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCartAsync(id));
      return;
    }
    dispatch(updateCartQuantity({ id, quantity }));
  };

  const removeItem = (id) => {
    dispatch(removeFromCartAsync(id));
  };

  const getTranslatedName = (name) => {
    const currentLang = lang || localStorage.getItem('language') || 'en';
    if (!name) return 'Product';
    if (typeof name === 'string') return name;
    return name[currentLang] || name.en || 'Product';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка...</p>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>🛍️ Корзина пуста</h2>
          <p>Добавьте товары в корзину</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          🛍️ В каталог
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">🛒 Корзина покупок</h1>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Товар</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Количество</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.image}
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
        <h3 className="mb-0">Итого: £{total.toFixed(2)}</h3>
      </Alert>

      <div className="d-flex justify-content-between flex-wrap gap-2">
        <Button as={Link} to="/catalog" variant="outline-secondary" size="lg">
          ← Продолжить покупки
        </Button>
        <Button variant="success" size="lg">✅ Оформить заказ</Button>
      </div>
    </Container>
  );
}

export default CartPage;