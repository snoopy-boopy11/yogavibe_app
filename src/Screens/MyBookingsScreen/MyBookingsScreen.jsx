import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookingScreen.css';

// Утилита для получения метки статуса
const getStatusLabel = (status) => {
  switch (status) {
    case 'confirmed':
    case 'pending':
      return { text: 'Активная', className: 'status-active' };
    case 'completed':
      return { text: 'Завершена', className: 'status-completed' };
    case 'cancelled':
      return { text: 'Отменена', className: 'status-cancelled' };
    default:
      return { text: status, className: 'status-default' };
  }
};

const MyBookingsScreen = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
        const user = JSON.parse(localStorage.getItem('yogavibe_user') || '{}');
        
        if (user.id) {
          const userBookings = allBookings.filter(b => b.userId === user.id);
          setBookings(userBookings);
        }
      } catch (error) {
        console.error('Ошибка загрузки записей:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // Используем useMemo для оптимизации вычислений
  const { filteredBookings, upcomingCount, pastCount, cancelledCount } = useMemo(() => {
    const now = new Date();
    
    const upcoming = bookings.filter(booking => 
      booking.status !== 'cancelled' && booking.status !== 'completed' &&
      new Date(booking.date) >= now
    );
    
    const past = bookings.filter(booking => 
      booking.status === 'completed' || 
      (booking.status !== 'cancelled' && new Date(booking.date) < now)
    );
    
    const cancelled = bookings.filter(booking => booking.status === 'cancelled');
    
    let filtered;
    switch (activeTab) {
      case 'upcoming':
        filtered = upcoming;
        break;
      case 'past':
        filtered = past;
        break;
      case 'cancelled':
        filtered = cancelled;
        break;
      default:
        filtered = bookings;
    }
    
    return {
      filteredBookings: filtered,
      upcomingCount: upcoming.length,
      pastCount: past.length,
      cancelledCount: cancelled.length
    };
  }, [bookings, activeTab]);

  const handleBookNewSession = () => {
    navigate('/main', { state: { activeNav: 'МЕНТОРЫ' } });
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить эту запись?')) {
      try {
        const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
        const updatedBookings = allBookings.map(booking => {
          if (booking.id === bookingId) {
            return { ...booking, status: 'cancelled' };
          }
          return booking;
        });
        
        localStorage.setItem('yogavibe_bookings', JSON.stringify(updatedBookings));
        
        // Обновляем локальное состояние
        const user = JSON.parse(localStorage.getItem('yogavibe_user') || '{}');
        setBookings(updatedBookings.filter(b => b.userId === user.id));
      } catch (error) {
        console.error('Ошибка отмены записи:', error);
        alert('Не удалось отменить запись');
      }
    }
  };

  const handleViewMentor = (mentorId) => {
    navigate(`/mentor/${mentorId}`);
  };

  // Компонент карточки бронирования
  const BookingCard = ({ booking }) => {
    const statusInfo = getStatusLabel(booking.status);
    const isUpcoming = activeTab === 'upcoming';
    
    return (
      <div className="booking-card">
        <div className="booking-header">
          <div className="booking-mentor-info">
            <h3>{booking.mentorName}</h3>
            <span className={`status-badge ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>
          <div className="booking-id">
            Запись #{booking.id}
          </div>
        </div>
        
        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Дата:</span>
            <span className="detail-value">
              {new Date(booking.date).toLocaleDateString('ru-RU', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Время:</span>
            <span className="detail-value">{booking.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Длительность:</span>
            <span className="detail-value">{booking.duration} минут</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Тип сессии:</span>
            <span className="detail-value">
              {booking.sessionType === 'individual' ? 'Индивидуальная' : 'Групповая'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Стоимость:</span>
            <span className="detail-value price">{booking.totalPrice} ₽</span>
          </div>
          {booking.notes && (
            <div className="detail-row">
              <span className="detail-label">Заметки:</span>
              <span className="detail-value notes">{booking.notes}</span>
            </div>
          )}
        </div>
        
        <div className="booking-actions">
          <button 
            onClick={() => handleViewMentor(booking.mentorId)}
            className="action-btn view-mentor-btn"
          >
            Профиль ментора
          </button>
          
          {isUpcoming && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button 
              onClick={() => handleCancelBooking(booking.id)}
              className="action-btn cancel-btn"
            >
              Отменить запись
            </button>
          )}
        </div>
      </div>
    );
  };

  // Компонент статистики
  const StatsCard = ({ value, label }) => (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>Мои записи</h1>
          <p className="bookings-subtitle">
            Управляйте своими сессиями и просматривайте историю
          </p>
        </div>

        {/* Табы фильтрации */}
        <div className="bookings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Предстоящие
            <span className="tab-count">
              {upcomingCount}
            </span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Прошедшие
            <span className="tab-count">
              {pastCount}
            </span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Отмененные
            <span className="tab-count">
              {cancelledCount}
            </span>
          </button>
        </div>

        {/* Список записей */}
        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">📅</div>
              <h3>Записей не найдено</h3>
              <p>
                {activeTab === 'upcoming' 
                  ? 'У вас нет предстоящих сессий. Запишитесь к ментору!' 
                  : activeTab === 'past'
                  ? 'У вас пока нет завершенных сессий'
                  : 'У вас нет отмененных записей'
                }
              </p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>

        {/* Статистика */}
        <div className="bookings-stats">
          <StatsCard value={bookings.length} label="Всего записей" />
          <StatsCard 
            value={bookings.filter(b => b.status === 'completed').length} 
            label="Завершено" 
          />
          <StatsCard 
            value={bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length} 
            label="Активные" 
          />
        </div>
      </div>
    </div>
  );
};

export default MyBookingsScreen;