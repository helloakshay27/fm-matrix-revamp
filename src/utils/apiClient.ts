import axios from 'axios'
import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig'

// Create configured axios instance
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to dynamically set baseURL and auth header
apiClient.interceptors.request.use(
  (config) => {
    // Dynamically set baseURL from localStorage
    config.baseURL = API_CONFIG.BASE_URL
    // Dynamically set auth header from localStorage
    config.headers.Authorization = getAuthHeader()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiClientUtil = {
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const baseUrl = API_CONFIG.BASE_URL;
    if (!baseUrl || baseUrl === 'https://fm-uat-api.lockated.com/') {
      throw new Error('API base URL is not configured. Please set VITE_API_BASE_URL in your .env file or ensure it is set in localStorage.');
    }
    
    // Determine backend URL based on base URL
    let backendUrl: string;
    if (baseUrl === 'https://fm-matrix.lockated.com/') {
      backendUrl = 'https://fm-matrix.lockated.com/';
    } else if (baseUrl === 'https://oig.gophygital.work/') {
      backendUrl = 'https://oig.gophygital.work/';
    } else {
      backendUrl = baseUrl; // fallback to original base URL
    }
    
    const url = `${backendUrl}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default apiClient