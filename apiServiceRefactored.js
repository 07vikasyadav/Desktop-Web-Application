import api from './api';

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Detailed error logging
    console.error('❌ API Response Error:', {
      message: error.message,
      data: error.response?.data,
      url: error.config?.url,
      code: error.code
    });
    return Promise.reject(error);
  }
);

// API Service with comprehensive CRUD operations
const apiService = {
  // Health check endpoint
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },

  // Products API
  products: {
    async getAll() {
      try {
  const response = await api.get('/products');
  return response.data.data || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },

    async create(productData) {
      const response = await api.post('/products', productData);
      return response.data;
    },

    async update(id, productData) {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    },

    async delete(id) {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    }
  },

  // Orders API
  orders: {
    async getAll() {
      try {
  const response = await api.get('/orders');
  return response.data.data || [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
    },

    async create(orderData) {
      const response = await api.post('/orders', orderData);
      return response.data;
    },

    async update(id, orderData) {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    },

    async delete(id) {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    }
  },

  // Payments API
  payments: {
    async getAll() {
      try {
  const response = await api.get('/payments');
  return response.data.data || [];
      } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
      }
    },

    async create(paymentData) {
      const response = await api.post('/payments', paymentData);
      return response.data;
    },

    async update(id, paymentData) {
      const response = await api.put(`/payments/${id}`, paymentData);
      return response.data;
    },

    async delete(id) {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    }
  },

  // Custom Orders API
  customOrders: {
    async getAll() {
      try {
  const response = await api.get('/custom-orders');
  return response.data.data || [];
      } catch (error) {
        console.error('Error fetching custom orders:', error);
        return [];
      }
    },

    async create(customOrderData) {
      const response = await api.post('/custom-orders', customOrderData);
      return response.data;
    },

    async update(id, customOrderData) {
      const response = await api.put(`/custom-orders/${id}`, customOrderData);
      return response.data.data;
    },

    async delete(id) {
      const response = await api.delete(`/custom-orders/${id}`);
      return response.data;
    }
  },

  // Users API
  users: {
    async getAll() {
      try {
  const response = await api.get('/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    async getById(userId) {
      try {
  const response = await api.get(`/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
  const response = await api.post('/users/register', userData);
        return response.data;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },

    async login(credentials) {
      try {
  const response = await api.post('/users/login', credentials);
        return response.data;
      } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
      }
    },

    async update(userId, userData) {
      try {
  const response = await api.put(`/users/${userId}`, userData);
        return response.data;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },

    async delete(userId) {
      try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    }
  },

  // Authentication API
  auth: {
    async login(credentials) {
      const response = await api.post('/auth/login', credentials);
      return response;
    },

    async createAdmin(adminData) {
      const response = await api.post('/auth/create-admin', adminData);
      return response.data;
    },

    async status() {
      const response = await api.get('/auth/status');
      return response.data;
    }
  }
};

export default apiService;