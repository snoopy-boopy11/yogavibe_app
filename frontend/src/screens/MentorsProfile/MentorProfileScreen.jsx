import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MentorProfileScreen.css';

// Выносим моковые данные в константы (можно вынести в отдельный файл)
const MOCK_MENTORS = [
  { 
    id: 1, 
    name: "Анна Иванова", 
    description: "Опытный инструктор по хатха йоге с 5-летним стажем",
    gender: "female", 
    city: "Москва", 
    price: 2500, 
    yogaStyle: "Хатха",
    experience: "5 лет",
    certification: "Сертифицированный инструктор по хатха йоге",
    education: "Международная школа йоги, курс для инструкторов",
    specialization: "Йога для начинающих, восстановительная йога",
    languages: ["Русский", "Английский"],
    rating: 4.8,
    reviewsCount: 42,
    photo: null,
    availability: "Пн-Пт: 9:00-18:00, Сб: 10:00-15:00",
    certificateNumber: "2C8D9E4A1B0F3A6",
    registrationDate: "24.07.2024",
    philosophy: "Мой подход основан на индивидуальной работе с каждым учеником. Я верю, что йога - это не просто физическая практика, а путь к гармонии тела и разума. На своих занятиях я уделяю внимание не только правильному выполнению асан, но и дыхательным практикам, медитации и философии йоги.",
    achievements: "• Провел более 1000 индивидуальных сессий\n• Обучение у мастеров в Индии и Таиланде\n• Участник международных конференций по йоге\n• Автор статей о йоге и здоровом образе жизни"
  },
  { 
    id: 2, 
    name: "Дмитрий Петров", 
    description: "Специалист по аштанга йоге и медитации",
    gender: "male", 
    city: "Санкт-Петербург", 
    price: 3000, 
    yogaStyle: "Аштанга",
    experience: "7 лет",
    certification: "Сертификат преподавателя аштанга йоги",
    education: "Аштанга йога центр Майсора, Индия",
    specialization: "Продвинутые практики, медитация",
    languages: ["Русский", "Английский", "Хинди"],
    rating: 4.9,
    reviewsCount: 35,
    photo: null,
    availability: "Вт-Чт: 10:00-20:00, Сб-Вс: 9:00-14:00",
    certificateNumber: "3D9E4F5B2C1G4B7",
    registrationDate: "15.06.2023",
    philosophy: "Аштанга йога - это динамическая система, которая синхронизирует дыхание с движением. Я учу своих учеников дисциплине, концентрации и осознанности через практику. Каждая сессия - это шаг к самопознанию и внутренней силе.",
    achievements: "• Практика в Майсоре, Индия (2 года)\n• Ведущий мастер-классов по аштанга йоге\n• Специалист по йога-терапии для спины\n• Переводчик книг по йоге с английского"
  },
  { 
    id: 3, 
    name: "Мария Сидорова", 
    description: "Йога для беременных и восстановительная йога",
    gender: "female", 
    city: "Новосибирск", 
    price: 2000, 
    yogaStyle: "Восстановительная",
    experience: "6 лет",
    certification: "Сертифицированный инструктор по йоге для беременных",
    education: "Школа йоги для женщин",
    specialization: "Йога для беременных, послеродовая йога, йога для женщин",
    languages: ["Русский"],
    rating: 4.7,
    reviewsCount: 28,
    photo: null,
    availability: "Пн-Ср-Пт: 10:00-16:00",
    certificateNumber: "4E5F6A3D2H5C8",
    registrationDate: "10.03.2024",
    philosophy: "Йога для женщин - это особый подход, учитывающий цикличность женского организма. Я помогаю женщинам обрести гармонию с телом, подготовиться к материнству и восстановиться после родов.",
    achievements: "• Специализация по перинатальной йоге\n• Работа с женщинами всех возрастов\n• Проведение женских йога-ретритов\n• Консультации по здоровому образу жизни"
  },
  { 
    id: 4, 
    name: "Алексей Козлов", 
    description: "Инструктор по силовой йоге и йоге для мужчин",
    gender: "male", 
    city: "Екатеринбург", 
    price: 2800, 
    yogaStyle: "Силовая",
    experience: "4 года",
    certification: "Инструктор по силовой йоге",
    education: "Академия фитнеса и йоги",
    specialization: "Йога для мужчин, силовые асаны, работа с весом",
    languages: ["Русский", "Английский"],
    rating: 4.6,
    reviewsCount: 31,
    photo: null,
    availability: "Вт-Чт-Сб: 8:00-12:00, 17:00-21:00",
    certificateNumber: "5F6G7B4E3I6D9",
    registrationDate: "05.09.2023",
    philosophy: "Силовая йога - это прекрасный способ совместить физическую нагрузку с ментальной концентрацией. Я помогаю мужчинам развить силу, гибкость и выносливость через традиционные практики, адаптированные под современный ритм жизни.",
    achievements: "• Бывший профессиональный спортсмен\n• Специализация по йоге для спортсменов\n• Интеграция силовых тренировок с йогой\n• Тренер команды по кроссфиту"
  }
];

// Компонент поля информации
const InfoField = ({ label, value }) => (
  <div className="field-group">
    <label>{label}:</label>
    <div className="field-value">{value || 'Не указано'}</div>
  </div>
);

// Компонент отзыва
const ReviewItem = ({ author, date, text }) => (
  <div className="review-item">
    <div className="review-header">
      <span className="review-author">{author}</span>
      <span className="review-date">{date}</span>
    </div>
    <div className="review-text">{text}</div>
  </div>
);

