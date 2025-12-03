// src/screens/LoginScreen/LoginScreen.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginScreen.css';
import logo from './flower.svg';
import eyeShow from './eye-show.svg';
import eyeHide from './eye-hide.svg';

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
    if (!formData.password.trim()) {
      setError('Введите пароль');
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
      // Проверка пользователей из localStorage
      const users = JSON.parse(localStorage.getItem('yogavibe_users') || '[]');
      
      // Поиск пользователя
      const user = users.find(u => 
        (u.email === formData.login || u.username === formData.login) && 
        u.password === formData.password
      );

      if (user) {
        // Успешный вход с пользователем из localStorage
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name || user.username
        };
        
        onLogin(userData);
        navigate('/main');
      } else {
        // Проверка моковых пользователей
        const mockUsers = [
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

        const mockUser = mockUsers.find(u => 
          (u.email === formData.login || u.username === formData.login) && 
          u.password === formData.password
        );

        if (mockUser) {
          // Успешный вход с моковым пользователем
          const userData = {
            id: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            name: mockUser.name
          };
          
          onLogin(userData);
          navigate('/main');
        } else {
          setError('Неверный логин или пароль');
        }
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
  };

  // Переход на главную страницу
  const goToWelcome = () => {
    navigate('/');
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
              aria-label="Пароль"
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              disabled={loading}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
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
            {loading ? 'ВХОД...' : 'ВОЙТИ'}
          </button>
          
          {/* Дополнительные опции */}
          <div className="login-options">
            <Link to="/register" className="register">
              регистрация
            </Link>
            
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