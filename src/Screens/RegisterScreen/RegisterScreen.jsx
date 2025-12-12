import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterScreen.css';
import logo from '../LoginScreen/flower.svg';
import eyeShow from '../LoginScreen/eye-show.svg';
import eyeHide from '../LoginScreen/eye-hide.svg';

const RegisterScreen = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Автозаполнение поля name из username
    if (name === 'username' && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя должно быть не менее 3 символов';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Имя должно быть не более 50 символов';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email должен быть не более 100 символов';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    } else if (formData.password.length > 100) {
      newErrors.password = 'Пароль должен быть не более 100 символов';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно быть не менее 2 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim()
      };
      
      console.log('Registering user:', { ...userData, password: '***' });
      
      const result = await onRegister(userData);
      
      if (result.success) {
        console.log('Registration successful, navigating to /main');
        navigate('/main');
      } else {
        console.log('Registration failed:', result.message);
        
        // Обработка ошибок от API
        if (result.message && result.message.toLowerCase().includes('email')) {
          setErrors({ email: result.message });
        } else if (result.message && result.message.toLowerCase().includes('username')) {
          setErrors({ username: result.message });
        } else if (result.message && result.message.toLowerCase().includes('имя')) {
          setErrors({ username: result.message });
        } else if (result.message && result.message.toLowerCase().includes('пользователь')) {
          setErrors({ general: result.message });
        } else {
          setErrors({ general: result.message || 'Ошибка регистрации' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Ошибка при регистрации. Попробуйте еще раз.' });
    } finally {
      setLoading(false);
    }
  };

  const goToWelcome = () => {
    navigate('/');
  };

  return (
    <div className="register-screen">
      <div className="register-container">
        <div className="register-text">
          <p>Неважно, как медленно ты продвигаешься</p>
          <p>Главное — ты не останавливаешься</p>
          <p>И мы будем с тобой на каждом вдохе</p>
        </div>
        
        <form className="register-form" onSubmit={handleRegister} noValidate>
          <h3 className="entry">РЕГИСТРАЦИЯ</h3>
          
          <div className="flower-icon">
            <img src={logo} alt="Цветочек" />
          </div>
          
          {errors.general && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {errors.general}
            </div>
          )}
          
          <div className="input-group">
            <input 
              type="text" 
              name="username"
              placeholder="логин (для входа)"
              className={`register-input ${errors.username ? 'input-error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
              minLength="3"
              maxLength="50"
              aria-label="Имя пользователя (логин)"
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <span className="field-error" role="alert">
                {errors.username}
              </span>
            )}
          </div>
          
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
              maxLength="100"
              aria-label="Email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              name="name"
              placeholder="ваше имя"
              className={`register-input ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              minLength="2"
              maxLength="100"
              aria-label="Ваше имя"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span className="field-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>
          
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
              minLength="6"
              maxLength="100"
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
              minLength="6"
              maxLength="100"
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

          <button 
            className="register-button" 
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          <div className="register-options">
            <Link to="/login" className="login-link">
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
      
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