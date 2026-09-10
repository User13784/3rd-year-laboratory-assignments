import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

// ===== СЛОВАРЬ ПЕРЕВОДОВ =====
export const translations = {
  en: {
    // Header
    login: 'LOGIN',
    signup: 'SIGN UP',
    mailing: 'MAILING LIST',
    share: 'SHARE',
    cart: 'CART',
    logout: 'Logout',

    // Sidebar
    home: 'Home',
    shop: 'Shop',
    favorites: 'Favorites',
    reviews: 'Reviews',

    // Home Page
    heroSmall: 'Save The Weekend',
    heroMedium: 'Awesome design',
    heroLine1: 'Best Furniture For',
    heroLine2: 'Your Interior.',
    exploreMore: 'Explore More',
    ourProducts: 'Our Products',
    happyClients: 'Happy Clients',
    soldItems: 'Sold Items',
    awards: 'Awards',
    yearsExperience: 'Years Experience',
    videoTitle: '🎬 Video Presentation',
    videoSubtitle: 'Check out our new furniture collection',
    mediaGallery: '🎵 Media Gallery',
    mediaGalleryHint: 'Click buttons to change images and listen to sounds',
    prev: '◀ Previous',
    random: '🎲 Random',
    next: 'Next ▶',
    playSound: '▶ Play sound',
    pauseSound: '⏸ Pause',
    photoGallery: '📷 Products Gallery',
    photoGalleryHint: 'Swipe to browse our products',
    back: '◀ Back',
    forward: 'Forward ▶',
    page: 'Page',
    of: 'of',
    viewItems: 'View Items',
    readMore: 'Read More',

    // Catalog
    ourCatalog: 'Our Catalog',
    catalogSubtitle: 'Choose the perfect furniture for your home',
    searchPlaceholder: '🔍 Search products...',
    all: 'All',
    selectAll: '☑ Select all',
    deselectAll: '☐ Deselect all',
    selected: 'Selected',
    outOf: 'out of',
    products: 'products',
    deleteSelected: '🗑️ Delete selected',
    cancel: '✖ Cancel',
    loadingProducts: 'Loading products...',
    noProducts: '😕 No products found',
    noProductsHint: 'Try changing search or filter criteria',
    shown: 'Shown',
    addToCart: '🛒 Add to cart',
    outOfStock: 'Out of stock',
    inStock: '✓ In stock',
    editProduct: '✏️ Edit product',
    adminMode: '👑 Admin Mode',
    guestWarning: 'Log in to add items to cart and favorites',

    // Product Modal
    editProductTitle: '✏️ Edit Product',
    nameEn: 'Name (EN)',
    nameRu: 'Name (RU)',
    price: 'Price (£)',
    category: 'Category',
    imageUrl: 'Image URL',
    descriptionEn: 'Description (EN)',
    descriptionRu: 'Description (RU)',
    save: '💾 Save',
    cancelBtn: 'Cancel',

    // Cart
    shoppingCart: '🛒 Shopping Cart',
    cartSubtitle: 'Your selected items',
    emptyCart: '🛍️ Cart is empty',
    emptyCartHint: 'Add items to cart to checkout',
    goToCatalog: 'Go to catalog',
    product: 'Product',
    name: 'Name',
    quantity: 'Quantity',
    total: 'Total',
    actions: 'Actions',
    checkout: '✅ Checkout',

    // Favorites
    favoritesTitle: '❤️ Favorites',
    favoritesSubtitle: 'Your favorite items',
    emptyFavorites: '😔 Favorites is empty',
    emptyFavoritesHint: 'Add items to favorites to see them here',

    // Reviews
    reviewsTitle: '⭐ Customer Reviews',
    reviewsSubtitle: 'Share your opinion about products',
    noReviews: '💬 No reviews yet. Be the first!',

    // Register
    account: '🔐 Account',
    accountSubtitle: 'Login or create a new account',
    loginTab: 'Login',
    registerTab: 'Register',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    register: 'Register',
    loginBtn: 'Login',
    fillFields: 'Fill in all fields',
    passwordMin: 'Password must be at least 6 characters',
    userNotFound: 'User with this email not found',
    wrongPassword: 'Wrong password',
    loginError: 'Login error. Check server connection.',
    registerError: 'Registration error. Check server connection.',
    emailExists: 'User with this email already exists',
    testAdmin: 'Test admin',
    logoutConfirm: 'Logout from account?',

    // 404
    notFoundTitle: 'Page not found',
    notFoundText: 'Sorry, the page you are looking for does not exist or has been moved.',
    goHome: '🏠 Go home',
    goToCatalogBtn: '🛍️ To catalog',

    // Footer
    footerAbout: 'Best furniture for your interior. Quality and style since 2000.',
    explore: 'Explore',
    contacts: 'Contacts',
    workingHours: 'Working Hours',
    monFri: 'Mon-Fri: 09:00 - 19:00',
    saturday: 'Saturday: 10:00 - 18:00',
    sunday: 'Sunday: Closed',
    allRightsReserved: 'All Rights Reserved.',

    // Errors
    loginRequired: 'To perform this action, please log in.',
    goToLogin: 'Go to login page?',
    adminRequired: '⛔ This action is only available to administrators',
    addedToCart: 'Added to cart!',
    addedToFavorites: 'Added to favorites!',
    errorAddingToCart: 'Error adding to cart',
    errorAddingToFavorites: 'Error adding to favorites',
    productUpdated: '✅ Product updated successfully',
    errorUpdatingProduct: '❌ Error updating product',
    productsDeleted: '✅ Products deleted',
    errorDeletingProducts: '❌ Error deleting',
    deleteConfirm: 'Delete',
    deleteConfirmEnd: 'products? This action cannot be undone.',

    // Categories
    catAll: 'All',
    catSofa: 'Sofa',
    catLiving: 'Living',
    catKitchen: 'Kitchen',
    catBedroom: 'Bedroom',
    catBathroom: 'Bathroom',
    catDecor: 'Decor',
    catCeramics: 'Ceramics'
  },

  ru: {
    // Header
    login: 'ВОЙТИ',
    signup: 'РЕГИСТРАЦИЯ',
    mailing: 'РАССЫЛКА',
    share: 'ПОДЕЛИТЬСЯ',
    cart: 'КОРЗИНА',
    logout: 'Выйти',

    // Sidebar
    home: 'Главная',
    shop: 'Магазин',
    favorites: 'Избранное',
    reviews: 'Отзывы',

    // Home Page
    heroSmall: 'Спасите выходные',
    heroMedium: 'Потрясающий дизайн',
    heroLine1: 'Лучшая мебель для',
    heroLine2: 'Вашего интерьера.',
    exploreMore: 'Узнать больше',
    ourProducts: 'Наши товары',
    happyClients: 'Счастливых клиентов',
    soldItems: 'Проданных товаров',
    awards: 'Наград',
    yearsExperience: 'Лет опыта',
    videoTitle: '🎬 Видео-презентация',
    videoSubtitle: 'Посмотрите нашу новую коллекцию мебели',
    mediaGallery: '🎵 Медиагалерея',
    mediaGalleryHint: 'Нажмите на кнопки, чтобы менять изображения и слушать звуки',
    prev: '◀ Предыдущее',
    random: '🎲 Случайное',
    next: 'Следующее ▶',
    playSound: '▶ Воспроизвести звук',
    pauseSound: '⏸ Пауза',
    photoGallery: '📷 Галерея товаров',
    photoGalleryHint: 'Листайте фото, чтобы посмотреть наши товары',
    back: '◀ Назад',
    forward: 'Вперед ▶',
    page: 'Страница',
    of: 'из',
    viewItems: 'Посмотреть',
    readMore: 'Читать далее',

    // Catalog
    ourCatalog: 'Наш Каталог',
    catalogSubtitle: 'Выберите идеальную мебель для вашего дома',
    searchPlaceholder: '🔍 Поиск товаров...',
    all: 'Все',
    selectAll: '☑ Выбрать все',
    deselectAll: '☐ Снять выделение',
    selected: 'Выбрано',
    outOf: 'из',
    products: 'товаров',
    deleteSelected: '🗑️ Удалить выбранные',
    cancel: '✖ Отменить',
    loadingProducts: 'Загрузка товаров...',
    noProducts: '😕 Товары не найдены',
    noProductsHint: 'Попробуйте изменить критерии поиска или фильтрации',
    shown: 'Показано',
    addToCart: '🛒 В корзину',
    outOfStock: 'Нет в наличии',
    inStock: '✓ В наличии',
    editProduct: '✏️ Редактировать товар',
    adminMode: '👑 Режим администратора',
    guestWarning: 'Войдите, чтобы добавлять товары в корзину и избранное',

    // Product Modal
    editProductTitle: '✏️ Редактировать товар',
    nameEn: 'Название (EN)',
    nameRu: 'Название (RU)',
    price: 'Цена (£)',
    category: 'Категория',
    imageUrl: 'URL изображения',
    descriptionEn: 'Описание (EN)',
    descriptionRu: 'Описание (RU)',
    save: '💾 Сохранить',
    cancelBtn: 'Отмена',

    // Cart
    shoppingCart: '🛒 Корзина покупок',
    cartSubtitle: 'Ваши выбранные товары',
    emptyCart: '🛍️ Корзина пуста',
    emptyCartHint: 'Добавьте товары в корзину, чтобы оформить заказ',
    goToCatalog: 'Перейти в каталог',
    product: 'Товар',
    name: 'Название',
    quantity: 'Количество',
    total: 'Сумма',
    actions: 'Действия',
    checkout: '✅ Оформить заказ',

    // Favorites
    favoritesTitle: '❤️ Избранное',
    favoritesSubtitle: 'Ваши любимые товары',
    emptyFavorites: '😔 В избранном пока пусто',
    emptyFavoritesHint: 'Добавляйте товары в избранное, чтобы они появились здесь',

    // Reviews
    reviewsTitle: '⭐ Отзывы покупателей',
    reviewsSubtitle: 'Поделитесь своим мнением о товарах',
    noReviews: '💬 Пока нет отзывов. Будьте первым!',

    // Register
    account: '🔐 Аккаунт',
    accountSubtitle: 'Войдите или создайте новый аккаунт',
    loginTab: 'Вход',
    registerTab: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    register: 'Зарегистрироваться',
    loginBtn: 'Войти',
    fillFields: 'Заполните все поля',
    passwordMin: 'Пароль должен быть не менее 6 символов',
    userNotFound: 'Пользователь с таким email не найден',
    wrongPassword: 'Неверный пароль',
    loginError: 'Ошибка входа. Проверьте подключение к серверу.',
    registerError: 'Ошибка регистрации. Проверьте подключение к серверу.',
    emailExists: 'Пользователь с таким email уже существует',
    testAdmin: 'Тестовый админ',
    logoutConfirm: 'Выйти из аккаунта?',

    // 404
    notFoundTitle: 'Страница не найдена',
    notFoundText: 'Извините, страница, которую вы ищете, не существует или была перемещена.',
    goHome: '🏠 На главную',
    goToCatalogBtn: '🛍️ В каталог',

    // Footer
    footerAbout: 'Лучшая мебель для вашего интерьера. Качество и стиль с 2000 года.',
    explore: 'Исследовать',
    contacts: 'Контакты',
    workingHours: 'Часы работы',
    monFri: 'Пн-Пт: 09:00 - 19:00',
    saturday: 'Суббота: 10:00 - 18:00',
    sunday: 'Воскресенье: Закрыто',
    allRightsReserved: 'Все права защищены.',

    // Errors
    loginRequired: 'Для этого действия необходимо войти в аккаунт.',
    goToLogin: 'Перейти на страницу входа?',
    adminRequired: '⛔ Это действие доступно только администратору',
    addedToCart: 'Добавлено в корзину!',
    addedToFavorites: 'Добавлено в избранное!',
    errorAddingToCart: 'Ошибка добавления в корзину',
    errorAddingToFavorites: 'Ошибка добавления в избранное',
    productUpdated: '✅ Товар успешно обновлён',
    errorUpdatingProduct: '❌ Ошибка обновления товара',
    productsDeleted: '✅ Товары удалены',
    errorDeletingProducts: '❌ Ошибка удаления',
    deleteConfirm: 'Удалить',
    deleteConfirmEnd: 'товаров? Это действие нельзя отменить.',

    // Categories
    catAll: 'Все',
    catSofa: 'Диваны',
    catLiving: 'Гостиная',
    catKitchen: 'Кухня',
    catBedroom: 'Спальня',
    catBathroom: 'Ванная',
    catDecor: 'Декор',
    catCeramics: 'Керамика'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('language') || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ru' : 'en'));
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const value = {
    lang,
    t,
    toggleLanguage,
    changeLanguage,
    isRu: lang === 'ru',
    isEn: lang === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}