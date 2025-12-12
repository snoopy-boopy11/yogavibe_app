// src/services/AuthService.js
import ApiService from './ApiService';

class AuthService {
  // Проверка аутентификации
  static async checkAuth() {
    try {
      if (!ApiService.isAuthenticated()) {
        return { isAuthenticated: false };
      }
      
      // Пробуем получить данные пользователя с сервера
      const userData = await ApiService.getCurrentUser().catch(() => null);
      
      if (userData) {
        // Обновляем данные пользователя в localStorage
        ApiService.setUserData(userData);
        return {
          isAuthenticated: true,
          user: userData
        };
      } else {
        // Если не удалось получить данные, удаляем токены
        ApiService.clearAuth();
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return { isAuthenticated: false };
    }
  }

  // Вход пользователя через API
  static async login(credentials) {
    try {
      // Используем ApiService для отправки запроса на бэкенд
      const response = await ApiService.login(credentials);
      
      // В ответе от бэкенда уже есть access_token, refresh_token и user
      return {
        success: true,
        user: response.user
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Обрабатываем ошибки API
      let message = 'Ошибка при входе';
      
      if (error.status === 401) {
        message = 'Неверный логин или пароль';
      } else if (error.status === 403) {
        message = 'Пользователь деактивирован';
      } else if (error.body && error.body.detail) {
        message = error.body.detail;
      } else if (error.message) {
        message = error.message;
      }
      
      return {
        success: false,
        message: message
      };
    }
  }

  // Регистрация через API
  static async register(userData) {
    try {
      // Формируем данные для регистрации (совместимые с UserCreate схемой)
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name || userData.username
      };
      
      const response = await ApiService.register(registrationData);
      
      return {
        success: true,
        user: response.user
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let message = 'Ошибка при регистрации';
      
      if (error.status === 400) {
        if (error.body && error.body.detail) {
          message = error.body.detail;
        } else {
          message = 'Пользователь с таким email или именем уже существует';
        }
      } else if (error.body && error.body.detail) {
        message = error.body.detail;
      }
      
      return {
        success: false,
        message: message
      };
    }
  }

  // Выход через API
  static async logout() {
    try {
      // Используем ApiService для выхода
      await ApiService.logout();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Все равно очищаем локальные данные
      ApiService.clearAuth();
      return { success: true };
    }
  }

  // Получение текущего пользователя
  static getCurrentUser() {
    return ApiService.getUserData();
  }

  // Проверка, авторизован ли пользователь
  static isAuthenticated() {
    return ApiService.isAuthenticated();
  }

  // Обновление профиля пользователя
  static async updateProfile(profileData) {
    try {
      const updatedUser = await ApiService.updateUserProfile(profileData);
      ApiService.setUserData(updatedUser);
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.body?.detail || 'Ошибка при обновлении профиля'
      };
    }
  }
}

export default AuthService;