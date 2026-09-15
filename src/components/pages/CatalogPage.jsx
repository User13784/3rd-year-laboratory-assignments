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
import { useLanguage } from '../../context/LanguageContext';

function CatalogPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const requireAuth = (actionName) => {
    if (!isAuthenticated) {
      const goToLogin = window.confirm(`🔒 ${t('loginRequired')}: "${actionName}"\n\n${t('goToLoginConfirm')}`);
      if (goToLogin) navigate('/register');
      return false;
    }
    return true;
  };

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
      alert(t('adminRequired'));
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
      alert('✅ ' + t('productUpdated'));
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorUpdating'));
    }
  };

  const handleAddToCart = async (product) => {
    if (!requireAuth(t('addToCart'))) return;
    try {
      await api.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      alert('✅ ' + t('addedToCart'));
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
      `${t('confirmDelete')} ${selectedProducts.length} ${t('confirmDeleteEnd')}`
    );
    if (!confirmDelete) return;

    try {
      for (const id of selectedProducts) {
        await api.deleteProduct(id);
      }
      setSelectedProducts([]);
      await loadProducts();
      alert('✅ ' + t('productsDeleted'));
    } catch (error) {
      console.error('Error:', error);
      alert('❌ ' + t('errorDeleting'));
    }
  };

  let filteredProducts = products.filter(product => {
    const nameEn = product.name?.en || '';
    const nameRu = product.name?.ru || '';
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      nameEn.toLowerCase().includes(searchLower) ||
      nameRu.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const categories = [
    { key: 'all', label: t('catAll') },
    { key: 'sofa', label: t('catSofa') },
    { key: 'living', label: t('catLiving') },
    { key: 'kitchen', label: t('catKitchen') },
    { key: 'bedroom', label: t('catBedroom') },
    { key: 'bathroom', label: t('catBathroom') },
    { key: 'decor', label: t('catDecor') },
    { key: 'ceramics', label: t('catCeramics') }
  ];

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('ourCatalog')}</h1>
        <p className="text-muted">{t('catalogSubtitle')}</p>

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
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 10px rgba(255, 184, 0, 0.3)'
              }}
            >
              👑 {t('adminMode')}
            </span>
          </div>
        )}
      </div>

      <div className="bg-light p-3 rounded mb-4 shadow-sm">
        <Row className="g-3">
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
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>✖</Button>
              )}
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">{t('sortDefault')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="rating-desc">{t('sortRating')}</option>
              <option value="name-asc">{t('sortNameAsc')}</option>
            </Form.Select>
          </Col>

          {isAdmin && filteredProducts.length > 0 && (
            <Col md={3} className="d-flex align-items-center">
              <Button
                variant={selectedProducts.length === filteredProducts.length ? 'danger' : 'outline-primary'}
                onClick={selectAll}
                className="w-100"
              >
                {selectedProducts.length === filteredProducts.length ? t('deselectAll') : t('selectAll')}
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
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {isAdmin && selectedProducts.length > 0 && (
        <Alert variant="primary" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>✅ {t('selected')}: <strong>{selectedProducts.length}</strong> {t('of')} {filteredProducts.length}</span>
          <div className="d-flex gap-2">
            <Button variant="danger" size="sm" onClick={deleteSelected}>{t('deleteSelected')}</Button>
            <Button variant="secondary" size="sm" onClick={() => setSelectedProducts([])}>{t('cancel')}</Button>
          </div>
        </Alert>
      )}

      {!isAuthenticated && (
        <Alert variant="warning">
          ℹ️ <a href="/register" className="alert-link">{t('guestWarning')}</a>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{t('loadingProducts')}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>{t('noProducts')}</h4>
          <p>{t('noProductsHint')}</p>
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

                  <div
                    onClick={() => openProductModal(product)}
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <ProductCard product={product} />
                  </div>

                  {isAdmin && (
                    <button
                      className="edit-product-btn-center"
                      onClick={(e) => openEditModal(product, e)}
                      title={t('editProduct') || 'Редактировать'}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </Col>
            ))}
          </Row>

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

          <p className="text-center text-muted mt-3">
            {t('shown')}: {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            {' '}{t('of')} {filteredProducts.length} {t('products')}
          </p>
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
          onSave={handleSaveProduct}
        />
      )}
    </Container>
  );
}

export default CatalogPage;