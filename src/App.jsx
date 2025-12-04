// src/App.jsx - ОБНОВЛЕННАЯ ВЕРСИЯ
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import MainScreen from './screens/MainScreen/MainScreen';
import AuthService from './services/AuthService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await AuthService.checkAuth();
        setIsAuthenticated(authResult.isAuthenticated);
        if (authResult.user) {
          setUser(authResult.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Обработчик входа
  const handleLogin = async (credentials) => {
    try {
      const result = await AuthService.login(credentials);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Ошибка при входе' };
    }
  };

  // Обработчик регистрации
  const handleRegister = async (userData) => {
    try {
      const result = await AuthService.register(userData);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Ошибка при регистрации' };
    }
  };

  // Обработчик выхода
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
              <MainScreen user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;