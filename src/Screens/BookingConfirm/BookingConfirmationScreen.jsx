import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingConfirmationScreen.css';

const BookingConfirmationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    // Получаем данные из location.state или localStorage
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
      setMentor(location.state.mentor);
      setLoading(false);
    } else {
      // Пытаемся загрузить последнюю запись из localStorage
      loadLastBooking();
    }
  }, [location]);

  const loadLastBooking = () => {
    try {
      const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
      const user = JSON.parse(localStorage.getItem('yogavibe_user') || '{}');
      
      if (allBookings.length > 0 && user.id) {
        // Находим последнюю запись пользователя
        const userBookings = allBookings.filter(b => b.userId === user.id);
        if (userBookings.length > 0) {
          const lastBooking = userBookings[userBookings.length - 1];
          setBookingData(lastBooking);
          
          // Загружаем данные ментора
          const mockMentors = JSON.parse(localStorage.getItem('yogavibe_mock_mentors') || '[]');
          const foundMentor = mockMentors.find(m => m.id === lastBooking.mentorId);
          setMentor(foundMentor);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки бронирования:', error);
    } finally {
      setLoading(false);
    }
  };

  // Удалены неиспользуемые функции:
  // handleGoToMyBookings и handleBookAnother

  if (loading) {
    return (
      <div className="confirmation-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка информации о записи...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="confirmation-not-found">
        <h2>Информация о записи не найдена</h2>
        <p>Вернитесь на главный экран и попробуйте записаться снова</p>
        <div className="confirmation-actions">
          <button onClick={() => navigate('/main')} className="action-btn link">
            На главную
          </button>
        </div>
      </div>
    );
  }

  // Форматируем дату и время
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Заголовок */}
        <div className="confirmation-header">
          <h1>Запись подтверждена!</h1>
          <p className="confirmation-subtitle">
            Ваша сессия успешно забронирована
          </p>
        </div>

        {/* Иконка успеха */}
        <div className="success-icon-large">
          ✓
        </div>

        {/* Информация о записи */}
        <div className="booking-summary">
          <h2>Детали вашей записи</h2>
          
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Ментор:</span>
              <span className="summary-value">{mentor?.name || bookingData.mentorName}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Дата:</span>
              <span className="summary-value">{formatDate(bookingData.date)}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Время:</span>
              <span className="summary-value">{formatTime(bookingData.time)}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Длительность:</span>
              <span className="summary-value">{bookingData.duration} минут</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Тип сессии:</span>
              <span className="summary-value">
                {bookingData.sessionType === 'individual' ? 'Индивидуальная' : 'Групповая'}
              </span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Стоимость:</span>
              <span className="summary-value price">{bookingData.totalPrice} ₽</span>
            </div>
            
            <div className="summary-item full-width">
              <span className="summary-label">Номер записи:</span>
              <span className="summary-value booking-id">#{bookingData.id}</span>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="contact-info">
          <h3>Контактная информация</h3>
          <p>
            Если у вас возникли вопросы, напишите нам на support@yogavibe.ru 
            или позвоните по номеру 8-800-XXX-XX-XX
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="confirmation-actions">
          <button onClick={() => navigate('/main')} className="action-btn link">
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;