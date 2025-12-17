import ApiService from './ApiService';

class BookingService {
  async getBookings() {
    try {
      const response = await api.get('/bookings');
      // Конвертируем snake_case в camelCase
      return response.data.map(booking => ({
        id: booking.id,
        mentorId: booking.mentor_id,
        mentorName: booking.mentor?.name,
        sessionDate: booking.session_date,
        durationMinutes: booking.duration_minutes,
        price: booking.price,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.created_at,
        sessionType: booking.session_type
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }
  
  // Получение всех бронирований пользователя
  static async getBookings() {
    try {
      console.log('BookingService: Getting bookings...');
      const response = await ApiService.request('/bookings', {
        method: 'GET'
      });
      console.log('BookingService: Bookings received:', response);
      return response;
    } catch (error) {
      console.error('BookingService: Error fetching bookings:', error);
      
      // Пробрасываем оригинальную ошибку с дополнительной информацией
      const enhancedError = new Error(`Не удалось загрузить записи: ${error.message || 'Неизвестная ошибка'}`);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  // Создание нового бронирования
  static async createBooking(bookingData) {
    try {
      console.log('BookingService: Creating booking:', bookingData);
      
      // Валидация входных данных
      if (!bookingData.mentorId) {
        throw new Error('Не указан ID ментора');
      }
      
      if (!bookingData.sessionDate) {
        throw new Error('Не указана дата сессии');
      }
      
      if (!bookingData.durationMinutes || bookingData.durationMinutes <= 0) {
        throw new Error('Длительность должна быть больше 0 минут');
      }
      
      // Проверяем формат даты
      const sessionDate = new Date(bookingData.sessionDate);
      if (isNaN(sessionDate.getTime())) {
        throw new Error('Некорректный формат даты');
      }
      
      // Проверяем, что дата в будущем
      const now = new Date();
      if (sessionDate <= now) {
        throw new Error('Дата сессии должна быть в будущем');
      }
      
      // Форматируем данные для бэкенда
      const backendData = {
        mentor_id: Number(bookingData.mentorId),
        session_date: sessionDate.toISOString(), // ✅ Конвертируем в ISO строку
        duration_minutes: Number(bookingData.durationMinutes),
        notes: bookingData.notes || null,
        session_type: bookingData.sessionType || 'individual' // ✅ Добавляем тип сессии
      };
      
      console.log('BookingService: Sending to backend:', backendData);
      
      const response = await ApiService.request('/bookings', {
        method: 'POST',
        body: backendData
      });
      
      console.log('BookingService: Booking created successfully:', response);
      
      // Сохраняем в localStorage как fallback
      try {
        await this.saveToLocalStorage({
          ...bookingData,
          id: response.id || Date.now().toString(),
          status: 'active',
          createdAt: new Date().toISOString()
        });
      } catch (storageError) {
        console.warn('BookingService: Could not save to localStorage:', storageError);
      }
      
      return {
        ...response,
        sessionDate: new Date(response.session_date || response.sessionDate),
        sessionType: response.session_type || response.sessionType || 'individual'
      };
      
    } catch (error) {
      console.error('BookingService: Error creating booking:', error);
      
      // Улучшаем сообщение об ошибке
      let errorMessage = 'Не удалось создать запись';
      
      if (error.body?.detail) {
        errorMessage = error.body.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      enhancedError.userMessage = errorMessage;
      
      throw enhancedError;
    }
  }

  // Отмена бронирования
  static async cancelBooking(bookingId) {
    try {
      console.log('BookingService: Cancelling booking:', bookingId);
      
      const response = await ApiService.request(`/bookings/${bookingId}`, {
        method: 'PUT',
        body: { status: 'cancelled' }
      });
      
      console.log('BookingService: Booking cancelled successfully:', response);
      
      // Обновляем localStorage
      try {
        await this.updateLocalStorageStatus(bookingId, 'cancelled');
      } catch (storageError) {
        console.warn('BookingService: Could not update localStorage:', storageError);
      }
      
      return response;
    } catch (error) {
      console.error('BookingService: Error cancelling booking:', error);
      
      const enhancedError = new Error(
        error.body?.detail || error.message || 'Не удалось отменить запись'
      );
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  }

  // Отметить бронирование как завершенное
  static async completeBooking(bookingId) {
    try {
      console.log('BookingService: Completing booking:', bookingId);
      
      const response = await ApiService.request(`/bookings/${bookingId}`, {
        method: 'PUT',
        body: { status: 'completed' }
      });
      
      console.log('BookingService: Booking completed successfully:', response);
      
      // Обновляем localStorage
      try {
        await this.updateLocalStorageStatus(bookingId, 'completed');
      } catch (storageError) {
        console.warn('BookingService: Could not update localStorage:', storageError);
      }
      
      return response;
    } catch (error) {
      console.error('BookingService: Error completing booking:', error);
      
      const enhancedError = new Error(
        error.body?.detail || error.message || 'Не удалось завершить запись'
      );
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  }

  // Вспомогательные методы для localStorage

  static async saveToLocalStorage(bookingData) {
    try {
      const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
      const user = JSON.parse(localStorage.getItem('yogavibe_user') || '{}');
      
      const bookingWithUser = {
        ...bookingData,
        userId: user.id,
        mentorName: bookingData.mentorName || 'Неизвестный ментор',
        price: bookingData.price || 0
      };
      
      allBookings.push(bookingWithUser);
      localStorage.setItem('yogavibe_bookings', JSON.stringify(allBookings));
      
      return true;
    } catch (error) {
      console.error('BookingService: Error saving to localStorage:', error);
      throw error;
    }
  }

  static async updateLocalStorageStatus(bookingId, status) {
    try {
      const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
      const updatedBookings = allBookings.map(booking => {
        if (booking.id === bookingId) {
          return { ...booking, status: status };
        }
        return booking;
      });
      
      localStorage.setItem('yogavibe_bookings', JSON.stringify(updatedBookings));
      
      return true;
    } catch (error) {
      console.error('BookingService: Error updating localStorage:', error);
      throw error;
    }
  }

  // Получение бронирований из localStorage
  static getLocalBookings(userId) {
    try {
      const allBookings = JSON.parse(localStorage.getItem('yogavibe_bookings') || '[]');
      return allBookings.filter(booking => booking.userId === userId);
    } catch (error) {
      console.error('BookingService: Error getting local bookings:', error);
      return [];
    }
  }
}

export default BookingService;