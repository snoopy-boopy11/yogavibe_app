import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './BookingScreen.css';

// Утилита для генерации временных слотов
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

const BookingScreen = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '60', // по умолчанию 60 минут
    notes: '',
    sessionType: 'individual' // индивидуальная или групповая
  });
  const [isBooking, setIsBooking] = useState(false);
  // Удалено: const [bookingSuccess, setBookingSuccess] = useState(false);

  // Получаем данные ментора из location.state или загружаем
  useEffect(() => {
    if (location.state?.mentor) {
      setMentor(location.state.mentor);
      setLoading(false);
    } else {
      loadMentorData();
    }
  }, [mentorId, location.state]);

  const loadMentorData = () => {
    setLoading(true);
    // Моковые данные (можно вынести в отдельный файл)
    setTimeout(() => {
      const mockMentors = [
        { 
          id: 1, 
          name: "Анна Иванова", 
          price: 2500,
          city: "Москва",
          yogaStyle: "Хатха",
          availability: ["Пн-Пт: 9:00-18:00", "Сб: 10:00-15:00"]
        },
        { 
          id: 2, 
          name: "Дмитрий Петров", 
          price: 3000,
          city: "Санкт-Петербург",
          yogaStyle: "Аштанга",
          availability: ["Вт-Чт: 10:00-20:00", "Сб-Вс: 9:00-14:00"]
        },
      ];
      
      const foundMentor = mockMentors.find(m => m.id === parseInt(mentorId));
      setMentor(foundMentor);
      setLoading(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      alert('Пожалуйста, выберите дату и время для записи');
      return;
    }

    setIsBooking(true);

    // Имитация отправки на бэкенд
    setTimeout(() => {
      // Сохраняем запись в localStorage
      const user = JSON.parse(localStorage.getItem('yogavibe_user') || '{}');
      const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
      
      const newBooking = {
        id: Date.now(),
        userId: user.id,
        mentorId: mentor.id,
        mentorName: mentor.name,
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalPrice: calculateTotalPrice()
      };
      
      allBookings.push(newBooking);
      localStorage.setItem('yogavibe_bookings', JSON.stringify(allBookings));
      
      setIsBooking(false);
      
      // Переходим на экран подтверждения
      navigate('/booking-confirmation', { 
        state: { 
          bookingData: newBooking,
          mentor: mentor 
        } 
      });
    }, 1500);
  };

  const calculateTotalPrice = () => {
    const basePrice = mentor?.price || 0;
    const durationMultiplier = parseInt(bookingData.duration) / 60;
    const typeMultiplier = bookingData.sessionType === 'group' ? 0.7 : 1; // скидка на групповые
    
    return Math.round(basePrice * durationMultiplier * typeMultiplier);
  };

  const handleBackClick = () => {
    navigate(`/mentor/${mentorId}`);
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="booking-not-found">
        <h2>Ментор не найден</h2>
        <button onClick={() => navigate('/main')} className="back-btn">
          Вернуться к списку менторов
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Заголовок */}
        <div className="booking-header">
          <button 
            onClick={handleBackClick}
            className="back-btn"
            aria-label="Вернуться к профилю ментора"
          >
            ← Назад
          </button>
          <h1>Запись на сессию</h1>
        </div>

        {/* Информация о менторе */}
        <div className="mentor-summary">
          <h2>С ментором: {mentor.name}</h2>
          <div className="mentor-details">
            <div className="detail-item">
              <span className="detail-label">Стиль:</span>
              <span className="detail-value">{mentor.yogaStyle}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Город:</span>
              <span className="detail-value">{mentor.city}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Стоимость (60 мин):</span>
              <span className="detail-value price">{mentor.price} ₽</span>
            </div>
          </div>
        </div>

        {/* Форма записи */}
        <form className="booking-form" onSubmit={handleSubmit}>
          {/* Удален блок booking-success, так как после успеха идет редирект */}

          <div className="form-section">
            <h3>Выберите дату и время</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Дата*</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Время*</label>
                <select
                  id="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите время</option>
                  {generateTimeSlots().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Длительность сессии</label>
                <select
                  id="duration"
                  name="duration"
                  value={bookingData.duration}
                  onChange={handleInputChange}
                >
                  <option value="30">30 минут</option>
                  <option value="60">60 минут</option>
                  <option value="90">90 минут</option>
                  <option value="120">120 минут</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sessionType">Тип сессии</label>
                <select
                  id="sessionType"
                  name="sessionType"
                  value={bookingData.sessionType}
                  onChange={handleInputChange}
                >
                  <option value="individual">Индивидуальная</option>
                  <option value="group">Групповая</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Дополнительная информация</h3>
            <div className="form-group">
              <label htmlFor="notes">Ваши цели и пожелания</label>
              <textarea
                id="notes"
                name="notes"
                value={bookingData.notes}
                onChange={handleInputChange}
                placeholder="Опишите, что вы хотели бы проработать, есть ли особенности здоровья или другие пожелания..."
                rows="4"
              />
            </div>
          </div>

          {/* Итоговая стоимость */}
          <div className="price-summary">
            <div className="price-details">
              <div className="price-row">
                <span>Базовая стоимость:</span>
                <span>{mentor.price} ₽</span>
              </div>
              <div className="price-row">
                <span>Длительность:</span>
                <span>{bookingData.duration} мин</span>
              </div>
              <div className="price-row">
                <span>Тип сессии:</span>
                <span>{bookingData.sessionType === 'individual' ? 'Индивидуальная' : 'Групповая'}</span>
              </div>
              <div className="price-total">
                <span>Итого к оплате:</span>
                <span className="total-amount">{calculateTotalPrice()} ₽</span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleBackClick}
              className="cancel-btn"
              disabled={isBooking}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isBooking || !bookingData.date || !bookingData.time}
            >
              {isBooking ? 'ОФОРМЛЕНИЕ...' : 'ПОДТВЕРДИТЬ ЗАПИСЬ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingScreen;