import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5 py-4 rounded">
      <Container>
        <Row className="g-4">
          {/* ===== КОЛОНКА 1: О НАС ===== */}
          <Col md={6} lg={3}>
            <h5 className="text-info">🌿 Greenery</h5>
            <p className="small">
              Best furniture for your interior.
              Quality and style since 2000.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="text-light text-decoration-none fs-4" title="Facebook">📘</a>
              <a href="#" className="text-light text-decoration-none fs-4" title="Instagram">📷</a>
              <a href="#" className="text-light text-decoration-none fs-4" title="Twitter">🐦</a>
              <a href="#" className="text-light text-decoration-none fs-4" title="YouTube">📺</a>
            </div>
          </Col>

          {/* ===== КОЛОНКА 2: НАВИГАЦИЯ ===== */}
          <Col md={6} lg={3}>
            <h5 className="text-info">Explore</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  🏠 Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalog" className="text-light text-decoration-none">
                  🛍️ Catalog
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/favorites" className="text-light text-decoration-none">
                  ❤️ Favorites
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/feedback" className="text-light text-decoration-none">
                  💬 Reviews
                </Link>
              </li>
            </ul>
          </Col>

          {/* ===== КОЛОНКА 3: КОНТАКТЫ ===== */}
          <Col md={6} lg={3}>
            <h5 className="text-info">Contacts</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">📍 Minsk, Nemiga 5</li>
              <li className="mb-2">📞 +375 (29) 123-45-67</li>
              <li className="mb-2">✉️ info@greenery.com</li>
            </ul>
          </Col>

          {/* ===== КОЛОНКА 4: ЧАСЫ РАБОТЫ ===== */}
          <Col md={6} lg={3}>
            <h5 className="text-info">Working Hours</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">Mon-Fri: 09:00 - 19:00</li>
              <li className="mb-2">Saturday: 10:00 - 18:00</li>
              <li className="mb-2">Sunday: Closed</li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <div className="text-center small">
          © {currentYear} Greenery. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;