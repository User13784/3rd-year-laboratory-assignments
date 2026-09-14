import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Badge,
  Alert,
  Spinner,
  ButtonGroup,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import EditProductModal from '../product/EditProductModal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function CatalogPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  // ===== СОСТОЯНИЯ =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ===== ПАГИНАЦИЯ =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ===== ЗАГРУЗКА =====
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // ===== АВТОРИЗАЦИЯ =====
  const requireAuth = (actionName) => {
    if (!isAuthenticated) {
      const goToLogin = window.confirm(`🔒 Войти для "${actionName}"?`);
      if (goToLogin) navigate('/register');
      return false;
    }
    return true;
  };

  // ===== МОДАЛКИ =====
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const openEditModal = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) {
      alert('⛔ Только для администратора');
      return;
    }
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (updatedProduct) => {
    if (!isAdmin) return;
    try {
      await api.updateProduct(updatedProduct.id, updatedProduct);
      await loadProducts();
      closeEditModal();
      alert('✅ Товар обновлён');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!requireAuth('добавления в корзину')) return;
    try {
      await api.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      alert('✅ Добавлено в корзину!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ===== МНОЖЕСТВЕННЫЙ ВЫБОР =====
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const deleteSelected = async () => {
    if (!isAdmin) return;
    if (selectedProducts.length === 0) return;

    const confirmDelete = window.confirm(
      `Удалить ${selectedProducts.length} товаров?`
    );
    if (!confirmDelete) return;

    try {
      for (const id of selectedProducts) {
        await api.deleteProduct(id);
      }
      setSelectedProducts([]);
      await loadProducts();
      alert('✅ Товары удалены');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ===== ФИЛЬТРАЦИЯ + СОРТИРОВКА =====
  let filteredProducts = products.filter(product => {
    const nameEn = product.name?.en || '';
    const nameRu = product.name?.ru || '';
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      nameEn.toLowerCase().includes(searchLower) ||
      nameRu.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === 'all' ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Сортировка
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      (a.name?.en || '').localeCompare(b.name?.en || '')
    );
  }

  // ===== ПАГИНАЦИЯ =====
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Сброс страницы при фильтрации
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // ===== КАТЕГОРИИ =====
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'sofa', label: 'Sofa' },
    { key: 'living', label: 'Living' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'bedroom', label: 'Bedroom' },
    { key: 'bathroom', label: 'Bathroom' },
    { key: 'decor', label: 'Decor' },
    { key: 'ceramics', label: 'Ceramics' }
  ];

  return (
    <Container fluid className="py-4">
      {/* ===== ЗАГОЛОВОК ===== */}
      <div className="text-center mb-4">
        <h1 className="display-5">Our Catalog</h1>
        <p className="text-muted">Choose the perfect furniture for your home</p>
        {isAdmin && (
          <Badge bg="warning" text="dark" className="fs-6">
            👑 Режим администратора
          </Badge>
        )}
      </div>

      {/* ===== ПАНЕЛЬ УПРАВЛЕНИЯ ===== */}
      <div className="bg-light p-3 rounded mb-4 shadow-sm">
        <Row className="g-3">
          {/* Поиск */}
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search products..."
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

          {/* Сортировка */}
          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </Form.Select>
          </Col>

          {/* Кнопка "Выбрать все" (только для админа) */}
          {isAdmin && filteredProducts.length > 0 && (
            <Col md={3} className="d-flex align-items-center">
              <Button
                variant={selectedProducts.length === filteredProducts.length
                  ? 'danger' : 'outline-primary'}
                onClick={selectAll}
                className="w-100"
              >
                {selectedProducts.length === filteredProducts.length
                  ? '☐ Снять выделение'
                  : '☑ Выбрать все'}
              </Button>
            </Col>
          )}
        </Row>

        {/* Категории */}
        <ButtonGroup className="mt-3 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* ===== ПАНЕЛЬ МАССОВЫХ ДЕЙСТВИЙ ===== */}
      {isAdmin && selectedProducts.length > 0 && (
        <Alert variant="primary" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>✅ Выбрано: <strong>{selectedProducts.length}</strong> из {filteredProducts.length}</span>
          <div className="d-flex gap-2">
            <Button variant="danger" size="sm" onClick={deleteSelected}>
              🗑️ Удалить выбранные
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setSelectedProducts([])}>
              ✖ Отменить
            </Button>
          </div>
        </Alert>
      )}

      {/* ===== ПРЕДУПРЕЖДЕНИЕ ДЛЯ ГОСТЕЙ ===== */}
      {!isAuthenticated && (
        <Alert variant="warning">
          ℹ️ <a href="/register" className="alert-link">Войдите в аккаунт</a>,
          чтобы добавлять товары в корзину и избранное
        </Alert>
      )}

      {/* ===== ТОВАРЫ ===== */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка товаров...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>😕 Товары не найдены</h4>
          <p>Попробуйте изменить критерии поиска</p>
        </Alert>
      ) : (
        <>
          {/* Сетка товаров */}
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {paginatedProducts.map(product => (
              <Col key={product.id}>
                <div
                  className={`position-relative h-100 ${
                    isAdmin && selectedProducts.includes(product.id)
                      ? 'border border-primary border-3 rounded'
                      : ''
                  }`}
                  style={{ transition: 'all 0.3s' }}
                >
                  {/* Чекбокс */}
                  {isAdmin && (
                    <Form.Check
                      type="checkbox"
                      className="position-absolute"
                      style={{ top: '10px', left: '10px', zIndex: 10 }}
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  {/* Кнопка редактирования */}
                  {isAdmin && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="position-absolute rounded-circle"
                      style={{ top: '10px', right: '10px', zIndex: 10, width: '35px', height: '35px', padding: 0 }}
                      onClick={(e) => openEditModal(product, e)}
                      title="Редактировать"
                    >
                      ✏️
                    </Button>
                  )}

                  {/* Карточка */}
                  <div
                    onClick={() => openProductModal(product)}
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* ===== ПАГИНАЦИЯ ===== */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}

          {/* ===== СТАТИСТИКА ===== */}
          <p className="text-center text-muted mt-3">
            Показано: {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            {' '}из {filteredProducts.length} товаров
          </p>
        </>
      )}

      {/* ===== МОДАЛКИ ===== */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onAddToCart={handleAddToCart}
      />

      {isAdmin && (
        <EditProductModal
          product={editingProduct}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveProduct}
        />
      )}
    </Container>
  );
}

export default CatalogPage;