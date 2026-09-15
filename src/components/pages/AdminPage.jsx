import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
  Spinner,
  Tabs,
  Tab,
  Form,
  InputGroup
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../product/ProductCard';

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [productsData, usersData, feedbackData] = await Promise.all([
        api.getProducts(),
        api.getUsers ? api.getUsers() : [],
        api.getFeedback()
      ]);
      setProducts(productsData || []);
      setUsers(usersData || []);
      setFeedback(feedbackData || []);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h2>🔒 {t('loginRequired')}</h2>
          <p>{t('goToLoginConfirm')}</p>
          <Button as={Link} to="/register" variant="primary" size="lg">
            {t('login')}
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h2>⛔ Access Denied</h2>
          <p>{t('adminRequired')}</p>
          <Button as={Link} to="/catalog" variant="primary" size="lg">
            {t('goToCatalogBtn')}
          </Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">{t('loadingProducts')}</p>
      </Container>
    );
  }

  const handleDeleteProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(`${t('confirmDelete')} "${productName}"?`);
    if (!confirmDelete) return;

    try {
      await api.deleteProduct(productId);
      await loadAllData();
      alert('✅ ' + t('productsDeleted'));
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorDeleting'));
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    const confirmDelete = window.confirm(t('confirmDelete') + '?');
    if (!confirmDelete) return;

    try {
      await api.deleteFeedback(feedbackId);
      await loadAllData();
      alert('✅ ' + t('productsDeleted'));
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorDeleting'));
    }
  };

  const filteredProducts = products.filter(product => {
    const nameEn = product.name?.en || '';
    const nameRu = product.name?.ru || '';
    const searchLower = searchTerm.toLowerCase();
    return nameEn.toLowerCase().includes(searchLower) ||
           nameRu.toLowerCase().includes(searchLower);
  });

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = products.filter(p => !p.inStock).length;
  const totalUsers = users.length;
  const totalFeedback = feedback.length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, r) => sum + (r.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">👑 Admin Panel</h1>
        <p className="text-muted">Manage products, users and reviews</p>

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
              letterSpacing: '0.3px',
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
                  <p className="text-muted mb-0">{t('products')}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-success">
                <Card.Body>
                  <div className="fs-1">✅</div>
                  <h2 className="text-success">{inStockProducts}</h2>
                  <p className="text-muted mb-0">{t('inStock')}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-danger">
                <Card.Body>
                  <div className="fs-1">❌</div>
                  <h2 className="text-danger">{outOfStockProducts}</h2>
                  <p className="text-muted mb-0">{t('outOfStock')}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={3}>
              <Card className="text-center shadow-sm h-100 border-info">
                <Card.Body>
                  <div className="fs-1">👥</div>
                  <h2 className="text-info">{totalUsers}</h2>
                  <p className="text-muted mb-0">Users</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">💬</div>
                  <h2 className="text-primary">{totalFeedback}</h2>
                  <p className="text-muted mb-0">{t('reviews')}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">⭐</div>
                  <h2 className="text-warning">{avgRating} / 5</h2>
                  <p className="text-muted mb-0">{t('avgRating')}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <div className="fs-1">💰</div>
                  <h2 className="text-success">£{totalValue.toFixed(2)}</h2>
                  <p className="text-muted mb-0">Total Value</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="mt-4 text-center">
            <Button as={Link} to="/catalog" variant="primary" size="lg" className="m-1">
              🛍️ {t('goToCatalog')}
            </Button>
            <Button variant="warning" size="lg" className="m-1" onClick={loadAllData}>
              🔄 Reload
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
                      placeholder={t('searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                        ✖
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col md={6} className="text-end">
                  <Badge bg="primary" className="fs-6">
                    {filteredProducts.length} {t('of')} {products.length}
                  </Badge>
                </Col>
              </Row>

              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>{t('id')}</th>
                    <th>Image</th>
                    <th>{t('name')}</th>
                    <th>{t('category')}</th>
                    <th>{t('price')}</th>
                    <th>{t('rating')}</th>
                    <th>{t('availability')}</th>
                    <th className="text-center">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <Alert variant="info" className="mb-0">
                          {t('noProducts')}
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
                        <td className="text-warning">{'★'.repeat(Math.floor(product.rating))}</td>
                        <td>
                          <Badge bg={product.inStock ? 'success' : 'danger'}>
                            {product.inStock ? t('yes') : t('no')}
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
                  <h4>{t('noReviews')}</h4>
                  <p>{t('noReviewsHint')}</p>
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
                          <Card.Text>{review.text?.en || review.text?.ru}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteFeedback(review.id)}>
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

        {/* USERS */}
        <Tab eventKey="users" title="👥 Users">
          <Card className="shadow-sm">
            <Card.Body>
              {users.length === 0 ? (
                <Alert variant="info" className="text-center mb-0">No users</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.email}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>
                          <Badge bg={u.role === 'admin' ? 'warning' : 'info'} text={u.role === 'admin' ? 'dark' : 'white'}>
                            {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

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