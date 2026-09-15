import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchFavorites,
  selectFavorites,
  selectFavoritesLoading
} from '../../features/favorites/favoritesSlice';
import ProductCard from '../product/ProductCard';

function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const loading = useAppSelector(selectFavoritesLoading);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  // Преобразуем данные избранного в формат ProductCard
  const formattedFavorites = favorites.map(item => ({
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

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Загрузка...</p>
      </Container>
    );
  }

  if (formattedFavorites.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>😔 В избранном пусто</h2>
          <p>Добавляйте товары в избранное</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          🛍️ В каталог
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">❤️ Избранное</h1>
        <p className="text-muted">Ваши любимые товары</p>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#c62828',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            marginTop: '15px'
          }}
        >
          ❤️ {formattedFavorites.length} товаров
        </span>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {formattedFavorites.map(item => (
          <Col key={item.id}>
            <ProductCard product={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FavoritesPage;