const MentorProfileScreen = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentorData();
  }, [mentorId]);

  const loadMentorData = () => {
    setLoading(true);
    
    setTimeout(() => {
      const foundMentor = MOCK_MENTORS.find(m => m.id === parseInt(mentorId));
      
      if (foundMentor) {
        // Загружаем дополнительные данные из localStorage если они есть
        const allMentorProfiles = JSON.parse(localStorage.getItem('yogavibe_mentor_profiles') || '{}');
        const mentorProfile = allMentorProfiles[mentorId] || {};
        
        setMentor({
          ...foundMentor,
          ...mentorProfile
        });
      }
      
      setLoading(false);
    }, 300);
  };

  const handleBackClick = () => {
    navigate('/main');
  };

  const handleBookSession = () => {
    if (mentor) {
      navigate(`/booking/${mentor.id}`, { state: { mentor } });
    }
  };

  if (loading) {
    return (
      <div className="mentor-profile-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка профиля ментора...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="mentor-profile-not-found">
        <h2>Ментор не найден</h2>
        <button onClick={handleBackClick} className="back-btn">
          Вернуться к списку менторов
        </button>
      </div>
    );
  }

  return (
    <div className="mentor-profile-page">
      <div className="mentor-profile-content">
        <div className="mentor-profile-card">
          {/* Заголовок с кнопкой назад */}
          <div className="mentor-profile-header">
            <button 
              onClick={handleBackClick}
              className="back-btn"
              aria-label="Вернуться к списку менторов"
            >
              ← Назад к менторам
            </button>
            <h1>Профиль ментора</h1>
          </div>

          {/* Двухколоночный лейаут */}
          <div className="mentor-profile-layout">
            {/* Левая колонка - фото и основная информация */}
            <div className="mentor-profile-left">
              <div className="mentor-photo-section">
                <div className="mentor-photo-placeholder">
                  {mentor.photo ? (
                    <img 
                      src={mentor.photo} 
                      alt={`Фото ментора ${mentor.name}`}
                      className="mentor-photo"
                    />
                  ) : (
                    <div className="mentor-photo-text">
                      <div className="mentor-icon">👤</div>
                      <div>{mentor.name.split(' ')[0]}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mentor-basic-info">
                <h2 className="mentor-name">{mentor.name}</h2>
                <div className="mentor-rating">
                  <span className="rating-stars">★★★★★</span>
                  <span className="rating-value">{mentor.rating}</span>
                  <span className="reviews-count">({mentor.reviewsCount} отзывов)</span>
                </div>
                <div className="mentor-price-tag">
                  <span className="price-label">Стоимость сессии:</span>
                  <span className="price-value">{mentor.price} ₽/час</span>
                </div>
                <div className="mentor-location">
                  <span className="location-icon">📍</span>
                  <span>{mentor.city}</span>
                </div>
              </div>

              {/* Кнопка записи */}
              <button
                onClick={handleBookSession}
                className="book-btn-large"
              >
                ЗАПИСАТЬСЯ НА СЕССИЮ
              </button>
            </div>

            {/* Правая колонка - анкета ментора */}
            <div className="mentor-profile-right">
              <div className="sections-container">
                {/* Информация о менторе */}
                <div className="mentor-section">
                  <h3>О МЕНТОРЕ</h3>
                  <InfoField label="Стиль йоги" value={mentor.yogaStyle} />
                  <InfoField label="Опыт преподавания" value={mentor.experience} />
                  <InfoField label="Специализация" value={mentor.specialization} />
                  <InfoField label="Доступность" value={mentor.availability} />
                </div>

                {/* Образование и сертификация */}
                <div className="mentor-section">
                  <h3>ОБРАЗОВАНИЕ И СЕРТИФИКАЦИЯ</h3>
                  <InfoField label="Образование" value={mentor.education} />
                  <InfoField label="Сертификация" value={mentor.certification} />
                  <InfoField label="Номер сертификата" value={mentor.certificateNumber} />
                  <InfoField label="Дата регистрации" value={mentor.registrationDate} />
                </div>

                {/* Контакты */}
                <div className="mentor-section">
                  <h3>КОНТАКТНАЯ ИНФОРМАЦИЯ</h3>
                  <InfoField label="Город" value={mentor.city} />
                  <InfoField label="Языки" value={mentor.languages?.join(', ')} />
                  <InfoField label="Способ связи" value="Через платформу YogaVibe" />
                </div>

                {/* Философия и подход */}
                <div className="mentor-section">
                  <h3>ФИЛОСОФИЯ И ПОДХОД</h3>
                  <div className="field-group full-width">
                    <div className="field-value philosophy-text">
                      {mentor.philosophy}
                    </div>
                  </div>
                </div>

                {/* Достижения */}
                <div className="mentor-section">
                  <h3>ДОСТИЖЕНИЯ</h3>
                  <div className="field-group full-width">
                    <div className="field-value achievements-text">
                      {mentor.achievements}
                    </div>
                  </div>
                </div>

                {/* Отзывы */}
                <div className="mentor-section">
                  <h3>ОТЗЫВЫ УЧЕНИКОВ</h3>
                  <div className="reviews-list">
                    <ReviewItem 
                      author="Мария С."
                      date="15.01.2024"
                      text="Отличный специалист! Очень внимательный и профессиональный подход. После занятий чувствую себя значительно лучше."
                    />
                    <ReviewItem 
                      author="Алексей К."
                      date="10.01.2024"
                      text={`${mentor.name} - настоящий профессионал. Помог мне справиться с болями в спине и улучшить осанку. Рекомендую!`}
                    />
                    <ReviewItem 
                      author="Елена В."
                      date="05.01.2024"
                      text="Занимаюсь уже 3 месяца, прогресс налицо. Стала более гибкой и спокойной. Спасибо за индивидуальный подход!"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileScreen;