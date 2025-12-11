import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MainScreen.css';
import NotesScreen from '../NotesScreen/NotesScreen';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import MyBookingsScreen from '../MyBookingsScreen/MyBookingsScreen';

import mentor1 from './mentors/1.jpg';
import mentor2 from './mentors/2.jpg';
import mentor3 from './mentors/3.jpg';
import mentor4 from './mentors/4.jpg';
import mentor5 from './mentors/5.jpg';
import mentor6 from './mentors/6.jpg';
import mentor7 from './mentors/7.jpg';
import mentor8 from './mentors/8.jpg';

const mentors = [
  { id: 1, name: "Анна Иванова", description: "Опытный инструктор по хатха йоге с 5-летним стажем", gender: "female", city: "Москва", price: 2500, yogaStyle: "Хатха", photo: mentor1 },
  { id: 2, name: "Дмитрий Петров", description: "Специалист по аштанга йоге и медитации", gender: "male", city: "Санкт-Петербург", price: 3000, yogaStyle: "Аштанга", photo: mentor2 },
  { id: 3, name: "Мария Сидорова", description: "Йога для беременных и восстановительная йога", gender: "female", city: "Новосибирск", price: 2000, yogaStyle: "Восстановительная", photo: mentor3 },
  { id: 4, name: "Алексей Козлов", description: "Инструктор по силовой йоге и йоге для мужчин", gender: "male", city: "Екатеринбург", price: 2800, yogaStyle: "Силовая", photo: mentor4 },
  { id: 5, name: "Елена Смирнова", description: "Кундалини йога и работа с чакрами", gender: "female", city: "Москва", price: 3200, yogaStyle: "Кундалини", photo: mentor5 },
  { id: 6, name: "Сергей Николаев", description: "Йогатерапия и работа с травмами", gender: "male", city: "Казань", price: 2700, yogaStyle: "Йогатерапия", photo: mentor6 },
  { id: 7, name: "Ольга Кузнецова", description: "Йога для начинающих и стретчинг", gender: "female", city: "Нижний Новгород", price: 1800, yogaStyle: "Для начинающих", photo: mentor7 },
  { id: 8, name: "Иван Морозов", description: "Бикрам йога и горячая йога", gender: "male", city: "Челябинск", price: 2900, yogaStyle: "Бикрам", photo: mentor8 },
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
  
  // Состояние для списка заметок пользователя
  const [notes, setNotes] = useState([]);
  
  // Состояние для редактирования заметок
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  // Моковые уведомления
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Завтра в 15:00 у вас сессия с Анной", time: "2 часа назад", read: false, icon: "📅" },
    { id: 2, text: "Новое сообщение от ментора", time: "5 часов назад", read: false, icon: "✉️" },
    { id: 3, text: "Ваш ментор оставил отзыв о сессии", time: "Вчера", read: false, icon: "⭐" },
    { id: 4, text: "Напоминание: оплата сессии", time: "2 дня назад", read: true, icon: "💰" },
    { id: 5, text: "Новый ментор в вашей категории", time: "3 дня назад", read: true, icon: "👤" }
  ]);
  
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

  // ========== ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ ==========
  useEffect(() => {
    if (user) {
      setUserInfo(user);
      loadUserNotes(user.id);
    } else {
      // Если user не передан, проверяем localStorage
      const storedUser = localStorage.getItem('yogavibe_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserInfo(userData);
        loadUserNotes(userData.id);
      } else {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  // Загрузка заметок пользователя по его ID
  const loadUserNotes = (userId) => {
    try {
      // Получаем все заметки из localStorage
      const allNotes = JSON.parse(localStorage.getItem('yogavibe_notes') || '{}');
      
      // Получаем заметки конкретного пользователя
      const userNotes = allNotes[userId] || [];
      
      // Преобразуем даты из строк обратно в объекты Date
      const formattedNotes = userNotes.map(note => {
        try {
          return {
            ...note,
            createdAt: note.createdAt ? new Date(note.createdAt).toLocaleString('ru-RU') : 'Нет даты',
            updatedAt: note.updatedAt ? new Date(note.updatedAt).toLocaleString('ru-RU') : 'Нет даты'
          };
        } catch (dateError) {
          console.error('Ошибка преобразования даты:', dateError);
          return {
            ...note,
            createdAt: 'Нет даты',
            updatedAt: 'Нет даты'
          };
        }
      });
      
      setNotes(formattedNotes);
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
      setNotes([]);
    }
  };

  // Функция сохранения заметки в localStorage
  const saveNoteToStorage = (note) => {
    try {
      const allNotes = JSON.parse(localStorage.getItem('yogavibe_notes') || '{}');
      const userNotes = allNotes[note.userId] || [];
      
      // Ищем существующую заметку
      const existingIndex = userNotes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        // Обновляем существующую
        userNotes[existingIndex] = {
          ...note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        // Добавляем новую
        userNotes.unshift({
          ...note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      allNotes[note.userId] = userNotes;
      localStorage.setItem('yogavibe_notes', JSON.stringify(allNotes));
    } catch (error) {
      console.error('Ошибка сохранения заметки:', error);
    }
  };

  // Функция удаления заметки из localStorage
  const deleteNoteFromStorage = (userId, noteId) => {
    try {
      const allNotes = JSON.parse(localStorage.getItem('yogavibe_notes') || '{}');
      const userNotes = allNotes[userId] || [];
      const updatedNotes = userNotes.filter(note => note.id !== noteId);
      allNotes[userId] = updatedNotes;
      localStorage.setItem('yogavibe_notes', JSON.stringify(allNotes));
      return true;
    } catch (error) {
      console.error('Ошибка удаления заметки:', error);
      return false;
    }
  };

  // ========== ОПЕРАЦИИ С ЗАМЕТКАМИ ==========
  
  // Добавление новой заметки
  const addNote = (text) => {
    if (!text.trim() || !userInfo) return;
    
    const newNote = {
      id: Date.now(),
      userId: userInfo.id,
      text: text.trim(),
      createdAt: new Date().toLocaleString('ru-RU'),
      updatedAt: new Date().toLocaleString('ru-RU')
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    saveNoteToStorage(newNote);
  };

  // Обновление существующей заметки
  const updateNote = (id, text) => {
    if (!text.trim() || !userInfo) return;
    
    const updatedNote = {
      id,
      userId: userInfo.id,
      text: text.trim(),
      createdAt: new Date().toLocaleString('ru-RU'),
      updatedAt: new Date().toLocaleString('ru-RU')
    };
    
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? updatedNote : note
      )
    );
    
    saveNoteToStorage(updatedNote);
  };

  // Удаление заметки
  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    
    // Удаляем из localStorage
    if (userInfo) {
      deleteNoteFromStorage(userInfo.id, id);
    }
    
    // Если удаляем редактируемую заметку, сбрасываем режим редактирования
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setEditingText('');
    }
  };

  // Начало редактирования заметки
  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  // Сохранение отредактированной заметки
  const saveEditing = (id) => {
    if (!editingText.trim()) return;
    
    updateNote(id, editingText);
    setEditingNoteId(null);
    setEditingText('');
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingText('');
  };

  // ========== ФИЛЬТРАЦИЯ МЕНТОРОВ ==========
  const filteredMentors = mentors.filter(mentor => {
    if (filters.gender !== 'all' && mentor.gender !== filters.gender) return false;
    if (filters.city !== 'all' && mentor.city !== filters.city) return false;
    if (filters.yogaStyle !== 'all' && mentor.yogaStyle !== filters.yogaStyle) return false;
    
    // Обработка ценового фильтра с валидацией
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : null;
    
    // Проверяем, что числа валидны и не отрицательные
    if (minPrice !== null) {
      // Если minPrice не число, меньше 0 или NaN
      if (isNaN(minPrice) || minPrice < 0) return false;
      if (mentor.price < minPrice) return false;
    }
    
    if (maxPrice !== null) {
      // Если maxPrice не число, меньше 0 или NaN
      if (isNaN(maxPrice) || maxPrice < 0) return false;
      if (mentor.price > maxPrice) return false;
    }
    
    // Дополнительная проверка: maxPrice должен быть >= minPrice
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

  // ========== ОБРАБОТЧИКИ УВЕДОМЛЕНИЙ ==========
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

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // ========== ОБРАБОТЧИКИ НАВИГАЦИИ И ФИЛЬТРОВ ==========
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
    // Удаляем все нецифровые символы, кроме пустой строки
    const numericValue = value === '' ? '' : value.replace(/[^0-9]/g, '');
    
    // Если значение не пустое, проверяем, что оно положительное
    if (numericValue !== '' && parseInt(numericValue) < 0) {
      return; // Не обновляем состояние для отрицательных значений
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

  const handleUpdateProfile = async (userId, profileData) => {
    console.log('Обновление профиля:', { userId, profileData });
    // Здесь будет логика для обновления профиля на бэкенде
    return { success: true };
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ========== РЕНДЕРИНГ ==========
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
        />
        
        {/* Выпадающее меню уведомлений */}
        {showNotifications && (
          <div className="notifications-dropdown" ref={notificationsRef}>
            <div className="notifications-header">
              <h3>Уведомления</h3>
              {unreadCount > 0 && (
                <span className="notifications-count">{unreadCount} новых</span>
              )}
            </div>
            
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`} 
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <p>{notification.text}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
            
            <div className="notifications-actions">
              <button className="read-all-btn" onClick={markAllAsRead}>
                Прочитать все
              </button>
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
                    // Предотвращаем ввод минуса
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
                    // Предотвращаем ввод минуса
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
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Сбросить фильтры
                  </button>
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
        <NotesScreen 
          notes={notes}
          editingNoteId={editingNoteId}
          editingText={editingText}
          onAddNote={addNote}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
          onStartEditing={startEditing}
          onSaveEditing={saveEditing}
          onCancelEditing={cancelEditing}
          onSetEditingText={setEditingText}
        />
      )}
      
      {activeNav === 'МОЯ АНКЕТА' && (
        <ProfileScreen 
          user={userInfo} 
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default MainScreen;