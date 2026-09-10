import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // ===== СОСТОЯНИЯ =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setLoading(false);
  };

  const requireAuth = (actionName) => {
    if (!isAuthenticated) {
      const goToLogin = window.confirm(`${t('loginRequired')}\n\n${t('goToLogin')}`);
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
    if (!isAdmin) {
      alert(t('adminRequired'));
      return;
    }
    try {
      await api.updateProduct(updatedProduct.id, updatedProduct);
      await loadProducts();
      closeEditModal();
      alert(t('productUpdated'));
    } catch (error) {
      console.error('Error updating product:', error);
      alert(t('errorUpdatingProduct'));
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
      alert(t('addedToCart'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(t('errorAddingToCart'));
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
    if (!isAdmin) {
      alert(t('adminRequired'));
      return;
    }
    if (selectedProducts.length === 0) return;

    const confirmDelete = window.confirm(
      `${t('deleteConfirm')} ${selectedProducts.length} ${t('deleteConfirmEnd')}`
    );
    if (!confirmDelete) return;

    try {
      for (const id of selectedProducts) {
        await api.deleteProduct(id);
      }
      setSelectedProducts([]);
      await loadProducts();
      alert(t('productsDeleted'));
    } catch (error) {
      console.error('Error deleting products:', error);
      alert(t('errorDeletingProducts'));
    }
  };

  const filteredProducts = products.filter(product => {
    const nameEn = product.name?.en || '';
    const nameRu = product.name?.ru || '';
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = nameEn.toLowerCase().includes(searchLower) ||
                          nameRu.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'sofa', 'living', 'kitchen', 'bedroom', 'bathroom', 'decor', 'ceramics'];

  const getCategoryLabel = (cat) => {
    const keys = {
      all: 'catAll', sofa: 'catSofa', living: 'catLiving', kitchen: 'catKitchen',
      bedroom: 'catBedroom', bathroom: 'catBathroom', decor: 'catDecor', ceramics: 'catCeramics'
    };
    return t(keys[cat] || cat);
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>{t('ourCatalog')}</h1>
        <p>{t('catalogSubtitle')}</p>
        {isAdmin && <div className="admin-badge">{t('adminMode')}</div>}
      </div>

      <div className="control-panel">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-row">
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {isAdmin && filteredProducts.length > 0 && (
            <button className="select-all-btn" onClick={selectAll}>
              {selectedProducts.length === filteredProducts.length
                ? t('deselectAll')
                : t('selectAll')}
            </button>
          )}
        </div>
      </div>

      {isAdmin && selectedProducts.length > 0 && (
        <div className="bulk-actions">
          <span>{t('selected')}: {selectedProducts.length} {t('outOf')} {filteredProducts.length}</span>
          <button onClick={deleteSelected} className="delete-selected-btn">
            {t('deleteSelected')}
          </button>
          <button onClick={() => setSelectedProducts([])} className="cancel-btn">
            {t('cancel')}
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="guest-warning">
          ℹ️ <a href="/register">{t('guestWarning')}</a>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t('loadingProducts')}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results">
          <h2>{t('noProducts')}</h2>
          <p>{t('noProductsHint')}</p>
        </div>
      ) : (
        <>
          <div className="catalog-container">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`product-wrapper ${isAdmin && selectedProducts.includes(product.id) ? 'selected' : ''}`}
              >
                {isAdmin && (
                  <input
                    type="checkbox"
                    className="product-checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                {isAdmin && (
                  <button
                    className="edit-product-btn"
                    onClick={(e) => openEditModal(product, e)}
                    title={t('editProduct')}
                  >
                    ✏️
                  </button>
                )}

                <div onClick={() => openProductModal(product)}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          <div className="catalog-stats">
            {t('shown')}: {filteredProducts.length} {t('outOf')} {products.length} {t('products')}
          </div>
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
    </div>
  );
}

export default CatalogPage;