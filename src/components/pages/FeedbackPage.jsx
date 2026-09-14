import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Alert,
  Spinner
} from 'react-bootstrap';
import { api } from '../../services/api';

function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await api.getFeedback();
      setFeedback(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const getTranslatedText = (text) => {
    const lang = localStorage.getItem('language') || 'en';
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[lang] || text.en || '';
  };

  const getTranslatedProductName = (name) => {
    const lang = localStorage.getItem('language') || 'en';
    if (!name) return 'Product';
    if (typeof name === 'string') return name;
    return name[lang] || name.en || 'Product';
  };

  const generateStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < Math.floor(rating || 5) ? '★' : '☆';
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка отзывов...</p>
      </Container>
    );
  }

  // ===== СРЕДНИЙ РЕЙТИНГ =====
  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, r) => sum + (r.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">⭐ Customer Reviews</h1>
        <p className="text-muted">Share your opinion about products</p>

        {/* Статистика */}
        {feedback.length > 0 && (
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Badge bg="primary" className="fs-6">
              Всего отзывов: {feedback.length}
            </Badge>
            <Badge bg="warning" text="dark" className="fs-6">
              Средний рейтинг: {avgRating} ⭐
            </Badge>
          </div>
        )}
      </div>

      {feedback.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>💬 No reviews yet</h4>
          <p>Be the first to leave a review!</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {feedback.map(review => (
            <Col key={review.id}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                      style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
                    >
                      {(review.userNickname || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-bold">{review.userNickname || 'Пользователь'}</div>
                      <small className="text-muted">
                        {formatDate(review.createdAt)}
                      </small>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Badge bg="info" className="mb-2">
                    📦 {getTranslatedProductName(review.productName)}
                  </Badge>

                  <div className="text-warning fs-5 mb-2">
                    {generateStars(review.rating)}
                  </div>

                  <Card.Text>
                    {getTranslatedText(review.text)}
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="text-muted">
                  <small>Rating: {review.rating} / 5</small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default FeedbackPage;