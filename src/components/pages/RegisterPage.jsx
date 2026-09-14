import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

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

      if (user.role === 'admin') {
        navigate('/catalog');
        alert(`👑 Добро пожаловать, администратор ${user.firstName}!`);
      } else {
        navigate('/catalog');
        alert(`✅ Добро пожаловать, ${user.firstName}!`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Ошибка входа. Проверьте подключение к серверу.');
    }

    setLoginLoading(false);
  };

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
        setRegisterError('Пользователь с таким email уже существует');
        setRegisterLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      const created = await api.registerUser(newUser);

      login(created);
      alert(`✅ Регистрация успешна! Добро пожаловать, ${created.firstName}!`);
      navigate('/catalog');
    } catch (error) {
      console.error('Register error:', error);
      setRegisterError('Ошибка регистрации. Проверьте подключение к серверу.');
    }

    setRegisterLoading(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setLoginError('');
    setRegisterError('');
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setLoginError('');
    setRegisterError('');
  };

  return (
    <div className="register-page">
      <div className="catalog-header">
        <h1>🔐 Account</h1>
        <p>Login or create a new account</p>
      </div>

      <div className="auth-container">
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={switchToLogin}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={switchToRegister}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form className="auth-form" onSubmit={handleLogin}>
            {loginError && (
              <div className="auth-error">{loginError}</div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={loginData.email}
                onChange={handleLoginChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loginLoading}
            >
              {loginLoading ? '⏳ Вход...' : 'Login'}
            </button>

            <p className="auth-hint">
              Тестовый админ: <strong>admin@example.com</strong> / <strong>admin123</strong>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            {registerError && (
              <div className="auth-error">{registerError}</div>
            )}

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Ivan"
                value={registerData.firstName}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Petrov"
                value={registerData.lastName}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={registerData.email}
                onChange={handleRegisterChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password (min 6 chars)"
                value={registerData.password}
                onChange={handleRegisterChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={registerLoading}
            >
              {registerLoading ? '⏳ Регистрация...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;