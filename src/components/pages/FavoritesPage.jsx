import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ProductCard from '../product/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

function FavoritesPage() {
  const { t, lang } = useLanguage();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [lang]);

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      const formattedFavorites = data.map(item => ({
        id: item.productId,
        name: item.name || { en: 'Product', ru: 'Товар' },
        price: item.price || 0,
        image: item.image || '/assets/images/placeholder.jpg',
        category: item.category || 'General',
        rating: item.rating || 5,
        inStock: item.inStock !== undefined ? item.inStock : true,
        description: item.description || { en: '', ru: '' },
        isFavorite: true
      }));
      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">{t('loadingProducts')}</p>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>{t('emptyFavorites')}</h2>
          <p>{t('emptyFavoritesHint')}</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          {t('goToCatalog')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">{t('favoritesTitle')}</h1>
        <p className="text-muted">{t('favoritesSubtitle')}</p>

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
              backgroundColor: '#c62828',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(198, 40, 40, 0.3)'
            }}
          >
            ❤️ {favorites.length} {t('items')}
          </span>
        </div>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {favorites.map(item => (
          <Col key={item.id}>
            <ProductCard product={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FavoritesPage;