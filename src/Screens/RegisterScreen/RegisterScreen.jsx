// src/screens/RegisterScreen/RegisterScreen.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterScreen.css';
import logo from '../LoginScreen/flower.svg';
import eyeShow from '../LoginScreen/eye-show.svg';
import eyeHide from '../LoginScreen/eye-hide.svg';

const RegisterScreen = ({ onRegister }) => {
  // Состояния для видимости паролей
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Состояния для ошибок и загрузки
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Переключение видимости основного пароля
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Переключение видимости подтверждения пароля
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очистка ошибки для конкретного поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Валидация всех полей формы
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Валидация имени пользователя
    if (!formData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя должно быть не менее 3 символов';
    }
    
    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    // Валидация пароля
    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    // Валидация подтверждения пароля
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Проверка существующего пользователя
  const checkExistingUser = () => {
    const users = JSON.parse(localStorage.getItem('yogavibe_users') || '[]');
    return users.find(user => 
      user.username === formData.username || user.email === formData.email
    );
  };

  // Обработчик регистрации
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const existingUser = checkExistingUser();
    if (existingUser) {
      if (existingUser.username === formData.username) {
        setErrors({ username: 'Пользователь с таким именем уже существует' });
      } else {
        setErrors({ email: 'Пользователь с таким email уже существует' });
      }
      return;
    }
    
    setLoading(true);

    try {
      // Создание нового пользователя
      const newUser = {
        id: Date.now(), // Уникальный ID на основе времени
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.username.trim(),
        createdAt: new Date().toISOString(),
        profile: {
          city: '',
          yogaStyle: '',
          experience: '',
          goals: ''
        }
      };
      
      // Сохранение пользователя в localStorage
      const users = JSON.parse(localStorage.getItem('yogavibe_users') || '[]');
      users.push(newUser);
      localStorage.setItem('yogavibe_users', JSON.stringify(users));
      
      // Автоматический вход после регистрации
      const userData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name
      };
      
      onRegister(userData);
      navigate('/main');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Ошибка при регистрации. Попробуйте еще раз.' });
    } finally {
      setLoading(false);
    }
  };

  // Заполнение формы демо-данными
  const handleDemoFill = () => {
    const randomId = Date.now().toString().slice(-4);
    setFormData({
      username: 'yogiuser',
      email: `yogi${randomId}@example.com`,
      password: 'yoga123',
      confirmPassword: 'yoga123'
    });
    setErrors({});
  };

  // Переход на главную страницу
  const goToWelcome = () => {
    navigate('/');
  };

  return (
    <div className="register-screen">
      <div className="register-container">
        {/* Мотивационный текст */}
        <div className="register-text">
          <p>Неважно, как медленно ты продвигаешься</p>
          <p>Главное — ты не останавливаешься</p>
          <p>И мы будем с тобой на каждом вдохе</p>
        </div>
        
        {/* Форма регистрации */}
        <form className="register-form" onSubmit={handleRegister} noValidate>
          <h3 className="entry">РЕГИСТРАЦИЯ</h3>
          
          {/* Иконка цветка */}
          <div className="flower-icon">
            <img src={logo} alt="Цветочек" />
          </div>
          
          {/* Общее сообщение об ошибке */}
          {errors.general && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {errors.general}
            </div>
          )}
          
          {/* Поле для имени пользователя */}
          <div className="input-group">
            <input 
              type="text" 
              name="username"
              placeholder="имя пользователя"
              className={`register-input ${errors.username ? 'input-error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
              aria-label="Имя пользователя"
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <span className="field-error" role="alert">
                {errors.username}
              </span>
            )}
          </div>
          
          {/* Поле для email */}
          <div className="input-group">
            <input 
              type="email" 
              name="email"
              placeholder="email"
              className={`register-input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              aria-label="Email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          
          {/* Поле для пароля */}
          <div className="input-group password-group">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="пароль"
              className={`register-input password-input ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              aria-label="Пароль"
              aria-invalid={!!errors.password}
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
            {errors.password && (
              <span className="field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Поле для подтверждения пароля */}
          <div className="input-group password-group">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="подтвердите пароль"
              className={`register-input password-input ${errors.confirmPassword ? 'input-error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              aria-label="Подтверждение пароля"
              aria-invalid={!!errors.confirmPassword}
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              disabled={loading}
              aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <img
                src={showConfirmPassword ? eyeHide : eyeShow} 
                alt={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                className="password-icon"
              />
            </button>
            {errors.confirmPassword && (
              <span className="field-error" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Кнопка регистрации */}
          <button 
            className="register-button" 
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          {/* Дополнительные опции */}
          <div className="register-options">
            <Link to="/login" className="login-link">
              Уже есть аккаунт? Войти
            </Link>
            
            {/* Кнопка для заполнения демо-данных */}
            <button 
              type="button"
              className="demo-button"
              onClick={handleDemoFill}
              disabled={loading}
            >
              Заполнить демо-данные
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

export default RegisterScreen;