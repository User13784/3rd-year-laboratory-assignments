import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { loginSuccess } from '../../features/auth/authSlice';
import { fetchCart } from '../../features/cart/cartSlice';
import { fetchFavorites } from '../../features/favorites/favoritesSlice';
import { api } from '../../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [key, setKey] = useState('login');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginData.email || !loginData.password) {
      setLoginError(t('fillFields'));
      return;
    }

    setLoginLoading(true);
    try {
      const user = await api.loginUser(loginData.email);

      if (!user) {
        setLoginError(t('userNotFound'));
        setLoginLoading(false);
        return;
      }

      if (user.password !== loginData.password) {
        setLoginError(t('wrongPassword'));
        setLoginLoading(false);
        return;
      }

      dispatch(loginSuccess(user));
      await dispatch(fetchCart());
      await dispatch(fetchFavorites());

      navigate('/catalog');
      alert(
        user.role === 'admin'
          ? `${t('welcomeAdmin')}, ${user.firstName}!`
          : `${t('welcomeUser')}, ${user.firstName}!`
      );
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(t('loginError'));
    }
    setLoginLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerData.firstName || !registerData.lastName ||
        !registerData.email || !registerData.password) {
      setRegisterError(t('fillFields'));
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError(t('passwordMin'));
      return;
    }

    setRegisterLoading(true);
    try {
      const existing = await api.loginUser(registerData.email);
      if (existing) {
        setRegisterError(t('emailTaken'));
        setRegisterLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        ...registerData,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      const created = await api.registerUser(newUser);

      dispatch(loginSuccess(created));
      await dispatch(fetchCart());
      await dispatch(fetchFavorites());

      navigate('/catalog');
      alert(`${t('registerSuccess')}, ${created.firstName}!`);
    } catch (error) {
      console.error('Register error:', error);
      setRegisterError(t('registerError'));
    }
    setRegisterLoading(false);
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow" style={{ maxWidth: '500px' }}>
        <Card.Header className="text-center bg-primary text-white">
          <h3 className="mb-0">{t('account')}</h3>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={key} onSelect={setKey} className="mb-4 justify-content-center">
            <Tab eventKey="login" title={t('loginTab')}>
              <Form onSubmit={handleLogin}>
                {loginError && <Alert variant="danger">{loginError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('password')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('password')}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loginLoading}
                >
                  {loginLoading ? t('loadingLogin') : t('loginBtn')}
                </Button>

                <div className="text-center mt-3 text-muted small">
                  {t('testAdmin')}: <strong>admin@example.com</strong> / <strong>admin123</strong>
                  <br />
                  {t('testUser')}: <strong>user@example.com</strong> / <strong>user123</strong>
                </div>
              </Form>
            </Tab>

            <Tab eventKey="register" title={t('registerTab')}>
              <Form onSubmit={handleRegister}>
                {registerError && <Alert variant="danger">{registerError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>{t('firstName')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Иван"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('lastName')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Петров"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@mail.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('password')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('passwordMin')}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100"
                  disabled={registerLoading}
                >
                  {registerLoading ? t('loadingRegister') : t('registerBtn')}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;