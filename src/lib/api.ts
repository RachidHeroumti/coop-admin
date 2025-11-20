import axios from 'axios';

const BASE_URL ='http://localhost:5005/api';

// Create axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});
instance.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });
    return config;
  },
  (error) => {
    console.error('🚨 API Request Error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {
    console.error('🚨 API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

const api = {
  get: async (url: string, params = {}) => {
    try { 
      const config = Object.keys(params).length > 0 
        ? { params } 
        : {};
        
      const response = await instance.get(url, config);
      return response.data;
    } catch (error) {
      console.error(`❌ GET ${url} failed:`, error);
      throw error;
    }
  },

  post: async (url: string, data = {}) => {
    try {
      const response = await instance.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`❌ POST ${url} failed:`, error);
      throw error;
    }
  },

  put: async (url: string, data = {}) => {
    try {
      const response = await instance.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`❌ PUT ${url} failed:`, error);
      throw error;
    }
  },

  patch: async (url: string, data = {}) => {
    try {
      const response = await instance.patch(url, data);
      return response.data;
    } catch (error) {
      console.error(`❌ PATCH ${url} failed:`, error);
      throw error;
    }
  },

  delete: async (url: string) => {
    try {
      const response = await instance.delete(url);
      return response.data;
    } catch (error) {
      console.error(`❌ DELETE ${url} failed:`, error);
      throw error;
    }
  },
};

export default api;