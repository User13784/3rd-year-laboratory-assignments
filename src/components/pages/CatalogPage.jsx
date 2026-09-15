import React, { useEffect, useState } from 'react';
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
import AddProductModal from '../product/AddProductModal';
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

  // ===== LOCAL STATE =====
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
      alert('❌ Ошибка добавления');
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
      alert('❌ Ошибка удаления');
    }
  };

  // ===== ПАГИНАЦИЯ =====
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // ===== КАТЕГОРИИ =====
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
      {/* ===== ЗАГОЛОВОК ===== */}
      <div className="text-center mb-4">
        <h1 className="display-5">{t('ourCatalog') || 'Наш Каталог'}</h1>
        <p className="text-muted">{t('catalogSubtitle') || 'Выберите идеальную мебель'}</p>

        {isAdmin && (
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
              👑 {t('adminMode') || 'Режим администратора'}
            </span>
          </div>
        )}
      </div>

      {/* ===== ПАНЕЛЬ УПРАВЛЕНИЯ ===== */}
      <div className="bg-light p-3 rounded mb-4 shadow-sm">
        <Row className="g-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('searchPlaceholder') || '🔍 Поиск товаров...'}
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => dispatch(setSearchTerm(''))}
                >
                  ✖
                </Button>
              )}
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
            >
              <option value="default">Сортировка: по умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="rating-desc">Рейтинг: по убыванию</option>
            </Form.Select>
          </Col>

          {isAdmin && products.length > 0 && (
            <Col md={3} className="d-flex align-items-center">
              <Button
                variant={selectedProducts.length === products.length ? 'danger' : 'outline-primary'}
                onClick={selectAll}
                className="w-100"
              >
                {selectedProducts.length === products.length
                  ? '☐ Снять выделение'
                  : '☑ Выбрать все'}
              </Button>
            </Col>
          )}
        </Row>

        {/* Категории + кнопка добавления */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
          <ButtonGroup className="flex-wrap">
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

          {isAdmin && (
            <Button
              variant="success"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              ➕ Добавить товар
            </Button>
          )}
        </div>
      </div>

      {/* ===== ПАНЕЛЬ МАССОВЫХ ДЕЙСТВИЙ ===== */}
      {isAdmin && selectedProducts.length > 0 && (
        <Alert
          variant="primary"
          className="d-flex justify-content-between align-items-center flex-wrap gap-2"
        >
          <span>
            ✅ Выбрано: <strong>{selectedProducts.length}</strong> из {products.length}
          </span>
          <div className="d-flex gap-2">
            <Button variant="danger" size="sm" onClick={deleteSelected}>
              🗑️ Удалить выбранные
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedProducts([])}
            >
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

      {/* ===== СПИСОК ТОВАРОВ ===== */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка товаров...</p>
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>😕 Товары не найдены</h4>
          <p>Попробуйте изменить критерии поиска</p>
        </Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {paginatedProducts.map(product => (
              <Col key={product.id}>
                <div
                  className={`position-relative h-100 product-wrapper-admin ${
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

                  {/* Карточка */}
                  <div
                    onClick={() => openProductModal(product)}
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <ProductCard product={product} />
                  </div>

                  {/* Кнопка редактирования по центру при наведении */}
                  {isAdmin && (
                    <button
                      className="edit-product-btn-center"
                      onClick={(e) => openEditModal(product, e)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                  )}
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
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}

          {/* ===== СТАТИСТИКА ===== */}
          <p className="text-center text-muted mt-3">
            Показано: {startIndex + 1}–{Math.min(startIndex + itemsPerPage, products.length)}{' '}
            из {products.length} товаров
          </p>
        </>
      )}

      {/* ===== МОДАЛЬНЫЕ ОКНА ===== */}
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

      {isAdmin && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </Container>
  );
}

export default CatalogPage;