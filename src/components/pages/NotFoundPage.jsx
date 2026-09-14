import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <h1
            className="display-1 fw-bold"
            style={{
              background: 'linear-gradient(135deg, #264A51, #71B3C6, #264A51)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '10rem'
            }}
          >
            404
          </h1>

          <h2 className="mb-3">Страница не найдена</h2>

          <p className="text-muted mb-4">
            Извините, страница, которую вы ищете,
            не существует или была перемещена.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/" variant="primary" size="lg">
              🏠 На главную
            </Button>
            <Button as={Link} to="/catalog" variant="outline-primary" size="lg">
              🛍️ В каталог
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundPage;