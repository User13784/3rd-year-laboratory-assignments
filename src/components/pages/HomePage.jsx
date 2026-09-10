import React, { useEffect, useState } from 'react';

function HomePage({ title = "Best Furniture For Your Interior" }) {
  // ===== СЧЁТЧИКИ =====
  const [counters, setCounters] = useState({
    clients: 0,
    sold: 0,
    awards: 0,
    experience: 0
  });

  // ===== СЛАЙДЕР В HERO =====
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = 3;

  // ===== КАТЕГОРИИ ТОВАРОВ =====
  const [activeCategory, setActiveCategory] = useState('sofa');

  // ===== МЕДИАГАЛЕРЕЯ =====
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryImages = [
    { src: '/assets/images/c1.jpg', name: 'Элитный диван' },
    { src: '/assets/images/c2.jpg', name: 'Современный диван' },
    { src: '/assets/images/c3.jpg', name: 'Классический диван' },
    { src: '/assets/images/c4.jpg', name: 'Журнальный столик' },
    { src: '/assets/images/c5.jpg', name: 'Обеденный стол' },
    { src: '/assets/images/c6.jpg', name: 'Кухонные стулья' }
  ];
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // ===== ФОТО-ГАЛЕРЕЯ =====
  const allPhotos = [
    { src: '/assets/images/c1.jpg', name: 'Элитный диван', category: 'Диваны' },
    { src: '/assets/images/c2.jpg', name: 'Современный диван', category: 'Диваны' },
    { src: '/assets/images/c3.jpg', name: 'Классический диван', category: 'Диваны' },
    { src: '/assets/images/c4.jpg', name: 'Журнальный столик', category: 'Гостиная' },
    { src: '/assets/images/c5.jpg', name: 'Обеденный стол', category: 'Кухня' },
    { src: '/assets/images/c6.jpg', name: 'Кухонные стулья', category: 'Кухня' },
    { src: '/assets/images/c7.jpg', name: 'Кровать двуспальная', category: 'Спальня' },
    { src: '/assets/images/c8.jpg', name: 'Прикроватная тумба', category: 'Спальня' },
    { src: '/assets/images/c9.jpg', name: 'Ванная полка', category: 'Ванная' },
    { src: '/assets/images/c10.jpg', name: 'Зеркало в раме', category: 'Декор' },
    { src: '/assets/images/c11.jpg', name: 'Керамическая ваза', category: 'Керамика' },
    { src: '/assets/images/c12.jpg', name: 'Настольная лампа', category: 'Декор' }
  ];
  const photosPerPage = 6;
  const [photoPage, setPhotoPage] = useState(0);
  const visiblePhotos = allPhotos.slice(
    photoPage * photosPerPage,
    (photoPage + 1) * photosPerPage
  );
  const totalPhotoPages = Math.ceil(allPhotos.length / photosPerPage);

  // ===== АНИМАЦИЯ СЧЁТЧИКОВ =====
  useEffect(() => {
    const targets = { clients: 5000, sold: 1200, awards: 150, experience: 24 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters({
        clients: Math.floor(targets.clients * eased),
        sold: Math.floor(targets.sold * eased),
        awards: Math.floor(targets.awards * eased),
        experience: Math.floor(targets.experience * eased)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // ===== АВТОПЕРЕКЛЮЧЕНИЕ СЛАЙДОВ =====
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // ===== МЕДИАГАЛЕРЕЯ: функции =====
  const nextImage = () => {
    setGalleryIndex(prev => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setGalleryIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const randomImage = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * galleryImages.length);
    } while (randomIndex === galleryIndex && galleryImages.length > 1);
    setGalleryIndex(randomIndex);
  };

  const toggleAudio = () => {
    setIsAudioPlaying(prev => !prev);
  };

  // ===== ФОТО-ГАЛЕРЕЯ: функции =====
  const nextPhotoPage = () => {
    if (photoPage < totalPhotoPages - 1) setPhotoPage(prev => prev + 1);
  };

  const prevPhotoPage = () => {
    if (photoPage > 0) setPhotoPage(prev => prev - 1);
  };

  // ===== КАТЕГОРИИ ТОВАРОВ =====
  const categories = [
    { key: 'sofa', label: 'Single Sofa' },
    { key: 'living', label: 'Living Room' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'bedroom', label: 'Bed Room' },
    { key: 'bathroom', label: 'Bath Room' },
    { key: 'decor', label: 'Decorations' },
    { key: 'ceramics', label: 'Ceramics' }
  ];

  return (
    <div className="home-page-wrapper">

      {/* ===== HERO SECTION ===== */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-small">Save The Weekend</p>
          <p className="hero-medium">Awesome design</p>
          <p className="hero-large furniture-line">Best Furniture For</p>
          <p className="hero-large interior-line">Your Interior.</p>
          <a href="/catalog" className="hero-button">Explore More</a>
        </div>

        {/* Точки слайдера — кликабельны */}
        <div className="slider-dots">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`dot ${activeSlide === i ? 'active' : ''}`}
              onClick={() => setActiveSlide(i)}
              role="button"
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== ГАЛЕРЕЯ БРЕНДОВ ===== */}
      <section className="gallery-block">
        <div className="gallery-inner">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <img
              key={num}
              src={`/assets/images/photo${num}.png`}
              alt={`photo ${num}`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ))}
        </div>
      </section>

      {/* ===== СЧЁТЧИКИ ===== */}
      <section className="counters-section">
        <div className="counters-container">
          <div className="counter-item">
            <div className="counter-number">{counters.clients}</div>
            <div className="counter-label">Happy Clients</div>
          </div>
          <div className="counter-item">
            <div className="counter-number">{counters.sold}</div>
            <div className="counter-label">Sold Items</div>
          </div>
          <div className="counter-item">
            <div className="counter-number">{counters.awards}</div>
            <div className="counter-label">Awards</div>
          </div>
          <div className="counter-item">
            <div className="counter-number">{counters.experience}</div>
            <div className="counter-label">Years Experience</div>
          </div>
        </div>
      </section>

      {/* ===== НАШИ ТОВАРЫ ===== */}
      <section className="products-section">
        <div className="header2-text">
          <h1>Our Products</h1>
        </div>

        {/* Кнопки категорий — кликабельны */}
        <nav className="menu-text">
          {categories.map(cat => (
            <div
              key={cat.key}
              className={activeCategory === cat.key ? 'active' : ''}
              onClick={() => setActiveCategory(cat.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveCategory(cat.key)}
            >
              <span>{cat.label}</span>
            </div>
          ))}
        </nav>

        <div className="main-picture">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <article className="product-card" key={num}>
              <div className={`picture${num}`}>
                <div className="corner-badges">
                  <div className="badge badge-discount">-20%</div>
                  <div className="badge badge-new">New</div>
                </div>
                <img
                  src={`/assets/images/chair${num === 1 ? '' : num}.png`}
                  alt={`chair${num}`}
                  onError={(e) => { e.target.src = '/assets/images/chair.png'; }}
                />
                <div className={`bottom-element${num === 1 ? '' : num}`}>
                  <div className="square" title="Поиск">
                    <img src="/assets/icons/search.png" alt="search" />
                  </div>
                  <div className="square" title="Сравнить">
                    <img src="/assets/icons/diagram.png" alt="diagram" />
                  </div>
                  <div className="square" title="В избранное">
                    <img src="/assets/icons/heart.png" alt="heart" />
                  </div>
                  <div className="square" title="В корзину">
                    <img src="/assets/icons/store.png" alt="store" />
                  </div>
                </div>
              </div>
              <div className={`product-info product-info-${num}`}>
                <h2 className={`product-title title-${num}`}>Single Sofa</h2>
                <p className={`product-price price-${num}`}>£423.00</p>
                <div className={`product-rating rating-${num}`}>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">☆</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== PARALLAX ===== */}
      <section className="parallax-section">
        <div className="parallax-layer layer-1"></div>
        <div className="parallax-layer layer-2"></div>
        <div className="parallax-layer layer-3"></div>
        <div className="parallax-content">
          <h2>Создайте уют в своем доме</h2>
          <p>Качественная мебель от лучших производителей</p>
        </div>
      </section>

      {/* ===== ВИДЕО ===== */}
      <section className="video-promo-section">
        <div className="video-promo-container">
          <h2 className="video-promo-title">🎬 Видео-презентация</h2>
          <p className="video-promo-subtitle">Посмотрите нашу новую коллекцию мебели 2024 года</p>
          <div className="video-wrapper">
            <div
              className="video-thumbnail"
              onClick={() => alert('🎬 Здесь будет видео-презентация')}
            >
              <div className="video-badge"><span>📹 ВИДЕО</span></div>
              <img src="/assets/images/c1.jpg" alt="Видео-презентация" />
              <div className="video-play-overlay">
                <div className="play-large-btn">
                  <div className="play-symbol">▶</div>
                </div>
              </div>
              <div className="video-duration">🎥 0:11 мин</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== МЕДИАГАЛЕРЕЯ ===== */}
      <section className="media-gallery">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🎵 Медиагалерея</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>
          Нажмите на кнопки, чтобы менять изображения и слушать звуки
        </p>
        <div className="gallery-container">
          <div className="gallery-main">
            <img
              className="gallery-main-image"
              src={galleryImages[galleryIndex].src}
              alt={galleryImages[galleryIndex].name}
              onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
            />
          </div>
          <p style={{ textAlign: 'center', fontWeight: 600, color: '#264A51', margin: '10px 0' }}>
            {galleryImages[galleryIndex].name}
          </p>

          <div className="gallery-controls">
            <button className="gallery-btn" onClick={prevImage}>
              ◀ Предыдущее
            </button>
            <button className="gallery-btn" onClick={randomImage}>
              🎲 Случайное
            </button>
            <button className="gallery-btn" onClick={nextImage}>
              Следующее ▶
            </button>
          </div>

          {/* Аудио-кнопка */}
          <div className="gallery-audio" style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '15px 0' }}>
            <button
              className="audio-play-btn"
              onClick={toggleAudio}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                background: isAudioPlaying ? '#264A51' : '#71B3C6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {isAudioPlaying ? '⏸ Пауза' : '▶ Воспроизвести звук'}
            </button>
          </div>

          {/* Превью */}
          <div className="gallery-thumbnails">
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                className={`gallery-thumb ${galleryIndex === idx ? 'active' : ''}`}
                alt={`thumb ${idx}`}
                onClick={() => setGalleryIndex(idx)}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ФОТО-ГАЛЕРЕЯ ===== */}
      <section className="photo-gallery-section">
        <div className="photo-gallery-container">
          <h2 className="photo-gallery-title">📷 Галерея товаров</h2>
          <p className="photo-gallery-subtitle">Листайте фото, чтобы посмотреть наши товары</p>

          <div className="photo-grid">
            {visiblePhotos.map((photo, idx) => (
              <div className="photo-card" key={idx}>
                <img
                  src={photo.src}
                  alt={photo.name}
                  onError={(e) => { e.target.src = '/assets/images/placeholder.jpg'; }}
                />
                <div className="photo-card-info">
                  <h3>{photo.name}</h3>
                  <p>{photo.category}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="photo-nav">
            <button
              className="photo-nav-btn"
              onClick={prevPhotoPage}
              disabled={photoPage === 0}
            >
              ◀ Назад
            </button>
            <button
              className="photo-nav-btn"
              onClick={nextPhotoPage}
              disabled={photoPage === totalPhotoPages - 1}
            >
              Вперед ▶
            </button>
          </div>

          <div className="photo-indicator" style={{ textAlign: 'center', marginTop: '15px', color: '#5a7c85' }}>
            Страница {photoPage + 1} из {totalPhotoPages}
          </div>
        </div>
      </section>

      {/* ===== ПРОМО 50% OFF ===== */}
      <section className="image-container">
        <img src="/assets/images/bg2.jpg" alt="Background" />
        <div className="text-overlay">
          <h1>50% OFF</h1>
          <h2>Weekend Trendy Sofa</h2>
          <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
          <button onClick={() => window.location.href = '/catalog'}>
            View Items
          </button>
        </div>
      </section>

      {/* ===== LIVING ROOM ===== */}
      <section className="image-container2">
        <img src="/assets/images/bg3.jpg" alt="Living Room" />
        <div className="content">
          <h2 className="content-title">Living Room Items</h2>
          <p className="content-text">Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
          <button
            className="content-button"
            onClick={() => window.location.href = '/catalog'}
          >
            Read More
          </button>
        </div>
      </section>

      {/* ===== DINING TABLE ===== */}
      <section className="image-container3">
        <img src="/assets/images/bg4.jpg" alt="Dining Table" />
        <div className="content2">
          <h2>Trendy Dining Table</h2>
          <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
          <button onClick={() => window.location.href = '/catalog'}>
            View Items
          </button>
        </div>
      </section>

      {/* ===== MODERN BED ===== */}
      <section className="image-container4">
        <img src="/assets/images/bg5.jpg" alt="Modern Bed" />
        <div className="content3">
          <h2>Modern Bed</h2>
          <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
          <button onClick={() => window.location.href = '/catalog'}>
            View Items
          </button>
        </div>
      </section>

      {/* ===== KITCHEN ===== */}
      <section className="image-container5">
        <img src="/assets/images/bg6.jpg" alt="Kitchen" />
        <div className="content4">
          <h2>Popular Kitchen Items</h2>
          <p>Contrary to popular belief, Lorem Ipsum is not simply random text.</p>
          <button onClick={() => window.location.href = '/catalog'}>
            View Items
          </button>
        </div>
      </section>

      {/* ===== КАРТА ===== */}
      <section className="map-section">
        <div className="map-container">
          <div id="map" style={{
            width: '100%',
            height: '400px',
            background: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            color: '#5a7c85',
            fontSize: '16px'
          }}>
            📍 Карта загружается...
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;