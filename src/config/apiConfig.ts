import { getBaseUrl, getToken } from '@/utils/auth';

// API Configuration - Central place for managing API endpoints and tokens
const getApiConfig = () => {
  const savedToken = getToken();
  const savedBaseUrl = getBaseUrl();

  // Fallback base URL - can be overridden by environment variable or login process
  // In Vite, use import.meta.env instead of process.env
  const finalBaseUrl = savedBaseUrl || import.meta.env.VITE_API_BASE_URL || 'ive-api.gophygital.work/';

  console.log('API Config Debug:', {
    savedToken: savedToken ? 'Present' : 'Missing',
    savedBaseUrl: savedBaseUrl || 'Missing',
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
    SOCIETY_STAFF_TYPES: '/pms/society_staff_types.json',
    SOCIETY_STAFF_DETAILS: '/pms/admin/society_staffs', // Base path, will append /{id}.json
    UPDATE_SOCIETY_STAFF: '/pms/admin/society_staffs', // Base path, will append /{id}.json
    SEND_STAFF_OTP: '/pms/admin/society_staffs/send_otp.json',
    VERIFY_STAFF_NUMBER: '/pms/admin/society_staffs/verify_number.json',
    PRINT_QR_CODES: '/pms/admin/society_staffs/print_qr_codes.json',
    ROLES: '/lock_roles.json',
    ROLES_WITH_MODULES: '/lock_roles_with_modules.json',
    FUNCTIONS: '/lock_functions.json',
    FUNCTION_DETAILS: '/lock_functions', // Base path, will append /:id.json
    SUB_FUNCTIONS: '/lock_sub_functions.json',
    SUB_FUNCTION_DETAILS: '/lock_sub_functions', // Base path, will append /:id.json
    // Module, Function, Sub-Function CRUD endpoints
    MODULES: '/lock_modules.json',
    MODULE_DETAILS: '/lock_modules', // Base path, will append /:id.json
    CREATE_MODULE: '/lock_modules.json',
    UPDATE_MODULE: '/lock_modules', // Base path, will append /:id.json
    DELETE_MODULE: '/lock_modules', // Base path, will append /:id.json
    CREATE_FUNCTION: '/lock_functions.json',
    UPDATE_FUNCTION: '/lock_functions', // Base path, will append /:id.json
    DELETE_FUNCTION: '/lock_functions', // Base path, will append /:id.json
    CREATE_SUB_FUNCTION: '/lock_sub_functions.json',
    UPDATE_SUB_FUNCTION: '/lock_sub_functions', // Base path, will append /:id.json
    DELETE_SUB_FUNCTION: '/lock_sub_functions', // Base path, will append /:id.json
    // Role Config endpoints
    ROLE_CONFIGS: '/lock_roles.json',
    ROLE_CONFIG_DETAILS: '/lock_roles', // Base path, will append /:id.json
    CREATE_ROLE_CONFIG: '/lock_roles.json',
    UPDATE_ROLE_CONFIG: '/lock_roles', // Base path, will append /:id.json
    DELETE_ROLE_CONFIG: '/lock_roles', // Base path, will append /:id.json
    EMAIL_RULES: '/pms/email_rule_setups.json',
    FM_USERS: '/pms/users/get_escalate_to_users.json',
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
    UPDATE_COMPLAINT_MODE: '/pms/admin/update_complaint_mode.json',
    DELETE_COMPLAINT_MODE: '/pms/admin/delete_complaint_mode.json',
    ACCOUNTS: '/api/users/account.json',
    STATUSES: '/pms/admin/create_complaint_statuses.json',
    STATUSES_LIST: '/pms/admin/complaint_statuses.json',
    STATUSES_UPDATE: '/pms/admin/modify_complaint_status.json',
    MODIFY_COMPLAINT_STATUS: '/pms/admin/modify_complaint_status.json',
    // Holiday Calendar endpoints
    HOLIDAY_CALENDARS: '/pms/admin/holiday_calendars.json',
    CREATE_HOLIDAY: '/pms/admin/holiday_calendars.json',
    GET_HOLIDAY: '/pms/admin/holiday_calendars', // Base path, will append /:id.json
    UPDATE_HOLIDAY: '/pms/admin/holiday_calendars', // Base path, will append /:id.json
    // New endpoints for ticket creation
    CREATE_TICKET: '/pms/admin/complaints.json',
    GET_SUBCATEGORIES: '/pms/admin/get_sub_categories',
    ACCOUNT_DETAILS: '/api/users/account.json',
    OCCUPANT_USERS: '/pms/account_setups/occupant_users.json',
    PERMITS: '/pms/permits.json',
    PERMIT_DETAILS: '/pms/permits', // Base path, will append /:id.json
    PERMIT_COMMENT: '/pms/permits', // Base path, will append /:id/permit_comment

    PERMIT_COUNTS: '/pms/permits/counts.json',
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
    TICKETS_SUMMARY: '/pms/admin/ticket_summary.json',
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

    // Group-wise assets endpoint
    GROUP_WISE_ASSETS: '/pms/assets/group_wise_assets.json',
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
    CUSTOM_FORMS_BULK_UPLOAD: '/pms/custom_forms/bulk_upload.json',
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
    // Ticket analytics download endpoints
    TICKET_AGING_MATRIX_DOWNLOAD: '/pms/admin/complaints/ticket_ageing_matrix_downloads.json',
    TICKET_UNIT_CATEGORYWISE_DOWNLOAD: '/pms/admin/complaints/chart_unit_categorywise_downloads.json',
    TICKET_RESOLUTION_TAT_DOWNLOAD: '/pms/admin/complaints/chart_resolution_tat_downloads.json',
    TICKET_RESPONSE_TAT_DOWNLOAD: '/pms/admin/complaints/chart_response_tat_downloads.json',
    COST_APPROVALS_CREATE: '/pms/create_muliple_cost_Approvals.json',
    COST_APPROVALS_CREATE_MULTIPLE: '/pms/create_cost_approvals_for_complaint.json',
    SURVEY_RESPONSES: '/survey_mapping_responses/all_responses.json',
    SURVEY_DETAILS: '/pms/admin/snag_checklists/survey_details.json',
    SUPPORT_STAFF_CATEGORIES: '/pms/admin/support_staff_categories.json',
    CREATE_VISITOR: '/pms/admin/visitors/new_visitor.json',
    UNEXPECTED_VISITORS: '/pms/admin/visitors/unexpected_visitors.json',
    EXPECTED_VISITORS: '/pms/admin/visitors/expected_visitors.json',
    VISITOR_HISTORY: '/pms/admin/visitors/visitor_history.json',
    ITEM_MOVEMENT_TYPES: '/item_movement_types.json',
    ITEM_TYPES: '/item_movement_types/movement_types.json',
    // Performance export endpoint
    PERFORMANCE_EXPORT: '/pms/custom_forms', // Base path, will append /{customFormCode}/export_performance
    // Patrolling endpoints
    PATROLLING_SETUP: '/patrolling/setup',
    // Measurements endpoints
    MEASUREMENTS: '/pms/measurements.json',
    // Asset measurement export endpoint
    ASSET_MEASUREMENT_EXPORT: '/pms/assets/asset_measurement_list.xlsx',
    // Asset measurement import endpoint  
    ASSET_MEASUREMENT_IMPORT: '/pms/assets/import',
    // Asset measurement sample download endpoint
    ASSET_MEASUREMENT_SAMPLE: '/assets/measurement.xlsx',
    // Parking categories endpoint
    PARKING_CATEGORIES: '/pms/admin/parking_categories.json',
    // Update parking category endpoint (append /{id}.json)
    UPDATE_PARKING_CATEGORY: '/pms/admin/parking_categories',
    // Parking slot details endpoint
    PARKING_SLOT_DETAILS: '/pms/admin/parking_slot_details.json',
    // Update parking slot details endpoint (append /{id}.json)
    UPDATE_PARKING_SLOT_DETAILS: '/pms/admin/parking_slot_details',
    // Permit tags endpoint
    PERMIT_TAGS: '/pms/permit_tags.json',
    // Resend OTP endpoint
    RESEND_OTP: '/pms/visitors/request_otp.json',
    // Parking configurations endpoint
    PARKING_CONFIGURATIONS: '/pms/admin/parking_configurations.json',
    // Buildings and floors endpoints (correct paths based on locationSlice)
    BUILDINGS: '/buildings.json',
    FLOORS: '/pms/floors.json',
    // Recent visitors endpoint
    RECENT_VISITORS: '/pms/admin/visitors/recent_visitors.json',
    // Visitor setup endpoint (visiting purposes, move in/out, staff types, comments)
    VISITOR_SETUP: '/pms/admin/visitors/visitor_setup.json',
    CREATE_VISIT_PURPOSE: '/pms/soc_visit_purposes.json',
    EDIT_VISIT_PURPOSE: '/pms/soc_visit_purposes',
    CREATE_MOVE_IN_OUT_PURPOSE: '/pms/society_mimo_purposes.json',
    EDIT_MOVE_IN_OUT_PURPOSE: '/pms/society_mimo_purposes',
    CREATE_WORK_TYPE: '/pms/society_staff_types.json',
    EDIT_WORK_TYPE: '/pms/society_staff_types', // Base path, will append /{id}.json
    CREATE_SOCIETY_STAFF: '/pms/admin/society_staffs.json',
    CREATE_VISITOR_COMMENT: '/visitor_comments.json',
    EDIT_VISITOR_COMMENT: '/visitor_comments',
    PARKING_CONFIGURATIONS_SEARCH: '/pms/admin/parking_configurations.json',
    PARKING_CONFIG_SAMPLE_FORMAT: '/assets/parking_configuration.xlsx',
    // Parking configuration bulk import
    PARKING_CONFIG_IMPORT: '/pms/admin/parking_configurations/import.json',
    // Parking bookings list endpoint
    PARKING_BOOKINGS: '/pms/admin/parking_bookings/parking_booking_list.json',
    // Parking booking details endpoint (append /{id}/customer_booking_show.json)
    PARKING_BOOKING_DETAILS: '/pms/admin/parking_bookings',
    // Icons endpoint
    ICONS: '/pms/icons.json',
    // Society gates endpoint
    SOCIETY_GATES: '/admin/society_gates.json',
    // Society gate by ID endpoints
    SOCIETY_GATE_BY_ID: '/admin/society_gates', // Base path, will append /{id}.json
    UPDATE_SOCIETY_GATE: '/admin/society_gates', // Base path, will append /{id}.json
    RECENT_SURVEYS: '/survey_mappings/response_list.json?&recent=true',
    // Visitor history export endpoint
    VISITOR_HISTORY_EXPORT: '/pms/admin/visitors/visitors_history.xlsx',
    ASSET_TYPES: '/pms/custom_forms/get_asset_type',
    COMMUNICATION_TEMPLATES: '/communication_templates.json',
    // Vehicle details endpoint
    VEHICLE_DETAILS: '/vehicle_details/vehicle_detail_list.json',
    // LTM list endpoint
    LTM_LIST: '/vehicle_histories/ltm_list.json',
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

// Helper to get role name header
export const getRoleNameHeader = (): string | null => {
  return localStorage.getItem('user_role_name');
}

// Helper to create authenticated fetch options
export const getAuthenticatedFetchOptions = (method: string = 'GET', body?: string | FormData | null): RequestInit => {
  const headers: Record<string, string> = {
    'Authorization': getAuthHeader(),
    'Content-Type': 'application/json',
  };



  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  return options;
}