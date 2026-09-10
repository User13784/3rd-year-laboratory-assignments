import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3>Greenery</h3>
          <p>{t('footerAbout')}</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="YouTube">📺</a>
          </div>
        </div>

        <div className="footer-col">
          <h3>{t('explore')}</h3>
          <ul>
            <li><a href="/">{t('home')}</a></li>
            <li><a href="/catalog">{t('shop')}</a></li>
            <li><a href="/favorites">{t('favorites')}</a></li>
            <li><a href="/feedback">{t('reviews')}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>{t('contacts')}</h3>
          <p>📍 Minsk, Nemiga 5</p>
          <p>📞 +375 (29) 123-45-67</p>
          <p>✉️ info@greenery.com</p>
        </div>

        <div className="footer-col">
          <h3>{t('workingHours')}</h3>
          <p>{t('monFri')}</p>
          <p>{t('saturday')}</p>
          <p>{t('sunday')}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Greenery. {t('allRightsReserved')}</p>
      </div>
    </footer>
  );
}

export default Footer;