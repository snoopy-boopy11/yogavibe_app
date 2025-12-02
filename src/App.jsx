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

  // Проверяем наличие токена/пользователя при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('yogavibe_user');
      if (user) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('yogavibe_user', JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('yogavibe_user');
    setIsAuthenticated(false);
  };

  const handleRegister = (userData) => {
    // Сохраняем нового пользователя
    const users = JSON.parse(localStorage.getItem('yogavibe_users') || '[]');
    users.push(userData);
    localStorage.setItem('yogavibe_users', JSON.stringify(users));
    
    // Автоматически логиним пользователя после регистрации
    localStorage.setItem('yogavibe_user', JSON.stringify(userData));
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