import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Form, Button, Badge, Alert,
  Spinner, ButtonGroup, InputGroup, Pagination
} from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchProducts,
  deleteProductAsync,
  selectFilteredProducts,
  selectProductsLoading,
  selectSearchTerm,
  selectCategory,
  selectSortBy,
  setSearchTerm,
  setCategory,
  setSortBy
} from '../../features/products/productsSlice';
import { addToCartAsync, selectCartItems } from '../../features/cart/cartSlice';
import { selectIsAdmin, selectIsAuthenticated } from '../../features/auth/authSlice';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import EditProductModal from '../product/EditProductModal';
import { useLanguage } from '../../context/LanguageContext';

function CatalogPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  // ===== REDUX STATE =====
  const products = useAppSelector(selectFilteredProducts);
  const loading = useAppSelector(selectProductsLoading);
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedCategory = useAppSelector(selectCategory);
  const sortBy = useAppSelector(selectSortBy);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItems = useAppSelector(selectCartItems);

  // ===== LOCAL STATE (модалки + множественный выбор) =====
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
    dispatch(fetchProducts());
  }, [dispatch]);

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
      alert(t('adminRequired') || 'Только для админа');
      return;
    }
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      alert('🔒 Войдите в аккаунт');
      return;
    }

    try {
      const existing = cartItems.find(i => i.productId === product.id);
      if (existing) {
        alert('Товар уже в корзине');
        return;
      }
      await dispatch(addToCartAsync({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })).unwrap();
      alert('✅ Добавлено в корзину!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ===== МНОЖЕСТВЕННЫЙ ВЫБОР =====
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const selectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const deleteSelected = async () => {
    if (!isAdmin) return;
    if (selectedProducts.length === 0) return;

    if (!window.confirm(`Удалить ${selectedProducts.length} товаров?`)) return;

    try {
      for (const id of selectedProducts) {
        await dispatch(deleteProductAsync(id)).unwrap();
      }
      setSelectedProducts([]);
      alert('✅ Товары удалены');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ===== ПАГИНАЦИЯ =====
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const categories = [
    { key: 'all', label: t('catAll') || 'Все' },
    { key: 'sofa', label: t('catSofa') || 'Диваны' },
    { key: 'living', label: t('catLiving') || 'Гостиная' },
    { key: 'kitchen', label: t('catKitchen') || 'Кухня' },
    { key: 'bedroom', label: t('catBedroom') || 'Спальня' },
    { key: 'bathroom', label: t('catBathroom') || 'Ванная' },
    { key: 'decor', label: t('catDecor') || 'Декор' },
    { key: 'ceramics', label: t('catCeramics') || 'Керамика' }
  ];

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('ourCatalog') || 'Наш Каталог'}</h1>
        <p className="text-muted">{t('catalogSubtitle') || 'Выберите идеальную мебель'}</p>
        {isAdmin && (
          <Badge bg="warning" text="dark" className="fs-6">
            👑 {t('adminMode') || 'Режим администратора'}
          </Badge>
        )}
      </div>

      <div className="bg-light p-3 rounded mb-4 shadow-sm">
        <Row className="g-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('searchPlaceholder') || '🔍 Поиск...'}
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
              {searchTerm && (
                <Button variant="outline-secondary" onClick={() => dispatch(setSearchTerm(''))}>✖</Button>
              )}
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
              <option value="default">Сортировка: по умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="rating-desc">Рейтинг: по убыванию</option>
            </Form.Select>
          </Col>

          {isAdmin && products.length > 0 && (
            <Col md={3}>
              <Button
                variant={selectedProducts.length === products.length ? 'danger' : 'outline-primary'}
                onClick={selectAll}
                className="w-100"
              >
                {selectedProducts.length === products.length ? '☐ Снять' : '☑ Выбрать все'}
              </Button>
            </Col>
          )}
        </Row>

        <ButtonGroup className="mt-3 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => dispatch(setCategory(cat.key))}
            >
              {cat.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {isAdmin && selectedProducts.length > 0 && (
        <Alert variant="primary" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>✅ Выбрано: <strong>{selectedProducts.length}</strong> из {products.length}</span>
          <div className="d-flex gap-2">
            <Button variant="danger" size="sm" onClick={deleteSelected}>🗑️ Удалить</Button>
            <Button variant="secondary" size="sm" onClick={() => setSelectedProducts([])}>✖ Отмена</Button>
          </div>
        </Alert>
      )}

      {!isAuthenticated && (
        <Alert variant="warning">
          ℹ️ <a href="/register" className="alert-link">Войдите в аккаунт</a>, чтобы добавлять товары
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка...</p>
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>😕 Товары не найдены</h4>
        </Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {paginatedProducts.map(product => (
              <Col key={product.id}>
                <div
                  className={`position-relative h-100 ${
                    isAdmin && selectedProducts.includes(product.id)
                      ? 'border border-primary border-3 rounded'
                      : ''
                  }`}
                >
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

                  <div onClick={() => openProductModal(product)} style={{ cursor: 'pointer', height: '100%' }}>
                    <ProductCard product={product} />
                  </div>

                  {isAdmin && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="position-absolute rounded-circle"
                      style={{ top: '10px', right: '10px', zIndex: 10, width: '35px', height: '35px', padding: 0 }}
                      onClick={(e) => openEditModal(product, e)}
                    >
                      ✏️
                    </Button>
                  )}
                </div>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
              </Pagination>
            </div>
          )}
        </>
      )}

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
        />
      )}
    </Container>
  );
}

export default CatalogPage;