import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MainScreen.css';
import NotesScreen from '../NotesScreen/NotesScreen';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import MyBookingsScreen from '../MyBookingsScreen/MyBookingsScreen';
import NotesService from '../../services/NotesService';
import AuthService from '../../services/AuthService';

const mentors = [
  { id: 1, name: "Анна Иванова", description: "Опытный инструктор по хатха йоге с 5-летним стажем", gender: "female", city: "Москва", price: 2500, yogaStyle: "Хатха", photo: null },
  { id: 2, name: "Дмитрий Петров", description: "Специалист по аштанга йоге и медитации", gender: "male", city: "Санкт-Петербург", price: 3000, yogaStyle: "Аштанга", photo: null },
  { id: 3, name: "Мария Сидорова", description: "Йога для беременных и восстановительная йога", gender: "female", city: "Новосибирск", price: 2000, yogaStyle: "Восстановительная", photo: null },
  { id: 4, name: "Алексей Козлов", description: "Инструктор по силовой йоге и йоге для мужчин", gender: "male", city: "Екатеринбург", price: 2800, yogaStyle: "Силовая", photo: null },
  { id: 5, name: "Елена Смирнова", description: "Кундалини йога и работа с чакрами", gender: "female", city: "Москва", price: 3200, yogaStyle: "Кундалини", photo: null },
  { id: 6, name: "Сергей Николаев", description: "Йогатерапия и работа с травмами", gender: "male", city: "Казань", price: 2700, yogaStyle: "Йогатерапия", photo: null },
  { id: 7, name: "Ольга Кузнецова", description: "Йога для начинающих и стретчинг", gender: "female", city: "Нижний Новгород", price: 1800, yogaStyle: "Для начинающих", photo: null },
  { id: 8, name: "Иван Морозов", description: "Бикрам йога и горячая йога", gender: "male", city: "Челябинск", price: 2900, yogaStyle: "Бикрам", photo: null },
  { id: 9, name: "Татьяна Павлова", description: "Интегральная йога и философия", gender: "female", city: "Самара", price: 2200, yogaStyle: "Интегральная", photo: null },
];

const cities = [
  "Москва",
  "Санкт-Петербург", 
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Омск",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
  "Воронеж",
  "Пермь",
  "Волгоград"
];

const yogaStyles = [
  "Хатха",
  "Аштанга",
  "Восстановительная",
  "Силовая",
  "Кундалини",
  "Йогатерапия",
  "Для начинающих",
  "Бикрам",
  "Интегральная",
  "Виньяса",
  "Айенгара",
  "Инь-йога"
];

const PAGE_SIZE = 3;

