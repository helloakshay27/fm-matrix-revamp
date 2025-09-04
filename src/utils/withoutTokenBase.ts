import axios from 'axios'
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig'

// Create configured axios instance
export const baseClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to dynamically set baseURL and auth header
baseClient.interceptors.request.use(
  (config) => {
    // Get current frontend base URL
    const baseUrl = window.location.origin + '/';
    
    // Dynamically set backend API URL based on frontend URL
    let backendUrl: string;
    if (baseUrl === 'https://fm-matrix.lockated.com/') {
      backendUrl = 'https://fm-uat-api.lockated.com/';
    } else if (baseUrl === 'https://oig.gophygital.work/') {
      backendUrl = 'https://oig.gophygital.work/';
    } else {
      // Default fallback to OIG API
      backendUrl = 'https://fm-uat-api.lockated.com/';
    }
    
    config.baseURL = backendUrl;
    // config.baseURL = "https://fm-uat-api.lockated.com"
    // Dynamically set auth header from localStorage
    // config.headers.Authorization = getAuthHeader()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
baseClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default baseClient