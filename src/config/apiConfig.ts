// API Configuration - Central place for managing API endpoints and tokens
export const API_CONFIG = {
  BASE_URL: 'https://fm-uat-api.lockated.com',
  TOKEN: 'ujP2uYLsfNTej4gIrK2bKAQrfL3ZdZBQxqkFULvTXUk',
  ENDPOINTS: {
    AMC: '/pms/asset_amcs.json',
    DEPARTMENTS: '/pms/departments.json',
    ROLES: '/lock_roles.json',
    FUNCTIONS: '/lock_functions.json',
    EMAIL_RULES: '/pms/email_rule_setups.json',
    FM_USERS: '/pms/account_setups/fm_users.json',
    ALLOWED_COMPANIES: '/allowed_companies.json',
    CHANGE_COMPANY: '/change_company.json',
    ALLOWED_SITES: '/pms/sites/allowed_sites.json',
    CHANGE_SITE: '/change_site.json',
    HELPDESK_CATEGORIES: '/pms/admin/helpdesk_categories.json',
    CREATE_COMPLAINT_WORKER: '/pms/admin/create_complaint_worker.json',
    USER_ACCOUNT: '/api/users/account.json',
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