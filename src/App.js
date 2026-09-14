import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Dropdown,
  ButtonGroup
} from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import CatalogPage from './components/pages/CatalogPage';
import CartPage from './components/pages/CartPage';
import FavoritesPage from './components/pages/FavoritesPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AdminPage from './components/pages/AdminPage';
import RegisterPage from './components/pages/RegisterPage';
import NotFoundPage from './components/pages/NotFoundPage';
import './App.css';

// ===== ШАПКА =====
function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirm'))) {
      logout();
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-lg-none">
          🌿 Greenery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-nav" />
        <Navbar.Collapse id="header-nav">
          {/* ===== ЛЕВАЯ ЧАСТЬ ===== */}
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="d-flex align-items-center me-3">
                  <img
                    src="/assets/icons/human.png"
                    alt="user"
                    width="20"
                    height="20"
                    className="me-2"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {user.firstName || user.email}
                  {isAdmin && <Badge bg="warning" text="dark" className="ms-2">👑 Admin</Badge>}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  🚪 {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">
                  <img
                    src="/assets/icons/human.png"
                    alt="login"
                    width="18"
                    height="18"
                    className="me-1"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {t('login')}
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <img
                    src="/assets/icons/door.png"
                    alt="signup"
                    width="18"
                    height="18"
                    className="me-1"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  {t('signup')}
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* ===== ПРАВАЯ ЧАСТЬ ===== */}
          <Nav className="align-items-center">
            <Nav.Link href="#">
              📧 {t('mailing')}
            </Nav.Link>

            <Nav.Link as={Link} to="/cart">
              🛒 {t('cart')}
              <Badge bg="danger" pill className="ms-1">0</Badge>
            </Nav.Link>

            {/* Кнопки языка и темы */}
            <ButtonGroup size="sm" className="ms-2">
              <Button variant="outline-light" onClick={toggleLanguage}>
                {lang === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
              </Button>
              <Button variant="outline-light" onClick={toggleTheme}>
                {isDark ? '☀️' : '🌙'}
              </Button>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// ===== ГЛАВНЫЙ КОМПОНЕНТ =====
function App() {
  const companyName = "Greenery";
  const mainTitle = "Best Furniture For Your Interior";

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="app-container d-flex">
              <Sidebar companyName={companyName} />
              <main className="main-content flex-grow-1 p-3">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage title={mainTitle} />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
              </main>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;