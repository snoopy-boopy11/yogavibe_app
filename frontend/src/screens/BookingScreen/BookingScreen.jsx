import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingService from '../../services/BookingService';
import './BookingScreen.css';

const BookingScreen = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  
  const [bookingData, setBookingData] = useState({
    sessionDate: '',
    time: '',
    durationMinutes: '60',
    notes: '',
    sessionType: 'individual'
  });

  useEffect(() => {
    if (location.state?.mentor) {
      setMentor(location.state.mentor);
      setLoading(false);
    } else {
      loadMentorData();
    }
  }, [mentorId, location.state]);

  const loadMentorData = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Error loading mentor:', error);
      setError('Не удалось загрузить данные ментора');
    } finally {
      setLoading(false);
    }
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
    
    if (!bookingData.sessionDate || !bookingData.time) {
      alert('Пожалуйста, выберите дату и время для записи');
      return;
    }

    const dateTimeString = `${bookingData.sessionDate}T${bookingData.time}:00`;
    const sessionDate = new Date(dateTimeString);

    setIsBooking(true);
    setError(null);

    try {
      const bookingToCreate = {
        mentorId: parseInt(mentorId),
        sessionDate: sessionDate.toISOString(),
        durationMinutes: parseInt(bookingData.durationMinutes),
        notes: bookingData.notes,
        sessionType: bookingData.sessionType,
        status: 'active'
      };

      const createdBooking = await BookingService.createBooking(bookingToCreate);
      
      navigate('/booking-confirmation', { 
        state: { 
          bookingData: createdBooking,
          mentor: mentor 
        } 
      });
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.body?.detail || error.message || 'Ошибка при создании записи');
      alert('Не удалось создать запись. Пожалуйста, попробуйте снова.');
    } finally {
      setIsBooking(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!mentor) return 0;
    
    const basePrice = mentor.price || 0;
    const durationMultiplier = parseInt(bookingData.durationMinutes) / 60;
    const typeMultiplier = bookingData.sessionType === 'group' ? 0.7 : 1;
    
    return Math.round(basePrice * durationMultiplier * typeMultiplier);
  };

  const handleBackClick = () => {
    navigate(`/mentor/${mentorId}`);
  };

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

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

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

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Выберите дату и время</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sessionDate">Дата*</label>
                <input
                  type="date"
                  id="sessionDate"
                  name="sessionDate"
                  value={bookingData.sessionDate}
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
                <label htmlFor="durationMinutes">Длительность сессии</label>
                <select
                  id="durationMinutes"
                  name="durationMinutes"
                  value={bookingData.durationMinutes}
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

          <div className="price-summary">
            <div className="price-details">
              <div className="price-row">
                <span>Базовая стоимость:</span>
                <span>{mentor.price} ₽</span>
              </div>
              <div className="price-row">
                <span>Длительность:</span>
                <span>{bookingData.durationMinutes} мин</span>
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
              disabled={isBooking || !bookingData.sessionDate || !bookingData.time}
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