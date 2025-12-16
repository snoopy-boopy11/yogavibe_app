// src/screens/BookingConfirmationScreen/BookingConfirmationScreen.jsx
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
    if (location.state?.bookingData && location.state?.mentor) {
      setBookingData(location.state.bookingData);
      setMentor(location.state.mentor);
      setLoading(false);
    } else {
      navigate('/main');
    }
  }, [location, navigate]);

  const handleGoToMain = () => {
    navigate('/main');
  };

  const handleGoToMyBookings = () => {
    navigate('/my-bookings');
  };

  if (loading) {
    return (
      <div className="confirmation-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка информации о записи...</p>
      </div>
    );
  }

  if (!bookingData) {
    return null;
  }

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

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h1>Запись подтверждена!</h1>
          <p className="confirmation-subtitle">
            Ваша сессия успешно забронирована
          </p>
        </div>

        <div className="success-icon-large">
          ✓
        </div>

        <div className="booking-summary">
          <h2>Детали вашей записи</h2>
          
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Ментор:</span>
              <span className="summary-value">{mentor?.name || bookingData.mentorName}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Дата:</span>
              <span className="summary-value">{formatDate(bookingData.sessionDate)}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Время:</span>
              <span className="summary-value">{bookingData.time}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Длительность:</span>
              <span className="summary-value">{bookingData.durationMinutes} минут</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Тип сессии:</span>
              <span className="summary-value">
                {bookingData.sessionType === 'individual' ? 'Индивидуальная' : 'Групповая'}
              </span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Стоимость:</span>
              <span className="summary-value price">{bookingData.totalPrice || bookingData.price} ₽</span>
            </div>
            
            <div className="summary-item full-width">
              <span className="summary-label">Номер записи:</span>
              <span className="summary-value booking-id">#{bookingData.id}</span>
            </div>
            
            <div className="summary-item full-width">
              <span className="summary-label">Статус:</span>
              <span className="summary-value status-confirmed">
                ✅ Активная
              </span>
            </div>
          </div>
        </div>

        <div className="contact-info">
          <h3>Контактная информация</h3>
          <p>
            Если у вас возникли вопросы, напишите нам на support@yogavibe.ru 
            или позвоните по номеру 8-800-XXX-XX-XX
          </p>
        </div>

        <div className="confirmation-actions">
          <button onClick={handleGoToMain} className="action-btn primary">
            На главную
          </button>
          <button onClick={handleGoToMyBookings} className="action-btn secondary">
            Мои записи
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;