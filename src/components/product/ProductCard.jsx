import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../common/Notification';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t, lang } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();

  const getTranslatedName = () => {
    const currentLang = lang || localStorage.getItem('language') || 'en';
    if (!product.name) return 'Product';
    if (typeof product.name === 'string') return product.name;
    return product.name[currentLang] || product.name.en || 'Product';
  };

  const getTranslatedCategory = () => {
    const catMap = {
      sofa: 'catSofa',
      living: 'catLiving',
      kitchen: 'catKitchen',
      bedroom: 'catBedroom',
      bathroom: 'catBathroom',
      decor: 'catDecor',
      ceramics: 'catCeramics'
    };
    const key = catMap[product.category];
    return key ? t(key) : (product.category || 'General');
  };

  const requireAuth = (actionName) => {
    if (!isAuthenticated) {
      showWarning(`🔒 ${t('loginRequired')}: "${actionName}"`);
      setTimeout(() => {
        const goToLogin = window.confirm(t('goToLoginConfirm'));
        if (goToLogin) navigate('/register');
      }, 500);
      return false;
    }
    return true;
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!requireAuth(t('favorites'))) return;

    try {
      if (isFavorite) {
        const favorites = await api.getFavorites();
        const favItem = favorites.find(f => f.productId === product.id);
        if (favItem) await api.removeFromFavorites(favItem.id);
        setIsFavorite(false);
        showSuccess(`❤️ "${getTranslatedName()}" ${t('removedFromFavorites')}`);
      } else {
        await api.addToFavorites({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating || 5
        });
        setIsFavorite(true);
        showSuccess(`❤️ "${getTranslatedName()}" ${t('addedToFavorites')}`);
      }
    } catch (error) {
      console.error('Error:', error);
      showError(t('errorFavorite'));
    }
  };

  const addToCart = async (e) => {
    e.stopPropagation();
    if (!requireAuth(t('cart'))) return;

    try {
      await api.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      showSuccess(`🛒 "${getTranslatedName()}" ${t('addedToCart')}`);
    } catch (error) {
      console.error('Error:', error);
      showError(t('errorCart'));
    }
  };

  const generateStars = (rating) => {
    const stars = rating || 5;
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += i < Math.floor(stars) ? '★' : '☆';
    }
    return result;
  };

  if (!product) return null;

  return (
    <>
      <Card className="h-100 shadow-sm product-card-bs">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={product.image || '/assets/images/placeholder.jpg'}
            alt={getTranslatedName()}
            style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
            onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
          />

          <Button
            variant={isFavorite ? 'danger' : 'light'}
            size="sm"
            className="position-absolute top-0 end-0 m-2 rounded-circle"
            onClick={toggleFavorite}
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              zIndex: 10
            }}
            title={isFavorite ? t('favorites') : t('addToFavorites')}
          >
            {isFavorite ? '❤️' : '🤍'}
          </Button>

          {product.rating >= 4.5 && (
            <span
              className="position-absolute top-0 start-0 bg-warning text-dark fw-bold"
              style={{
                fontSize: '11px',
                padding: '5px 10px',
                borderRadius: '10px',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                marginTop: '12px',
                marginLeft: '12px',
                zIndex: 5,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {t('topProduct')}
            </span>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="fs-6">{getTranslatedName()}</Card.Title>

          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#71B3C6',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                lineHeight: '1.4'
              }}
            >
              {getTranslatedCategory()}
            </span>
          </div>

          <Card.Text className="text-primary fw-bold fs-5 mb-2">
            £{(product.price || 0).toFixed(2)}
          </Card.Text>

          <div className="text-warning mb-2" style={{ letterSpacing: '2px' }}>
            {generateStars(product.rating)}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                backgroundColor: product.inStock ? '#2e7d32' : '#c62828',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                lineHeight: '1.4'
              }}
            >
              {product.inStock ? t('inStock') : t('outOfStock')}
            </span>
          </div>

          <Button
            variant="primary"
            className="mt-auto w-100"
            onClick={addToCart}
            disabled={!product.inStock}
          >
            🛒 {t('addToCart')}
          </Button>
        </Card.Body>
      </Card>

      <Notification
        show={notification.show}
        message={notification.message}
        variant={notification.variant}
        title={notification.title}
        onClose={hideNotification}
      />
    </>
  );
}

export default ProductCard;