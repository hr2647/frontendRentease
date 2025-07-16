// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/**
 * Fetches properties from the backend, with optional filters.
 * @param {object} filters - An object containing filter criteria (e.g., { minPrice, maxPrice, location })
 */
export const getAllProperties = async (filters = {}) => {
  try {
    // Clean the filters object to remove any empty keys
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    
    const params = new URLSearchParams(cleanedFilters);
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch property with id ${id}:`, error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getMyProperties = async () => {
    try {
        const response = await api.get('/properties/my');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch my properties:', error);
        throw error;
    }
};

export const getMyApplications = async () => {
    try {
        const response = await api.get('/applications/my-applications');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch my applications:', error);
        throw error;
    }
};

export const applyToProperty = async (propertyId, message) => {
    try {
        const response = await api.post(`/applications/${propertyId}/apply`, { message });
        return response.data;
    } catch (error) {
        console.error('Failed to apply to property:', error.response?.data?.message || error.message);
        throw error.response?.data || error;
    }
};

export const getApplicationsForProperty = async (propertyId) => {
  try {
    const response = await api.get(`/applications/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch applications for property:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const approveApplication = async (applicationId) => {
  try {
    const response = await api.put(`/applications/${applicationId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Failed to approve application:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const rejectApplication = async (applicationId) => {
  try {
    const response = await api.put(`/applications/${applicationId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Failed to reject application:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const createProperty = async (formData) => {
  try {
    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create property:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getAllUsersForAdmin = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a user (Admin only).
 * Corresponds to DELETE /api/admin/users/:id
 * @param {string} userId The ID of the user to delete.
 */
export const deleteUserAsAdmin = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// --- New Admin Property Functions ---

/**
 * Fetches all properties for an admin.
 * Corresponds to GET /api/admin/properties
 */
export const getAllPropertiesForAdmin = async () => {
  try {
    const response = await api.get('/admin/properties');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties for admin:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a property as an admin.
 * Corresponds to DELETE /api/admin/properties/:id
 * @param {string} propertyId The ID of the property to delete.
 */
export const deletePropertyAsAdmin = async (propertyId) => {
  try {
    const response = await api.delete(`/admin/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete property as admin:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// --- Messaging Functions ---

/**
 * Fetches all messages for the authenticated user.
 * Corresponds to GET /api/messages
 */
export const getMessages = async () => {
  try {
    const response = await api.get('/messages');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Sends a new message.
 * Corresponds to POST /api/messages
 * @param {object} messageData - { receiverId, content, propertyId }
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

export const getApplicationStatus = async (propertyId) => {
  try {
    // We assume a new endpoint GET /api/applications/status/:propertyId
    // You will need to add this to your backend.
    const response = await api.get(`/applications/status/${propertyId}`);
    return response.data;
  } catch (error) {
      if (error.response && error.response.status === 404) {
          return { status: 'not_applied' };
      }
    console.error('Failed to fetch application status:', error);
    throw error;
  }
};

/**
 * Creates a fake payment for a property.
 * Corresponds to POST /api/payments
 * @param {object} paymentData - { amount, propertyId }
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Failed to create payment:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};
// --- New Booking Functions ---

/**
 * Creates a new booking request.
 * @param {object} bookingData - { propertyId, startDate, endDate, totalPrice }
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Failed to create booking:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetches all bookings for the authenticated user.
 */
export const getMyBookings = async () => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    throw error;
  }
};

/**
 * Fetches all confirmed booking dates for a property.
 * @param {string} propertyId
 */
export const getBookedDates = async (propertyId) => {
    try {
        // NOTE: Ensure you have added the corresponding route to your backend:
        // GET /api/bookings/property/:propertyId/dates
        const response = await api.get(`/bookings/property/${propertyId}/dates`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch booked dates:', error);
        throw error;
    }
};
// --- New Landlord Booking Functions ---

/**
 * Fetches all bookings for a specific property (Landlord only).
 * @param {string} propertyId
 */
export const getBookingsForProperty = async (propertyId) => {
  try {
    const response = await api.get(`/bookings/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookings for property:', error);
    throw error;
  }
};

/**
 * Updates the status of a booking (Landlord only).
 * @param {string} bookingId
 * @param {string} status - 'confirmed' or 'cancelled'
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Failed to update booking status:', error);
    throw error;
  }
};

export default api;
