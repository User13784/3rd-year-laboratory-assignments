import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Страница не найдена</h2>
        <p className="not-found-text">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn primary">
            🏠 На главную
          </Link>
          <Link to="/catalog" className="not-found-btn secondary">
            🛍️ В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;