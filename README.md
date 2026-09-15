# 3rd-year-laboratory-assignments

React SPA — Laboratory works. Greenery Furniture Store.

## 📚 Лабораторная работа №3: Использование готовых библиотек компонентов

### 🎯 Цель работы

Научиться использовать готовые библиотеки компонентов для разработки SPA-приложений.

### 📦 Использованная библиотека

**React Bootstrap** v2.10 + **Bootstrap 5**

```bash
npm install react-bootstrap bootstrap
```

---

## 🧩 Список использованных компонентов (37)

### 📐 Layout — макет

| № | Компонент | Где используется |
|---|-----------|------------------|
| 1 | `Container` | Обёртка всех страниц |
| 2 | `Row` | Строки сетки каталога, футера |
| 3 | `Col` | Колонки сетки (товары, футер, отзывы) |

### 🧭 Навигация

| № | Компонент | Где используется |
|---|-----------|------------------|
| 4 | `Navbar` | Хедер, боковое меню |
| 5 | `Nav` | Меню навигации |
| 6 | `Nav.Link` | Ссылки навигации |
| 7 | `Navbar.Brand` | Логотип Greenery |
| 8 | `Navbar.Toggle` | Кнопка меню на мобильных |
| 9 | `Navbar.Collapse` | Сворачивание меню |

### 📝 Формы

| № | Компонент | Где используется |
|---|-----------|------------------|
| 10 | `Form` | Формы входа/регистрации |
| 11 | `Form.Control` | Поля ввода |
| 12 | `Form.Group` | Группы полей |
| 13 | `Form.Label` | Метки полей |
| 14 | `Form.Select` | Выпадающие списки |
| 15 | `Form.Check` | Чекбоксы, переключатели |

### 📊 Отображение данных

| № | Компонент | Где используется |
|---|-----------|------------------|
| 16 | `Card` | Карточки товаров, отзывов |
| 17 | `Card.Img` | Изображения в карточках |
| 18 | `Card.Body` | Тело карточки |
| 19 | `Card.Title` | Заголовок карточки |
| 20 | `Card.Text` | Текст (цена, описание) |
| 21 | `Card.Header` | Шапка карточки |
| 22 | `Card.Footer` | Подвал карточки |
| 23 | `Table` | Таблица корзины, админ-панели |
| 24 | `ListGroup` | Список характеристик |
| 25 | `Badge` | Счётчики, метки |

### 🎛️ Интерактивные элементы

| № | Компонент | Где используется |
|---|-----------|------------------|
| 26 | `Button` | Все кнопки на сайте |
| 27 | `ButtonGroup` | Группа кнопок |
| 28 | `Modal` | Модальные окна |
| 29 | `Toast` | Уведомления |
| 30 | `ToastContainer` | Контейнер уведомлений |
| 31 | `Spinner` | Индикатор загрузки |
| 32 | `Alert` | Предупреждения |
| 33 | `Carousel` | Слайдер на главной |
| 34 | `Pagination` | Пагинация каталога |
| 35 | `InputGroup` | Группа полей ввода |
| 36 | `Tabs` | Вкладки |
| 37 | `Tab` | Отдельная вкладка |

---

## ✨ Новые функции (по сравнению с лабораторной №2)

| № | Функция | Реализация |
|---|---------|-----------|
| 1 | **Toast-уведомления** | Bootstrap `Toast` вместо `alert()` |
| 2 | **Сортировка каталога** | `Form.Select` + `.sort()` |
| 3 | **Пагинация каталога** | Bootstrap `Pagination` (8 товаров на стр.) |
| 4 | **Carousel на главной** | Bootstrap `Carousel` со слайдами |
| 5 | **Валидация форм** | `Form.Control.Feedback` |
| 6 | **Хук `useNotification`** | Переиспользуемая логика уведомлений |

---

## 🗺️ Страницы приложения

