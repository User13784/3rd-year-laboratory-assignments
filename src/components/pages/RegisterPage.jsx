import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { loginSuccess } from '../../features/auth/authSlice';
import { fetchCart } from '../../features/cart/cartSlice';
import { fetchFavorites } from '../../features/favorites/favoritesSlice';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const [key, setKey] = useState('login');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // ===== ВХОД =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginData.email || !loginData.password) {
      setLoginError('Заполните все поля');
      return;
    }

    setLoginLoading(true);
    try {
      const user = await api.loginUser(loginData.email);

      if (!user) {
        setLoginError('Пользователь с таким email не найден');
        setLoginLoading(false);
        return;
      }

      if (user.password !== loginData.password) {
        setLoginError('Неверный пароль');
        setLoginLoading(false);
        return;
      }

      // ✅ Сохраняем пользователя в Redux + localStorage
      dispatch(loginSuccess(user));

      // ✅ Загружаем корзину и избранное ТОЛЬКО этого пользователя
      await dispatch(fetchCart());
      await dispatch(fetchFavorites());

      navigate('/catalog');
      alert(
        user.role === 'admin'
          ? `👑 Добро пожаловать, ${user.firstName}!`
          : `✅ Добро пожаловать, ${user.firstName}!`
      );
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Ошибка входа. Проверьте сервер.');
    }
    setLoginLoading(false);
  };

  // ===== РЕГИСТРАЦИЯ =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerData.firstName || !registerData.lastName ||
        !registerData.email || !registerData.password) {
      setRegisterError('Заполните все поля');
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError('Пароль должен быть не менее 6 символов');
      return;
    }

    setRegisterLoading(true);
    try {
      const existing = await api.loginUser(registerData.email);
      if (existing) {
        setRegisterError('Email уже занят');
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

      // ✅ Сохраняем пользователя в Redux
      dispatch(loginSuccess(created));

      // ✅ Пустая корзина и избранное у нового пользователя
      await dispatch(fetchCart());
      await dispatch(fetchFavorites());

      navigate('/catalog');
      alert(`✅ Регистрация успешна! Добро пожаловать, ${created.firstName}!`);
    } catch (error) {
      console.error('Register error:', error);
      setRegisterError('Ошибка регистрации');
    }
    setRegisterLoading(false);
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow" style={{ maxWidth: '500px' }}>
        <Card.Header className="text-center bg-primary text-white">
          <h3 className="mb-0">🔐 Аккаунт</h3>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={key} onSelect={setKey} className="mb-4 justify-content-center">
            {/* ВХОД */}
            <Tab eventKey="login" title="Вход">
              <Form onSubmit={handleLogin}>
                {loginError && <Alert variant="danger">{loginError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
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
                  {loginLoading ? '⏳ Вход...' : 'Войти'}
                </Button>

                <div className="text-center mt-3 text-muted small">
                  Тестовый админ: <strong>admin@example.com</strong> / <strong>admin123</strong>
                  <br />
                  Тестовый юзер: <strong>user@example.com</strong> / <strong>user123</strong>
                </div>
              </Form>
            </Tab>

            {/* РЕГИСТРАЦИЯ */}
            <Tab eventKey="register" title="Регистрация">
              <Form onSubmit={handleRegister}>
                {registerError && <Alert variant="danger">{registerError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Иван"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Петров"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@mail.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Минимум 6 символов"
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
                  {registerLoading ? '⏳ Регистрация...' : 'Зарегистрироваться'}
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