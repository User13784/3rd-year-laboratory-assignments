import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [key, setKey] = useState('login');   // 'login' или 'register'

  // ===== ФОРМА ВХОДА =====
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ===== ФОРМА РЕГИСТРАЦИИ =====
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // ===== ОБРАБОТЧИКИ =====
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setLoginError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    setRegisterError('');
  };

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
      login(user);
      navigate('/catalog');
      alert(`👑 Добро пожаловать, ${user.firstName}!`);
    } catch (error) {
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
      login(created);
      navigate('/catalog');
      alert(`✅ Регистрация успешна! Добро пожаловать, ${created.firstName}!`);
    } catch (error) {
      setRegisterError('Ошибка регистрации');
    }
    setRegisterLoading(false);
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow" style={{ maxWidth: '500px' }}>
        <Card.Header className="text-center bg-primary text-white">
          <h3 className="mb-0">🔐 Account</h3>
        </Card.Header>

        <Card.Body>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4 justify-content-center"
          >
            {/* ===== ВКЛАДКА ВХОДА ===== */}
            <Tab eventKey="login" title="Login">
              <Form onSubmit={handleLogin}>
                {loginError && <Alert variant="danger">{loginError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Введите пароль"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loginLoading}
                >
                  {loginLoading ? '⏳ Вход...' : 'Login'}
                </Button>

                <div className="text-center mt-3 text-muted small">
                  Тестовый админ: <strong>admin@example.com</strong> / <strong>admin123</strong>
                </div>
              </Form>
            </Tab>

            {/* ===== ВКЛАДКА РЕГИСТРАЦИИ ===== */}
            <Tab eventKey="register" title="Register">
              <Form onSubmit={handleRegister}>
                {registerError && <Alert variant="danger">{registerError}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Иван"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Петров"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Минимум 6 символов"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100"
                  disabled={registerLoading}
                >
                  {registerLoading ? '⏳ Регистрация...' : 'Register'}
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