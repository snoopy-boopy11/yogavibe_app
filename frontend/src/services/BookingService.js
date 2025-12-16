import ApiService from './ApiService';

class BookingService {
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
      throw error;
    }
  }

  // Создание нового бронирования
  static async createBooking(bookingData) {
    try {
      console.log('BookingService: Creating booking:', bookingData);
      
      const backendData = {
        mentor_id: bookingData.mentorId,
        session_date: bookingData.sessionDate,
        duration_minutes: parseInt(bookingData.durationMinutes),
        notes: bookingData.notes || null,
        status: 'active' // Сразу активная
      };
      
      console.log('BookingService: Sending to backend:', backendData);
      
      const response = await ApiService.request('/bookings', {
        method: 'POST',
        body: backendData
      });
      
      console.log('BookingService: Booking created successfully:', response);
      return response;
    } catch (error) {
      console.error('BookingService: Error creating booking:', error);
      throw error;
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
      return response;
    } catch (error) {
      console.error('BookingService: Error cancelling booking:', error);
      throw error;
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
      return response;
    } catch (error) {
      console.error('BookingService: Error completing booking:', error);
      throw error;
    }
  }
}

export default BookingService;