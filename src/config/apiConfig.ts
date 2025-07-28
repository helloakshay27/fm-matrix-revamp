import { getBaseUrl, getToken } from '@/utils/auth';

// API Configuration - Central place for managing API endpoints and tokens
const getApiConfig = () => {
  const savedToken = getToken();
  const savedBaseUrl = getBaseUrl();

  // Fallback base URL - can be overridden by environment variable or login process
  // In Vite, use import.meta.env instead of process.env
  const defaultBaseUrl = import.meta.env.VITE_BASE_URL || 'https://fm-uat-api.lockated.com';
  const finalBaseUrl = savedBaseUrl || defaultBaseUrl;

  console.log('API Config Debug:', {
    savedToken: savedToken ? 'Present' : 'Missing',
    savedBaseUrl: savedBaseUrl || 'Missing',
    defaultBaseUrl,
    finalBaseUrl,
    tokenLength: savedToken?.length || 0,
    baseUrlValue: finalBaseUrl
  });

  return {
    BASE_URL: finalBaseUrl,
    TOKEN: savedToken,
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
    UNITS: '/pms/units.json',
    ROLES: '/lock_roles.json',
    FUNCTIONS: '/lock_functions.json',
    EMAIL_RULES: '/pms/email_rule_setups.json',
    FM_USERS: '/pms/account_setups/fm_users.json',
    ALLOWED_COMPANIES: '/allowed_companies.json',
    CHANGE_COMPANY: '/change_company.json',
    ALLOWED_SITES: '/pms/sites/allowed_sites.json',
    CHANGE_SITE: '/change_site.json',
    HELPDESK_CATEGORIES: '/pms/admin/helpdesk_categories.json',
    HELPDESK_SUBCATEGORIES: '/pms/admin/get_all_helpdesk_sub_categories',
    COMPLAINT_STATUSES: '/pms/admin/complaint_statuses.json',
    CREATE_COMPLAINT_WORKER: '/pms/admin/create_complaint_worker.json',
    COST_APPROVALS: '/pms/admin/cost_approvals.json',
    USER_ACCOUNT: '/api/users/account.json',
    RESPONSE_ESCALATION: '/pms/admin/response_escalation',
    RESOLUTION_ESCALATION: '/pms/admin/resolution_escalation',
    UPDATE_COMPLAINT_WORKER: '/pms/admin/update_complaint_worker.json',
    DELETE_COMPLAINT_WORKER: '/pms/admin/delete_complaint_worker.json',
    FACILITY_BOOKINGS: '/pms/admin/facility_bookings.json',
    ENTITIES: '/entities.json',
    FACILITY_SETUPS: '/pms/admin/facility_setups.json',
    COMPLAINT_MODES: '/pms/admin/create_complaint_modes.json',
    COMPLAINT_MODE_LIST: '/pms/admin/complaint_modes.json',
    DELETE_COMPLAINT_MODE: '/pms/admin/delete_complaint_mode.json',
    ACCOUNTS: '/api/users/account.json',
    STATUSES: '/pms/admin/create_complaint_statuses.json',
    STATUSES_LIST: '/pms/admin/complaint_statuses.json',
    STATUSES_UPDATE: '/pms/admin/modify_complaint_status.json',
    MODIFY_COMPLAINT_STATUS: '/pms/admin/modify_complaint_status.json',
    // New endpoints for ticket creation
    CREATE_TICKET: '/pms/admin/complaints.json',
    GET_SUBCATEGORIES: '/pms/admin/get_sub_categories',
    ACCOUNT_DETAILS: '/api/users/account.json',
    OCCUPANT_USERS: '/pms/account_setups/occupant_users.json',
    // Add template endpoints
    TEMPLATES: '/pms/custom_forms/get_templates.json',
    TEMPLATE_DETAILS: '/exisiting_checklist.json', // Base path, will append ?id=templateId
    USER_GROUPS: '/pms/usergroups.json',
    // Add escalation users endpoint
    ESCALATION_USERS: '/pms/users/get_escalate_to_users.json',
    // Add modify helpdesk category endpoint
    MODIFY_HELPDESK_SUB_CATEGORY: '/pms/admin/modify_helpdesk_sub_category.json',
    // Add helpdesk category delete endpoint
    DELETE_HELPDESK_CATEGORY: '/pms/admin/helpdesk_categories', // Base path, will append /{id}.json
    // Add task group endpoints
    TASK_GROUPS: '/pms/asset_groups.json?type=checklist',
    TASK_SUB_GROUPS: '/pms/assets/get_asset_group_sub_group.json', // Will append ?group_id=
    TICKETS_SUMMARY: '/pms/admin/ticket_summary',
    TICKETS_EXPORT_EXCEL: '/pms/admin/complaints.xlsx',
    // Checklist master endpoint
    CHECKLIST_MASTER: '/master_checklist_list.json',
    // Checklist creation endpoint
    CREATE_CHECKLIST: '/pms/custom_forms/checklist_create_pms.json',
    // Asset statistics endpoint
    ASSET_STATISTICS: '/pms/assets/assets_statictics.json',
    // Asset status endpoint
    ASSET_STATUS: '/pms/assets/assets_status.json',
    // Asset distributions endpoint
    ASSET_DISTRIBUTIONS: '/pms/assets/assets_distributions.json',
    // Category-wise assets endpoint
    CATEGORY_WISE_ASSETS: '/pms/assets/category_wise_assets_count.json',
    // Custom forms endpoint
    CUSTOM_FORMS: '/pms/custom_forms.json',
    // Custom form details endpoint
    CUSTOM_FORM_DETAILS: '/pms/custom_forms', // Base path, will append /:id.json
    // Update custom form endpoint
    UPDATE_CUSTOM_FORM: '/pms/custom_forms', // Base path, will append /:id
    // Checklist sample format download
    CHECKLIST_SAMPLE_FORMAT: '/assets/checklist.xlsx',
    // Bulk upload for custom forms
    CUSTOM_FORMS_BULK_UPLOAD: '/pms/custom_forms/bulk_upload',
    // Asset dashboard endpoints
    // ASSET_STATISTICS: '/pms/asset_statistics.json',
    // ASSET_STATUS: '/pms/asset_status.json',
    // ASSET_DISTRIBUTIONS: '/pms/asset_distributions.json',
    // Restaurant endpoints
    RESTAURANTS: '/pms/admin/restaurants',
    RESTAURANT_MENU: '/pms/admin/restaurants',
    // Assets data report export endpoint
    ASSETS_DATA_EXPORT: '/pms/assets/assets_data_report.xlsx',
    // Recent assets endpoint
    RECENT_ASSETS: '/pms/assets/recent_assets.json',
    UPDATE_TICKET: '/complaint_logs.json',
    // Bulk ticket operations
    BULK_ASSIGN_TICKETS: '/pms/admin/complaints/bulk_assign_tickets.json',
    BULK_UPDATE_STATUS: '/pms/admin/complaints/bulk_update_status.json',
    COMPLAINT_MODE: '/pms/admin/complaint_modes.json',
  },
} as const

// Export individual values for easy access
export const { ENDPOINTS } = API_CONFIG
export const BASE_URL = API_CONFIG.BASE_URL;
export const TOKEN = API_CONFIG.TOKEN;

// Helper to get full URL
export const getFullUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (!baseUrl) {
    console.warn('Base URL is not configured, this should not happen with fallback');
    throw new Error('Base URL is not configured. Please check your authentication settings.');
  }
  return `${baseUrl}${endpoint}`;
}

// Helper to get authorization header
export const getAuthHeader = (): string => {
  const token = API_CONFIG.TOKEN;
  if (!token) {
    throw new Error('Authentication token is not available. Please log in again.');
  }
  return `Bearer ${token}`;
}

// Helper to create authenticated fetch options
export const getAuthenticatedFetchOptions = (method: string = 'GET', body?: any): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  return options;
}
