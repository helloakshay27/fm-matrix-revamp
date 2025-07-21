
import { getBaseUrl, getToken } from '@/utils/auth';

// API Configuration - Central place for managing API endpoints and tokens
const getApiConfig = () => {
  const savedBaseUrl = getBaseUrl();
  const savedToken = getToken();

  return {
    BASE_URL: savedBaseUrl || 'https://fm-uat-api.lockated.com',
    TOKEN: savedToken || 'ujP2uYLsfNTej4gIrK2bKAQrfL3ZdZBQxqkFULvTXUk',
  };
};

export const API_CONFIG = {
  get BASE_URL() {
    return getApiConfig().BASE_URL;
  },
  get TOKEN() {
    return getApiConfig().TOKEN;
  },
  ENDPOINTS: {
    ASSETS: '/pms/assets.json',
    AMC: '/pms/asset_amcs.json',
    AMC_DETAILS: '/pms/asset_amcs', // Base path, will append /:id.json
    SERVICES: '/pms/services.json',
    SERVICE_DETAILS: '/pms/services', // Base path, will append /:id.json
    SUPPLIERS: '/pms/suppliers.json',
    DEPARTMENTS: '/pms/departments.json',
    SITES: '/pms/sites.json',
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
    COST_APPROVALS: '/pms/admin/cost_approvals.json',
    USER_ACCOUNT: '/api/users/account.json',
    RESPONSE_ESCALATION: '/pms/admin/response_escalation',
    RESOLUTION_ESCALATION: '/pms/admin/resolution_escalation',
    UPDATE_COMPLAINT_WORKER: '/pms/admin/update_complaint_worker.json',
    DELETE_COMPLAINT_WORKER: '/pms/admin/delete_complaint_worker',
    FACILITY_BOOKINGS: '/pms/admin/facility_bookings.json',
    ENTITIES: '/entities.json',
    FACILITY_SETUPS: '/pms/admin/facility_setups.json',
    COMPLAINT_MODES: '/pms/admin/create_complaint_modes.json',
    COMPLAINT_MODE_LIST: '/pms/admin/complaint_modes.json',
    ACCOUNTS: '/api/users/account.json',
    STATUSES: '/pms/admin/create_complaint_statuses.json',
    STATUSES_LIST: '/pms/admin/complaint_statuses.json',
    STATUSES_UPDATE: '/pms/admin/modify_complaint_status.json',
    // New endpoints for ticket creation
    CREATE_TICKET: '/pms/admin/complaints.json',
    GET_SUBCATEGORIES: '/pms/admin/get_sub_categories',
    ACCOUNT_DETAILS: '/api/users/account.json',
    OCCUPANT_USERS: '/pms/account_setups/occupant_users.json',
  },
} as const

// Export individual values for easy access
export const { ENDPOINTS } = API_CONFIG
export const BASE_URL = API_CONFIG.BASE_URL;
export const TOKEN = API_CONFIG.TOKEN;

// Helper to get full URL
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper to get authorization header
export const getAuthHeader = (): string => {
  return `Bearer ${API_CONFIG.TOKEN}`
}
