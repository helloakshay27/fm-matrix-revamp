// API Configuration - Central place for managing API endpoints and tokens
export const API_CONFIG = {
  BASE_URL: 'https://fm-uat-api.lockated.com',
  TOKEN: 'ujP2uYLsfNTej4gIrK2bKAQrfL3ZdZBQxqkFULvTXUk',
  ENDPOINTS: {
    AMC: '/pms/asset_amcs.json',
    DEPARTMENTS: '/pms/departments.json',
    ROLES: '/lock_roles.json',
    FUNCTIONS: '/lock_functions.json',
  },
} as const

// Export individual values for easy access
export const { BASE_URL, TOKEN, ENDPOINTS } = API_CONFIG

// Helper to get full URL
export const getFullUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`
}

// Helper to get authorization header
export const getAuthHeader = (): string => {
  return `Bearer ${TOKEN}`
}