const MainScreen = ({ user, onLogout }) => {
  // Состояние для пагинации
  const [page, setPage] = useState(1);
  
  // Состояние для уведомлений
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Состояние для активной навигации
  const [activeNav, setActiveNav] = useState('МЕНТОРЫ');
  
  // Состояние для информации о пользователе
  const [userInfo, setUserInfo] = useState(null);
  
  // Фильтры для менторов
  const [filters, setFilters] = useState({
    gender: 'all',
    city: 'all',
    yogaStyle: 'all',
    minPrice: '',
    maxPrice: ''
  });

  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  // ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  useEffect(() => {
    if (user) {
      setUserInfo(user);
    } else {
      // Если user не передан, проверяем localStorage
      const storedUser = AuthService.getCurrentUser();
      if (storedUser) {
        setUserInfo(storedUser);
      } else {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  // ФИЛЬТРАЦИЯ МЕНТОРОВ
  const filteredMentors = mentors.filter(mentor => {
    if (filters.gender !== 'all' && mentor.gender !== filters.gender) return false;
    if (filters.city !== 'all' && mentor.city !== filters.city) return false;
    if (filters.yogaStyle !== 'all' && mentor.yogaStyle !== filters.yogaStyle) return false;
    
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : null;
    
    if (minPrice !== null) {
      if (isNaN(minPrice) || minPrice < 0) return false;
      if (mentor.price < minPrice) return false;
    }
    
    if (maxPrice !== null) {
      if (isNaN(maxPrice) || maxPrice < 0) return false;
      if (mentor.price > maxPrice) return false;
    }
    
    if (minPrice !== null && maxPrice !== null) {
      if (minPrice > maxPrice) return false;
    }
    
    return true;
  });

  const total = filteredMentors.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentMentors = filteredMentors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Сброс пагинации при изменении фильтров
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // ОБРАБОТЧИКИ УВЕДОМЛЕНИЙ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // ОБРАБОТЧИКИ НАВИГАЦИИ И ФИЛЬТРОВ
  const handleNavClick = (navItem, event) => {
    event.preventDefault();
    setActiveNav(navItem);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Обработчик изменения ценовых полей с валидацией
  const handlePriceChange = (field, value) => {
    const numericValue = value === '' ? '' : value.replace(/[^0-9]/g, '');
    
    if (numericValue !== '' && parseInt(numericValue) < 0) {
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const clearFilters = () => {
    setFilters({
      gender: 'all',
      city: 'all',
      yogaStyle: 'all',
      minPrice: '',
      maxPrice: ''
    });
  };

  // Выход из аккаунта
  const handleLogoutClick = () => {
    if (window.confirm('Вы уверены, что хотите выйти из аккаунта?')) {
      onLogout();
      navigate('/login');
    }
  };

  // РЕНДЕРИНГ
  if (!userInfo) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className={`main-bg ${showNotifications ? 'dimmed' : ''}`}>
      <header className="main-header">
        <span className="logo">yogavibe</span>
        <nav className="main-nav">
          <a 
            href="#" 
            className={`main-nav-link ${activeNav === 'МЕНТОРЫ' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('МЕНТОРЫ', e)}
          >
            МЕНТОРЫ
          </a>
          <a 
            href="#" 
            className={`main-nav-link ${activeNav === 'МОИ ЗАПИСИ' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('МОИ ЗАПИСИ', e)}
          >
            МОИ ЗАПИСИ
          </a>
          <a 
            href="#" 
            className={`main-nav-link ${activeNav === 'ЗАМЕТКИ' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('ЗАМЕТКИ', e)}
          >
            ЗАМЕТКИ
          </a>
          <a 
            href="#" 
            className={`main-nav-link ${activeNav === 'МОЯ АНКЕТА' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('МОЯ АНКЕТА', e)}
          >
            МОЯ АНКЕТА
          </a>
        </nav>
        <div 
          className="mail-btn" 
          onClick={toggleNotifications}
          title="Уведомления"
          aria-label="Открыть уведомления"
        />
        
        {/* Выпадающее меню уведомлений */}
        {showNotifications && (
          <div className="notifications-dropdown" ref={notificationsRef}>
            <div className="notifications-header">
              <h3>Уведомления</h3>
            </div>
            
            <div className="notifications-list">
              <div className="notification-item">
                <div className="notification-content">
                  <p>Уведомлений пока нет</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Контент страницы в зависимости от активной навигации */}
      {activeNav === 'МЕНТОРЫ' && (
        <div className="mentors-page">
          {/* Фильтры слева */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Фильтры</h3>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Пол</label>
              <select 
                value={filters.gender} 
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="filter-select"
                aria-label="Фильтр по полу"
              >
                <option value="all">Любой</option>
                <option value="female">Женский</option>
                <option value="male">Мужской</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Город</label>
              <select 
                value={filters.city} 
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="filter-select"
                aria-label="Фильтр по городу"
              >
                <option value="all">Любой город</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Стиль йоги</label>
              <select 
                value={filters.yogaStyle} 
                onChange={(e) => handleFilterChange('yogaStyle', e.target.value)}
                className="filter-select"
                aria-label="Фильтр по стилю йоги"
              >
                <option value="all">Любой стиль</option>
                {yogaStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Цена за сессию</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="price-input"
                  aria-label="Минимальная цена"
                  min="0"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                />
                <input
                  type="number"
                  placeholder="До"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="price-input"
                  aria-label="Максимальная цена"
                  min="0"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="results-info">
              <div className="results-count">
                Найдено: <strong>{filteredMentors.length}</strong> менторов
              </div>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters} aria-label="Сбросить фильтры">
              Сбросить
            </button>

            {/* Кнопка выхода из аккаунта */}
            <div className="sidebar-footer">
              <button className="logout-btn" onClick={handleLogoutClick} aria-label="Выйти из аккаунта">
                <span className="logout-icon">↩</span>
                Выйти из аккаунта
              </button>
            </div>
          </aside>

          {/* Основной контент с менторами */}
          <main className="mentors-main">
            <div className="mentors-area">
              {currentMentors.length > 0 ? (
                currentMentors.map((mentor) => (
                  <div className="mentor-card" key={mentor.id}>
                    <div className="mentor-img">
                      {mentor.photo ? (
                        <img 
                          src={mentor.photo} 
                          alt={`Фото ментора ${mentor.name}`} 
                          loading="lazy"
                        />
                      ) : (
                        <div className="mentor-placeholder">Фото отсутствует</div>
                      )}
                    </div>
                    <div className="mentor-info">
                      <div className="mentor-name">{mentor.name}</div>
                      <div className="mentor-details">
                        <span className="mentor-city">{mentor.city}</span>
                        <span className="mentor-price">{mentor.price} ₽/сессия</span>
                      </div>
                      <div className="mentor-yoga-style">
                        <span className="yoga-style-tag">{mentor.yogaStyle}</span>
                      </div>
                    </div>
                    <div className="mentor-text">
                      <b>{mentor.description}</b>
                    </div>
                    <Link 
                      to={`/mentor/${mentor.id}`}
                      className="more-btn-link"
                      aria-label={`Подробнее о менторе ${mentor.name}`}
                    >
                      <button className="more-btn">
                        ПОДРОБНЕЕ
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>По вашему запросу менторов не найдено</p>
                </div>
              )}
            </div>
            
            {totalPages > 1 && (
              <footer className="main-footer">
                <div className="pagination">
                  <button 
                    className="page-btn" 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                    aria-label="Предыдущая страница"
                  >
                    &lt;
                  </button>
                  <span>
                    {Array.from({length: totalPages}, (_, i) => (
                      <button
                        key={i}
                        className={`page-num${page === i+1 ? " selected" : ""}`}
                        onClick={() => setPage(i + 1)}
                        aria-label={`Страница ${i + 1}`}
                        aria-current={page === i+1 ? "page" : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </span>
                  <button 
                    className="page-btn" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)}
                    aria-label="Следующая страница"
                  >
                    &gt;
                  </button>
                </div>
              </footer>
            )}
          </main>
        </div>
      )}
      
      {activeNav === 'МОИ ЗАПИСИ' && (
        <MyBookingsScreen />
      )}
      
      {activeNav === 'ЗАМЕТКИ' && (
        <NotesScreen />
      )}
      
      {activeNav === 'МОЯ АНКЕТА' && (
        <ProfileScreen 
          user={userInfo}
        />
      )}
    </div>
  );
};

export default MainScreen;