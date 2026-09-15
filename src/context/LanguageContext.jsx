import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

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

    // Catalog
    ourCatalog: 'Our Catalog',
    catalogSubtitle: 'Choose the perfect furniture for your home',
    searchPlaceholder: '🔍 Search products...',
    sortDefault: 'Sort: Default',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Rating: High to Low',
    sortNameAsc: 'Name: A-Z',
    selectAll: '☑ Select all',
    deselectAll: '☐ Deselect all',
    selected: 'Selected',
    of: 'of',
    products: 'products',
    deleteSelected: '🗑️ Delete selected',
    cancel: '✖ Cancel',
    adminMode: '👑 Admin Mode',
    guestWarning: 'Log in to add items to cart and favorites',
    loadingProducts: 'Loading...',
    noProducts: '😕 No products found',
    noProductsHint: 'Try changing search or filter criteria',
    shown: 'Shown',
    addToCart: 'Add to cart',
    addToFavorites: 'Add to favorites',
    inStock: 'In stock',
    outOfStock: 'Out of stock',

    // Categories
    catAll: 'All',
    catSofa: 'Sofa',
    catLiving: 'Living',
    catKitchen: 'Kitchen',
    catBedroom: 'Bedroom',
    catBathroom: 'Bathroom',
    catDecor: 'Decor',
    catCeramics: 'Ceramics',

    // Cart
    shoppingCart: '🛒 Shopping Cart',
    emptyCart: '🛍️ Cart is empty',
    emptyCartHint: 'Add items to cart to checkout',
    goToCatalog: '🛍️ Go to catalog',
    product: 'Product',
    name: 'Name',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    actions: 'Actions',
    continueShopping: '← Continue shopping',
    checkout: '✅ Checkout',

    // Favorites
    favoritesTitle: '❤️ Favorites',
    favoritesSubtitle: 'Your favorite items',
    emptyFavorites: '😔 Favorites is empty',
    emptyFavoritesHint: 'Add items to favorites to see them here',
    items: 'items',

    // Feedback
    reviewsTitle: '⭐ Customer Reviews',
    reviewsSubtitle: 'Share your opinion about products',
    noReviews: '💬 No reviews yet',
    noReviewsHint: 'Be the first to leave a review!',
    totalReviews: 'Total reviews:',
    avgRating: 'Average rating:',

    // Register
    account: '🔐 Account',
    loginTab: 'Login',
    registerTab: 'Register',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    loginBtn: 'Login',
    registerBtn: 'Register',
    testAdmin: 'Test admin',
    loadingLogin: '⏳ Logging in...',
    loadingRegister: '⏳ Registering...',
    fillFields: 'Fill in all fields',
    userNotFound: 'User with this email not found',
    wrongPassword: 'Wrong password',
    loginError: 'Login error. Check server.',
    registerError: 'Registration error',
    emailTaken: 'Email already taken',
    passwordMin: 'Password must be at least 6 characters',
    welcomeAdmin: '👑 Welcome, admin',
    welcomeUser: '✅ Welcome',
    registerSuccess: '✅ Registration successful! Welcome',

    // HomePage
    heroSmall: 'Save The Weekend',
    heroMedium: 'Awesome design',
    heroLine1: 'Best Furniture For',
    heroLine2: 'Your Interior.',
    bestFurniture: 'Best Furniture For Your Interior',
    exploreMore: 'Explore More',
    bestQuality: 'Best quality',
    modernFurniture: 'Modern Furniture',
    forYourHome: 'For Your Home',
    viewCollection: 'View Collection',
    specialOffer: 'Special offer',
    weekendOnly: 'This Weekend Only',
    weekendTrendySofa: 'Weekend Trendy Sofa',
    off: 'OFF',
    shopNow: 'Shop Now',
    ourProducts: 'Our Products',
    ourProductsSubtitle: 'Choose the perfect furniture for your home',
    viewItems: 'View Items',
    mediaGallery: '🎵 Media Gallery',
    location: '📍 Location',
    locationAddress: 'Minsk, Nemiga 5',
    happyClients: 'Happy Clients',
    soldItems: 'Sold Items',
    awards: 'Awards',
    yearsExperience: 'Years Experience',

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

    // Modal
    close: 'Close',
    editProduct: '✏️ Edit Product',
    save: '💾 Save',
    cancelBtn: 'Cancel',
    productName: 'Product name',
    nameEn: 'Name (EN)',
    nameRu: 'Name (RU)',
    category: 'Category',
    imageUrl: 'Image URL',
    descriptionEn: 'Description (EN)',
    descriptionRu: 'Description (RU)',
    availability: 'Availability',
    yes: 'Yes',
    no: 'No',
    id: 'ID',
    rating: 'Rating',
    productInfo: 'Product info',
    topProduct: '⭐ Top',

    // Notifications
    addedToCart: 'added to cart!',
    addedToFavorites: 'added to favorites!',
    removedFromFavorites: 'removed from favorites',
    errorFavorite: 'Error with favorites',
    errorCart: 'Error adding to cart',
    loginRequired: 'Login required',
    goToLoginConfirm: 'Go to login page?',
    productUpdated: 'Product updated',
    errorUpdating: 'Error updating product',
    confirmDelete: 'Delete',
    confirmDeleteEnd: 'products?',
    productsDeleted: 'Products deleted',
    errorDeleting: 'Error deleting',
    logoutConfirm: 'Logout from account?',

    accessDenied: 'Access Denied'
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

    // Catalog
    ourCatalog: 'Наш Каталог',
    catalogSubtitle: 'Выберите идеальную мебель для вашего дома',
    searchPlaceholder: '🔍 Поиск товаров...',
    sortDefault: 'Сортировка: по умолчанию',
    sortPriceAsc: 'Цена: по возрастанию',
    sortPriceDesc: 'Цена: по убыванию',
    sortRating: 'Рейтинг: по убыванию',
    sortNameAsc: 'Название: А-Я',
    selectAll: '☑ Выбрать все',
    deselectAll: '☐ Снять выделение',
    selected: 'Выбрано',
    of: 'из',
    products: 'товаров',
    deleteSelected: '🗑️ Удалить выбранные',
    cancel: '✖ Отменить',
    adminMode: '👑 Режим администратора',
    guestWarning: 'Войдите, чтобы добавлять товары в корзину и избранное',
    loadingProducts: 'Загрузка...',
    noProducts: '😕 Товары не найдены',
    noProductsHint: 'Попробуйте изменить критерии поиска',
    shown: 'Показано',
    addToCart: 'В корзину',
    addToFavorites: 'В избранное',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',

    // Categories
    catAll: 'Все',
    catSofa: 'Диваны',
    catLiving: 'Гостиная',
    catKitchen: 'Кухня',
    catBedroom: 'Спальня',
    catBathroom: 'Ванная',
    catDecor: 'Декор',
    catCeramics: 'Керамика',

    // Cart
    shoppingCart: '🛒 Корзина покупок',
    emptyCart: '🛍️ Корзина пуста',
    emptyCartHint: 'Добавьте товары в корзину, чтобы оформить заказ',
    goToCatalog: '🛍️ Перейти в каталог',
    product: 'Товар',
    name: 'Название',
    price: 'Цена',
    quantity: 'Количество',
    total: 'Сумма',
    actions: 'Действия',
    continueShopping: '← Продолжить покупки',
    checkout: '✅ Оформить заказ',

    // Favorites
    favoritesTitle: '❤️ Избранное',
    favoritesSubtitle: 'Ваши любимые товары',
    emptyFavorites: '😔 В избранном пока пусто',
    emptyFavoritesHint: 'Добавляйте товары в избранное, чтобы они появились здесь',
    items: 'товаров',

    // Feedback
    reviewsTitle: '⭐ Отзывы покупателей',
    reviewsSubtitle: 'Поделитесь своим мнением о товарах',
    noReviews: '💬 Пока нет отзывов',
    noReviewsHint: 'Будьте первым, кто оставит отзыв!',
    totalReviews: 'Всего отзывов:',
    avgRating: 'Средний рейтинг:',

    // Register
    account: '🔐 Аккаунт',
    loginTab: 'Вход',
    registerTab: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    loginBtn: 'Войти',
    registerBtn: 'Зарегистрироваться',
    testAdmin: 'Тестовый админ',
    loadingLogin: '⏳ Вход...',
    loadingRegister: '⏳ Регистрация...',
    fillFields: 'Заполните все поля',
    userNotFound: 'Пользователь с таким email не найден',
    wrongPassword: 'Неверный пароль',
    loginError: 'Ошибка входа. Проверьте сервер.',
    registerError: 'Ошибка регистрации',
    emailTaken: 'Email уже занят',
    passwordMin: 'Пароль должен быть не менее 6 символов',
    welcomeAdmin: '👑 Добро пожаловать, админ',
    welcomeUser: '✅ Добро пожаловать',
    registerSuccess: '✅ Регистрация успешна! Добро пожаловать',

    // HomePage
    heroSmall: 'Спасите выходные',
    heroMedium: 'Потрясающий дизайн',
    heroLine1: 'Лучшая мебель для',
    heroLine2: 'Вашего интерьера.',
    bestFurniture: 'Лучшая мебель для вашего интерьера',
    exploreMore: 'Узнать больше',
    bestQuality: 'Лучшее качество',
    modernFurniture: 'Современная мебель',
    forYourHome: 'Для вашего дома',
    viewCollection: 'Смотреть коллекцию',
    specialOffer: 'Специальное предложение',
    weekendOnly: 'Только в эти выходные',
    weekendTrendySofa: 'Модный диван на выходные',
    off: 'СКИДКА',
    shopNow: 'Купить сейчас',
    ourProducts: 'Наши товары',
    ourProductsSubtitle: 'Выберите идеальную мебель для вашего дома',
    viewItems: 'Посмотреть',
    mediaGallery: '🎵 Медиагалерея',
    location: '📍 Локация',
    locationAddress: 'Минск, Немига 5',
    happyClients: 'Счастливых клиентов',
    soldItems: 'Проданных товаров',
    awards: 'Наград',
    yearsExperience: 'Лет опыта',

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

    // Modal
    close: 'Закрыть',
    editProduct: '✏️ Редактировать товар',
    save: '💾 Сохранить',
    cancelBtn: 'Отмена',
    productName: 'Название товара',
    nameEn: 'Название (EN)',
    nameRu: 'Название (RU)',
    category: 'Категория',
    imageUrl: 'URL изображения',
    descriptionEn: 'Описание (EN)',
    descriptionRu: 'Описание (RU)',
    availability: 'Наличие',
    yes: 'Да',
    no: 'Нет',
    id: 'ID',
    rating: 'Рейтинг',
    productInfo: 'Информация о товаре',
    topProduct: '⭐ Топ',

    // Notifications
    addedToCart: 'добавлен в корзину!',
    addedToFavorites: 'добавлен в избранное!',
    removedFromFavorites: 'удалён из избранного',
    errorFavorite: 'Ошибка при работе с избранным',
    errorCart: 'Ошибка добавления в корзину',
    loginRequired: 'Требуется вход',
    goToLoginConfirm: 'Перейти на страницу входа?',
    productUpdated: 'Товар обновлён',
    errorUpdating: 'Ошибка обновления товара',
    confirmDelete: 'Удалить',
    confirmDeleteEnd: 'товаров?',
    productsDeleted: 'Товары удалены',
    errorDeleting: 'Ошибка удаления',
    logoutConfirm: 'Выйти из аккаунта?',

    accessDenied: 'Доступ запрещён'
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

  return (
    <LanguageContext.Provider value={{
      lang,
      t,
      toggleLanguage,
      changeLanguage,
      isRu: lang === 'ru',
      isEn: lang === 'en'
    }}>
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