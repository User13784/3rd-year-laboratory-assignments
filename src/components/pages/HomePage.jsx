import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Badge
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage({ title = "Best Furniture For Your Interior" }) {
  // ===== СЧЁТЧИКИ =====
  const [counters, setCounters] = useState({
    clients: 0,
    sold: 0,
    awards: 0,
    experience: 0
  });

  // ===== МЕДИАГАЛЕРЕЯ =====
  const galleryImages = [
    { src: '/assets/images/c1.jpg', name: 'Luxury Velvet Sofa' },
    { src: '/assets/images/c2.jpg', name: 'Modern L-Shaped Sofa' },
    { src: '/assets/images/c3.jpg', name: 'Classic Leather Sofa' },
    { src: '/assets/images/c4.jpg', name: 'Coffee Table' },
    { src: '/assets/images/c5.jpg', name: 'Dining Table Set' }
  ];

  // ===== АНИМАЦИЯ СЧЁТЧИКОВ =====
  useEffect(() => {
    const targets = { clients: 5000, sold: 1200, awards: 150, experience: 24 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters({
        clients: Math.floor(targets.clients * eased),
        sold: Math.floor(targets.sold * eased),
        awards: Math.floor(targets.awards * eased),
        experience: Math.floor(targets.experience * eased)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ===== HERO СЕКЦИЯ С CAROUSEL ===== */}
      <Container fluid className="p-0 mb-5">
        <Carousel fade>
          <Carousel.Item>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #0a1a1f 0%, #1A3E45 30%, #264A51 60%, #3C6C7F 100%)'
              }}
            >
              <div className="text-center px-3">
                <p className="fs-4 fst-italic text-info">Save The Weekend</p>
                <h1 className="display-3 fw-bold">Awesome design</h1>
                <h2 className="display-5 mb-4">{title}</h2>
                <Button as={Link} to="/catalog" variant="info" size="lg">
                  Explore More
                </Button>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #264A51 0%, #3C6C7F 50%, #71B3C6 100%)'
              }}
            >
              <div className="text-center px-3">
                <p className="fs-4 fst-italic">Best quality</p>
                <h1 className="display-3 fw-bold">Modern Furniture</h1>
                <h2 className="display-5 mb-4">For Your Home</h2>
                <Button as={Link} to="/catalog" variant="light" size="lg">
                  View Collection
                </Button>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #1A3E45 0%, #3C6C7F 50%, #8cc4d6 100%)'
              }}
            >
              <div className="text-center px-3">
                <p className="fs-4 fst-italic">Special offer</p>
                <h1 className="display-3 fw-bold">50% OFF</h1>
                <h2 className="display-5 mb-4">This Weekend Only</h2>
                <Button as={Link} to="/catalog" variant="danger" size="lg">
                  Shop Now
                </Button>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* ===== СЧЁТЧИКИ ===== */}
      <Container className="mb-5">
        <Row className="g-4 text-center">
          {[
            { value: counters.clients, label: 'Happy Clients', icon: '😊' },
            { value: counters.sold, label: 'Sold Items', icon: '📦' },
            { value: counters.awards, label: 'Awards', icon: '🏆' },
            { value: counters.experience, label: 'Years Experience', icon: '📅' }
          ].map((item, idx) => (
            <Col xs={6} md={3} key={idx}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="fs-1">{item.icon}</div>
                  <h2 className="display-4 text-primary fw-bold">{item.value}</h2>
                  <p className="text-muted mb-0">{item.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ===== НАШИ ТОВАРЫ ===== */}
      <Container className="mb-5">
        <div className="text-center mb-4">
          <h1 className="display-5">Our Products</h1>
          <p className="text-muted">Choose the perfect furniture for your home</p>
        </div>

        <Row xs={1} sm={2} md={3} className="g-4">
          {[
            { title: 'Sofas', img: '/assets/images/c1.jpg', category: 'sofa' },
            { title: 'Living Room', img: '/assets/images/c4.jpg', category: 'living' },
            { title: 'Kitchen', img: '/assets/images/c5.jpg', category: 'kitchen' },
            { title: 'Bedroom', img: '/assets/images/c7.jpg', category: 'bedroom' },
            { title: 'Bathroom', img: '/assets/images/c9.jpg', category: 'bathroom' },
            { title: 'Decor', img: '/assets/images/c10.jpg', category: 'decor' }
          ].map((cat, idx) => (
            <Col key={idx}>
              <Card className="h-100 shadow-sm text-center">
                <Card.Img
                  variant="top"
                  src={cat.img}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                />
                <Card.Body>
                  <Card.Title>{cat.title}</Card.Title>
                  <Button
                    as={Link}
                    to={`/catalog?category=${cat.category}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    View Items
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ===== МЕДИАГАЛЕРЕЯ ===== */}
      <Container className="mb-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-4">🎵 Media Gallery</h2>

            <Carousel variant="dark">
              {galleryImages.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100"
                    src={img.src}
                    alt={img.name}
                    style={{ height: '400px', objectFit: 'contain', background: '#f5f7fa' }}
                    onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                  />
                  <Carousel.Caption>
                    <Badge bg="primary" className="fs-6">{img.name}</Badge>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Card.Body>
        </Card>
      </Container>

      {/* ===== ПРОМО-СЕКЦИЯ ===== */}
      <Container className="mb-5">
        <Card
          className="text-white border-0"
          style={{
            background: 'linear-gradient(135deg, #1A3E45 0%, #264A51 100%)',
            minHeight: '300px'
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-5">
            <h1 className="display-3 fw-bold text-warning">50% OFF</h1>
            <h2 className="display-5 mb-3">Weekend Trendy Sofa</h2>
            <p className="lead mb-4">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
            </p>
            <Button as={Link} to="/catalog" variant="warning" size="lg">
              View Items
            </Button>
          </Card.Body>
        </Card>
      </Container>

      {/* ===== КАРТА ===== */}
      <Container className="mb-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-4">📍 Location</h2>
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded"
              style={{ height: '400px' }}
            >
              <div className="text-center">
                <div className="fs-1">🗺️</div>
                <p className="text-muted">Карта: Minsk, Nemiga 5</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default HomePage;