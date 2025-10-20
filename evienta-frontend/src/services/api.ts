import axios from 'axios';

// API service for making authenticated requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('evienta_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);
    const method = (options.method || 'GET').toLowerCase();
    const headers = { ...(this.getAuthHeaders()), ...(options.headers || {}) };
    let axiosConfig: any = {
      url,
      method,
      headers,
      // For GET, params should be used instead of data
      ...(method === 'get' ? { params: undefined } : {}),
    };
    if (options.body) {
      try {
        // Try to parse body if it's a stringified JSON
        axiosConfig.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      } catch {
        axiosConfig.data = options.body;
      }
    }
    try {
      const response = await axios(axiosConfig);
      console.log(`📡 API Response: ${response.status} ${response.statusText}`);
      const data = response.data;
      if (response.status < 200 || response.status >= 300) {
        console.error(`❌ API Error: ${endpoint}`, data);
        throw new Error(data.message || 'Request failed');
      }
      // console.log(`✅ API Success: ${endpoint}`, data);
      return data;
    } catch (error: any) {
      if (error.response) {
        console.error('API Request failed:', {
          url,
          error: error.response.data?.message || error.message,
          endpoint
        });
        throw new Error(error.response.data?.message || error.message);
      } else {
        console.error('API Request failed:', {
          url,
          error: error.message,
          endpoint
        });
        throw error;
      }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  // Venues endpoints
  async getVenues(params: any = {}) {
    try {
      const queryString = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== false) {
          queryString.append(key, params[key].toString());
        }
      });
      const query = queryString.toString();
      console.log('Fetching venues with params:', params, 'Query string:', query);
      return this.request(`/venues${query ? '?' + query : ''}`);
    } catch (error) {
      console.error('getVenues error:', error);
      return { venues: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  }

  async getVenue(id: string) {
    return this.request(`/venues/${id}`);
  }

  async createVenue(venueData: any) {
    try {
      console.log('Creating venue with data:', venueData);
      return this.request('/venues', {
        method: 'POST',
        body: JSON.stringify(venueData)
      });
    } catch (error) {
      console.error('createVenue error:', error);
      throw error;
    }
  }

  async updateVenue(id: string, venueData: any) {
    try {
      console.log('Updating venue:', id, 'with data:', venueData);
      return this.request(`/venues/${id}`, {
        method: 'PUT',
        body: JSON.stringify(venueData)
      });
    } catch (error) {
      console.error('updateVenue error:', error);
      throw error;
    }
  }

  async deleteVenue(id: string) {
    try {
      console.log('Deleting venue:', id);
      return this.request(`/venues/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('deleteVenue error:', error);
      throw error;
    }
  }

  async getVenueAvailability(id: string, date: string, duration?: number) {
    const params = new URLSearchParams({ date });
    if (duration) params.append('duration', duration.toString());
    return this.request(`/venues/${id}/availability?${params}`);
  }

  // Bookings endpoints
  async createBooking(bookingData: any) {
    try {
      console.log('Creating booking with data:', bookingData);
      return this.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    } catch (error) {
      console.error('createBooking error:', error);
      throw error;
    }
  }

  async getUserBookings(params: any = {}) {
    try {
      const queryString = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== false) {
          queryString.append(key, params[key].toString());
        }
      });
      const query = queryString.toString();
      console.log('Fetching user bookings with params:', params);
      return this.request(`/bookings/my-bookings${query ? '?' + query : ''}`);
    } catch (error) {
      console.error('getUserBookings error:', error);
      return { bookings: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  }

  async getProviderBookings(params: any = {}) {
    const queryString = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryString.append(key, params[key].toString());
      }
    });
    return this.request(`/bookings/provider-bookings?${queryString}`);
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: string, reason?: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, cancellation_reason: reason })
    });
  }

  async cancelBooking(id: string, reason?: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellation_reason: reason })
    });
  }

  // Reviews endpoints
  async createReview(reviewData: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async getVenueReviews(venueId: string, params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/venue/${venueId}?${queryString}`);
  }

  async getProviderReviews(providerId: string, params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/provider/${providerId}?${queryString}`);
  }

  async getUserReviews(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/my-reviews?${queryString}`);
  }

  async respondToReview(id: string, response: string) {
    return this.request(`/reviews/${id}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ response })
    });
  }

  async reportReview(id: string, reason: string) {
    return this.request(`/reviews/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  // Messages endpoints
  async getConversations(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/conversations?${queryString}`);
  }

  async getMessages(participantId: string, params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/conversation/${participantId}?${queryString}`);
  }

  async sendMessage(messageData: any) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async markMessagesAsRead(participantId: string) {
    return this.request(`/messages/mark-read/${participantId}`, {
      method: 'PUT'
    });
  }

  async getUnreadCount() {
    return this.request('/messages/unread-count');
  }

  async deleteMessage(messageId: string) {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE'
    });
  }

  async searchMessages(query: string, participantId?: string, params: any = {}) {
    const searchParams = new URLSearchParams({ q: query, ...params });
    if (participantId) searchParams.append('participant_id', participantId);
    return this.request(`/messages/search?${searchParams}`);
  }

  // Providers endpoints
  async getProviders(params: any = {}) {
    try {
      const queryString = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== false) {
          queryString.append(key, params[key].toString());
        }
      });
      const query = queryString.toString();
      console.log('Fetching providers with params:', params, 'Query string:', query);
      return this.request(`/providers${query ? '?' + query : ''}`);
    } catch (error) {
      console.error('getProviders error:', error);
      return { providers: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
  }

  async getProvider(id: string) {
    return this.request(`/providers/${id}`);
  }

  async updateProviderProfile(profileData: any) {
    try {
      console.log('Updating provider profile with data:', profileData);
      return this.request('/providers/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      console.error('updateProviderProfile error:', error);
      throw error;
    }
  }

  async getProviderProfile() {
    return this.request('/providers/profile/me');
  }

  async getProviderAnalytics() {
    return this.request('/providers/analytics/dashboard');
  }

  // Users endpoints
  async getUsers(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }

  async getUserLoyalty(userId: string) {
    return this.request(`/users/${userId}/loyalty`);
  }

  async getUserStats() {
    return this.request('/users/stats/overview');
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getPendingProviders(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/pending-providers?${queryString}`);
  }

  async updateProviderStatus(providerId: string, action: 'approve' | 'reject', reason?: string) {
    return this.request(`/admin/providers/${providerId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason })
    });
  }

  async getReports(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/reports?${queryString}`);
  }

  async moderateContent(type: string, id: string, action: string, reason?: string) {
    return this.request(`/admin/reports/${type}/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason })
    });
  }

  async getPlatformSettings() {
    return this.request('/admin/settings');
  }

  async updatePlatformSettings(settings: any) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  async broadcastNotification(notificationData: any) {
    return this.request('/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  async getAdminLogs(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/logs?${queryString}`);
  }

  // Payment endpoints
  async confirmPayment(paymentIntentId: string, bookingId: string) {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId, booking_id: bookingId })
    });
  }

  async getPaymentHistory() {
    return this.request('/payments/history');
  }

  async requestRefund(bookingId: string, reason?: string) {
    return this.request('/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, reason })
    });
  }

  // Upload endpoints
  async uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('evienta_token');
    try {
      const response = await axios.post(`${API_BASE_URL}/upload/single/${type}`, formData, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = response.data;
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Upload failed');
    }
  }

  async uploadMultipleFiles(files: File[], type: string) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const token = localStorage.getItem('evienta_token');
    try {
      const response = await axios.post(`${API_BASE_URL}/upload/multiple/${type}`, formData, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = response.data;
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Upload failed');
    }
  }

  async deleteFile(type: string, filename: string) {
    return this.request(`/upload/${type}/${filename}`, {
      method: 'DELETE'
    });
  }

  async getFileInfo(type: string, filename: string) {
    return this.request(`/upload/${type}/${filename}/info`);
  }

  async listFiles(type: string) {
    return this.request(`/upload/${type}`);
  }

  async getServices(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/services?${queryString}`);
  }

  async getVendors(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vendors?${queryString}`);
  }
}

export const apiService = new ApiService();
