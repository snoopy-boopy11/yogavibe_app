// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import MainScreen from './screens/MainScreen/MainScreen';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('yogavibe_user');
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Обработчик входа
  const handleLogin = (userData) => {
    // Сохраняем полные данные пользователя
    const fullUserData = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('yogavibe_user', JSON.stringify(fullUserData));
    setIsAuthenticated(true);
  };

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('yogavibe_user');
    setIsAuthenticated(false);
  };

  // Обработчик регистрации
  const handleRegister = (userData) => {
    // Генерируем уникальный ID для нового пользователя
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      name: userData.name || userData.username,
      createdAt: new Date().toISOString()
    };
    
    // Сохраняем пользователя в список пользователей
    const users = JSON.parse(localStorage.getItem('yogavibe_users') || '[]');
    users.push(newUser);
    localStorage.setItem('yogavibe_users', JSON.stringify(users));
    
    // Автоматически логиним пользователя
    localStorage.setItem('yogavibe_user', JSON.stringify(newUser));
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/main" /> : 
              <LoginScreen onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/main" /> : 
              <RegisterScreen onRegister={handleRegister} />
            } 
          />
          <Route 
            path="/main" 
            element={
              isAuthenticated ? 
              <MainScreen onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;