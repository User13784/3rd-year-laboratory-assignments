import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Badge, Alert,
  Spinner, Tabs, Tab, Form, InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchProducts,
  deleteProductAsync,
  selectAllProducts,
  selectProductsLoading
} from '../../features/products/productsSlice';
import {
  fetchFeedback,
  deleteFeedback,
  selectFeedback,
  selectFeedbackLoading
} from '../../features/feedback/feedbackSlice';
import { selectUser, selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';

function AdminPage() {
  const dispatch = useAppDispatch();

  // ===== REDUX STATE =====
  const products = useAppSelector(selectAllProducts);
  const productsLoading = useAppSelector(selectProductsLoading);
  const feedback = useAppSelector(selectFeedback);
  const feedbackLoading = useAppSelector(selectFeedbackLoading);
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // ===== LOCAL STATE =====
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // ===== ЗАГРУЗКА =====
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchProducts());
      dispatch(fetchFeedback());
    }
  }, [dispatch, isAdmin]);

  // ===== ПРОВЕРКА ДОСТУПА =====
  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h2>🔒 Требуется вход</h2>
          <p>Войдите в аккаунт для доступа к админ-панели</p>
          <Button as={Link} to="/register" variant="primary" size="lg">
            Войти
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h2>⛔ Доступ запрещён</h2>
          <p>Эта страница доступна только администратору</p>
          <Button as={Link} to="/catalog" variant="primary" size="lg">
            В каталог
          </Button>
        </Alert>
      </Container>
    );
  }

  if (productsLoading || feedbackLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка...</p>
      </Container>
    );
  }

  // ===== УДАЛЕНИЕ =====
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Удалить "${productName}"?`)) return;

    try {
      await dispatch(deleteProductAsync(productId)).unwrap();
      alert('✅ Товар удалён');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Ошибка удаления');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Удалить отзыв?')) return;

    try {
      await dispatch(deleteFeedback(feedbackId)).unwrap();
      alert('✅ Отзыв удалён');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Ошибка удаления');
    }
  };

  // ===== ФИЛЬТРАЦИЯ =====
  const filteredProducts = products.filter(product => {
    const nameEn = product.name?.en || '';
    const nameRu = product.name?.ru || '';
    const searchLower = searchTerm.toLowerCase();
    return nameEn.toLowerCase().includes(searchLower) ||
           nameRu.toLowerCase().includes(searchLower);
  });

  // ===== СТАТИСТИКА =====
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = products.filter(p => !p.inStock).length;
  const totalFeedback = feedback.length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, r) => sum + (r.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <Container fluid className="py-4">
      {/* ===== ЗАГОЛОВОК ===== */}
      <div className="text-center mb-4">
        <h1 className="display-5">👑 Admin Panel</h1>
        <p className="text-muted">Manage products and reviews</p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '15px'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#FFB800',
              color: '#264A51',
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(255, 184, 0, 0.3)'
            }}
          >
            👤 {user?.firstName || user?.email}
          </span>
        </div>
      </div>

      {/* ===== ВКЛАДКИ ===== */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 justify-content-center"
        fill
      >
        {/* DASHBOARD */}
        <Tab eventKey="dashboard" title="📊 Dashboard">
          <Row className="g-4 mb-4">
            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-primary">
                <Card.Body>
                  <div className="fs-1">📦</div>
                  <h2 className="text-primary">{totalProducts}</h2>
                  <p className="text-muted mb-0">Товаров</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-success">
                <Card.Body>
                  <div className="fs-1">✅</div>
                  <h2 className="text-success">{inStockProducts}</h2>
                  <p className="text-muted mb-0">В наличии</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-danger">
                <Card.Body>
                  <div className="fs-1">❌</div>
                  <h2 className="text-danger">{outOfStockProducts}</h2>
                  <p className="text-muted mb-0">Нет в наличии</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-info">
                <Card.Body>
                  <div className="fs-1">💬</div>
                  <h2 className="text-info">{totalFeedback}</h2>
                  <p className="text-muted mb-0">Отзывов</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">⭐</div>
                  <h2 className="text-warning">{avgRating} / 5</h2>
                  <p className="text-muted mb-0">Средний рейтинг</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">💰</div>
                  <h2 className="text-success">£{totalValue.toFixed(2)}</h2>
                  <p className="text-muted mb-0">Общая стоимость</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="mt-4 text-center">
            <Button as={Link} to="/catalog" variant="primary" size="lg" className="m-1">
              🛍️ В каталог
            </Button>
          </div>
        </Tab>

        {/* PRODUCTS */}
        <Tab eventKey="products" title="📦 Products">
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>🔍</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Поиск товаров..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        ✖
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col md={6} className="text-end">
                  <Badge bg="primary" className="fs-6">
                    {filteredProducts.length} из {products.length}
                  </Badge>
                </Col>
              </Row>

              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Фото</th>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>Рейтинг</th>
                    <th>Наличие</th>
                    <th className="text-center">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <Alert variant="info" className="mb-0">
                          Товары не найдены
                        </Alert>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name?.en}
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                          />
                        </td>
                        <td>{product.name?.en}</td>
                        <td><Badge bg="info">{product.category}</Badge></td>
                        <td className="fw-bold">£{product.price}</td>
                        <td className="text-warning">
                          {'★'.repeat(Math.floor(product.rating))}
                        </td>
                        <td>
                          <Badge bg={product.inStock ? 'success' : 'danger'}>
                            {product.inStock ? 'Да' : 'Нет'}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteProduct(product.id, product.name?.en)}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* REVIEWS */}
        <Tab eventKey="feedback" title="💬 Reviews">
          <Card className="shadow-sm">
            <Card.Body>
              {feedback.length === 0 ? (
                <Alert variant="info" className="text-center mb-0">
                  <h4>💬 Пока нет отзывов</h4>
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {feedback.map(review => (
                    <Col key={review.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <strong>{review.userNickname || 'User'}</strong>
                          <Badge bg="warning" text="dark">
                            {'★'.repeat(review.rating)}
                          </Badge>
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>
                            {review.text?.ru || review.text?.en}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteFeedback(review.id)}
                          >
                            🗑️
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* ===== ПРЕВЬЮ ===== */}
      {activeTab === 'products' && filteredProducts.length > 0 && (
        <Container className="mt-4">
          <h4 className="text-center mb-3">Preview</h4>
          <Row xs={1} sm={2} md={3} lg={4} className="g-3">
            {filteredProducts.slice(0, 4).map(product => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </Container>
  );
}

export default AdminPage;