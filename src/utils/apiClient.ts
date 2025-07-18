import axios from 'axios'
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig'

// Create configured axios instance
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to automatically add auth header and base URL
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = API_CONFIG.BASE_URL
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

export default apiClient