| Путь | Страница | Bootstrap-компоненты |
|------|----------|---------------------|
| `/` | Home | Carousel, Card, Row, Col, Badge, Button |
| `/catalog` | Catalog | Container, Row, Col, Form, Button, Badge, Pagination, InputGroup, ButtonGroup, Alert, Spinner |
| `/cart` | Cart | Container, Table, Button, Badge, Alert, Spinner |
| `/favorites` | Favorites | Container, Row, Col, Alert, Button, Spinner |
| `/feedback` | Reviews | Container, Row, Col, Card, Badge, Alert, Spinner |
| `/register` | Register | Card, Form, Button, Tabs, Tab, Alert |
| `/admin` | Admin | Tabs, Tab, Table, Card, Badge, Form, InputGroup |
| `*` | 404 | Container, Row, Col, Button |

---

## 🏗️ Структура проекта

```
src/
├── components/
│   ├── common/
│   │   ├── Modal.jsx              ← Bootstrap Modal
│   │   └── Notification.jsx       ← Bootstrap Toast
│   ├── layout/
│   │   ├── Sidebar.jsx            ← Bootstrap Navbar
│   │   └── Footer.jsx             ← Bootstrap Container/Row/Col
│   ├── pages/
│   │   ├── HomePage.jsx           ← Carousel, Card
│   │   ├── CatalogPage.jsx        ← Row/Col, Pagination
│   │   ├── CartPage.jsx           ← Table, Alert
│   │   ├── FavoritesPage.jsx      ← Row/Col
│   │   ├── FeedbackPage.jsx       ← Card, ListGroup
│   │   ├── AdminPage.jsx          ← Tabs, Table
│   │   ├── RegisterPage.jsx       ← Form, Tabs
│   │   └── NotFoundPage.jsx       ← Container, Button
│   ├── product/
│   │   ├── ProductCard.jsx        ← Card, Button, Badge
│   │   ├── ProductModal.jsx       ← Modal, Row/Col
│   │   └── EditProductModal.jsx   ← Form, Modal
│   └── cart/
│       └── CartItem.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── LanguageContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useCart.js
│   └── useNotification.js
├── services/
│   └── api.js
├── App.js
├── App.css
├── custom-bootstrap.css           ← Переопределение цветов
└── index.js
```

---

## 🚀 Запуск проекта

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск JSON Server (порт 3001)
npm run server

# 3. Запуск React (порт 3000) — в отдельном терминале
npm start
```

---

## 🔑 Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | `admin@example.com` | `admin123` |
| Пользователь | `user@example.com` | `user123` |

---

## 🎨 Кастомизация цветов

Все цвета Bootstrap переопределены под фирменную палитру Greenery в `custom-bootstrap.css`:

| Bootstrap | По умолчанию | Greenery |
|-----------|--------------|----------|
| Primary | `#0d6efd` (синий) | `#264A51` (тёмно-зелёный) |
| Dark | `#212529` (чёрный) | `#1A3E45` (тёмно-зелёный) |
| Info | `#0dcaf0` (голубой) | `#71B3C6` (светло-зелёный) |
| Warning | `#ffc107` (жёлтый) | `#FFB800` (золотой) |

---

## 📱 Адаптивность

Приложение корректно отображается при ширине **от 320px до 1920px** благодаря встроенной адаптивности Bootstrap.

Bootstrap Grid (12 колонок):

| Размер | Ширина | Колонок на строку |
|--------|--------|-------------------|
| `xs` | < 576px | 1 |
| `sm` | ≥ 576px | 2 |
| `md` | ≥ 768px | 3 |
| `lg` | ≥ 992px | 4 |

---

## 🛠️ Технологии

- **React 19** — UI-библиотека
- **React Router v6** — маршрутизация
- **React Bootstrap 2** — компоненты UI
- **Bootstrap 5** — CSS-фреймворк
- **JSON Server** — REST API из JSON-файла
- **Context API** — глобальное состояние
- **Custom Hooks** — переиспользуемая логика

---

## 📄 Лицензия

MIT