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
    // Dynamically set baseURL from localStorage
    config.baseURL = API_CONFIG.BASE_URL
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