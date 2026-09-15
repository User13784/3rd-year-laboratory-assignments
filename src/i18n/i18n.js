import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      login: 'LOGIN',
      signup: 'SIGN UP',
      cart: 'CART',
      logout: 'Logout',
      home: 'Home',
      shop: 'Shop',
      favorites: 'Favorites',
      reviews: 'Reviews',
      ourCatalog: 'Our Catalog',
      searchPlaceholder: '🔍 Search products...',
      addToCart: 'Add to cart',
      inStock: 'In stock',
      outOfStock: 'Out of stock',
      shoppingCart: '🛒 Shopping Cart',
      emptyCart: '🛍️ Cart is empty',
      total: 'Total',
      checkout: '✅ Checkout',
      favoritesTitle: '❤️ Favorites',
      emptyFavorites: '😔 Favorites is empty',
      reviewsTitle: '⭐ Customer Reviews',
      noReviews: '💬 No reviews yet',
      account: '🔐 Account',
      loginTab: 'Login',
      registerTab: 'Register',
      email: 'Email',
      password: 'Password',
      loginBtn: 'Login',
      registerBtn: 'Register'
    }
  },
  ru: {
    translation: {
      login: 'ВОЙТИ',
      signup: 'РЕГИСТРАЦИЯ',
      cart: 'КОРЗИНА',
      logout: 'Выйти',
      home: 'Главная',
      shop: 'Магазин',
      favorites: 'Избранное',
      reviews: 'Отзывы',
      ourCatalog: 'Наш Каталог',
      searchPlaceholder: '🔍 Поиск товаров...',
      addToCart: 'В корзину',
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
      shoppingCart: '🛒 Корзина покупок',
      emptyCart: '🛍️ Корзина пуста',
      total: 'Итого',
      checkout: '✅ Оформить заказ',
      favoritesTitle: '❤️ Избранное',
      emptyFavorites: '😔 В избранном пусто',
      reviewsTitle: '⭐ Отзывы покупателей',
      noReviews: '💬 Пока нет отзывов',
      account: '🔐 Аккаунт',
      loginTab: 'Вход',
      registerTab: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      loginBtn: 'Войти',
      registerBtn: 'Зарегистрироваться'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  });

export default i18n;