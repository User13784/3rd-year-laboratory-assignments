import React, { useState } from 'react';

function RegisterPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="register-page">
      <div className="catalog-header">
        <h1>🔐 Account</h1>
        <p>Login or create a new account</p>
      </div>
      <div className="auth-container">
        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {isLogin ? (
          <form className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@mail.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" />
            </div>
            <button type="submit" className="submit-btn">Login</button>
          </form>
        ) : (
          <form className="auth-form">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Ivan" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Petrov" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@mail.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" />
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;