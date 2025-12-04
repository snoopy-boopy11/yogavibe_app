// src/screens/LoginScreen/LoginScreen.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginScreen.css';
import logo from './flower.svg';
import eyeShow from './eye-show.svg';
import eyeHide from './eye-hide.svg';

// Константы для моковых пользователей
const MOCK_USERS = [
  { 
    id: 1, 
    username: 'testuser', 
    email: 'test@example.com', 
    password: 'password123', 
    name: 'Тестовый Пользователь' 
  },
  { 
    id: 2, 
    username: 'yogi', 
    email: 'yogi@example.com', 
    password: 'yoga123', 
    name: 'Йогин Тестовый' 
  }
];

const LoginScreen = ({ onLogin }) => {
  // Состояние для видимости пароля
  const [showPassword, setShowPassword] = useState(false);
  
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  
  // Состояния для ошибок и загрузки
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Функция для поиска пользователя
  const findUser = (usersArray, login, password) => {
    return usersArray.find(u => 
      (u.email === login || u.username === login) && 
      u.password === password
    );
  };

  // Переключение видимости пароля
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Сброс ошибки при изменении поля
  };

  // Валидация формы
  const validateForm = () => {
    if (!formData.login.trim()) {
      setError('Введите логин или email');
      return false;
    }
    
    // Если введен email, проверяем его формат
    if (formData.login.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.login)) {
        setError('Введите корректный email');
        return false;
      }
    }
    
    if (!formData.password.trim()) {
      setError('Введите пароль');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    
    return true;
  };

  // Обработчик входа
  const handleLogin = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Ищем в localStorage
      const users = JSON.parse(localStorage.getItem('yogavibe_users') || '[]');
      let user = findUser(users, formData.login, formData.password);
      
      // 2. Если не нашли, ищем в моковых данных
      if (!user) {
        user = findUser(MOCK_USERS, formData.login, formData.password);
      }

      if (user) {
        // Общая логика для успешного входа
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name || user.username
        };
        
        onLogin(userData);
        // Сохраняем информацию о входе в localStorage
        localStorage.setItem('yogavibe_currentUser', JSON.stringify(userData));
        localStorage.setItem('yogavibe_isLoggedIn', 'true');
        
        navigate('/main');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка при входе. Попробуйте еще раз.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Заполнение формы тестовыми данными
  const fillTestData = () => {
    setFormData({
      login: 'testuser',
      password: 'password123'
    });
    setError(''); // Сбрасываем ошибку при заполнении тестовых данных
  };

  // Переход на главную страницу
  const goToWelcome = () => {
    navigate('/');
  };

  // Очистка формы
  const clearForm = () => {
    setFormData({
      login: '',
      password: ''
    });
    setError('');
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* Текстовый блок с мотивационным текстом */}
        <div className="login-text">
          <p>Неважно, как медленно ты продвигаешься</p>
          <p>Главное — ты не останавливаешься</p>
          <p>И мы будем с тобой на каждом вдохе</p>
        </div>
        
        {/* Форма входа */}
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <h3 className="entry">ВХОД В АККАУНТ</h3>
          
          {/* Иконка цветка */}
          <div className="flower-icon">
            <img src={logo} alt="Цветочек" />
          </div>
          
          {/* Сообщение об ошибке */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}
          
          {/* Поле для логина/email */}
          <div className="input-group">
            <input 
              type="text" 
              name="login"
              placeholder="логин или email"
              className="login-input"
              value={formData.login}
              onChange={handleChange}
              disabled={loading}
              required
              aria-label="Логин или email"
              aria-invalid={!!error}
            />
          </div>
          
          {/* Поле для пароля с переключателем видимости */}
          <div className="input-group password-group">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="пароль"
              className="login-input password-input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength="6"
              aria-label="Пароль"
              aria-invalid={!!error}
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              disabled={loading}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              tabIndex="0"
            >
              <img
                src={showPassword ? eyeHide : eyeShow} 
                alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                className="password-icon"
              />
            </button>
          </div>

          {/* Кнопка входа */}
          <button 
            className="login-button" 
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'ВХОД...' : 'Войти'}
          </button>
          
          {/* Дополнительные опции */}
          <div className="login-options">
            <div className="options-left">
              <Link to="/register" className="register">
                Регистрация
              </Link>
            </div>
            
            <div className="options-right">
              {/* Кнопка для тестового входа */}
              <button 
                type="button"
                className="demo-button"
                onClick={fillTestData}
                disabled={loading}
              >
                Тестовый вход
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Кнопка возврата на главную страницу */}
      <div className="welcome-back-container">
        <button 
          type="button"
          className="welcome-back-btn"
          onClick={goToWelcome}
          aria-label="Вернуться на главную страницу"
        >
          ← Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;