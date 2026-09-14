import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ProductCard from '../product/ProductCard';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

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
        <p className="mt-3">Загрузка избранного...</p>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">
          <h2>😔 Favorites is empty</h2>
          <p>Add items to favorites to see them here</p>
        </Alert>
        <Button as={Link} to="/catalog" variant="primary" size="lg">
          🛍️ Go to catalog
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">❤️ Favorites</h1>
        <p className="text-muted">Your favorite items</p>
        <Badge bg="danger">{favorites.length} items</Badge>
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