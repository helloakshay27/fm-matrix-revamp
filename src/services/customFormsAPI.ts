import { apiClient } from '@/utils/apiClient';
import { API_CONFIG, getAuthenticatedFetchOptions, ENDPOINTS, getFullUrl } from '@/config/apiConfig';

export interface CustomForm {
  id: number;
  form_name: string;
  created_at: string;
  updated_at: string;
  description: string;
  active: number | null;
  checklist_for: string;
  ticket_level: string;
  helpdesk_category_id: number | null;
  schedule_type: string;
  start_date: string | null;
  end_date: string | null;
  company_id: number;
  create_ticket: boolean;
  weightage_enabled: boolean;
  created_source: string;
  no_of_associations: number;
  custom_form_code: string;
  content: string;
}

export interface CustomFormsResponse {
  custom_forms: CustomForm[];
}

export interface TransformedScheduleData {
  id: string;
  activityName: string;
  type: string;
  scheduleType: string;
  noOfAssociation: string;
  validFrom: string;
  validTill: string;
  category: string;
  active: boolean;
  createdOn: string;
}

export const fetchCustomForms = async (queryParams?: Record<string, string>): Promise<CustomFormsResponse> => {
  // Use the endpoint from API config
  const baseUrl = getFullUrl(ENDPOINTS.CUSTOM_FORMS);
  
  console.log('API Config:', {
    BASE_URL: API_CONFIG.BASE_URL,
    TOKEN: API_CONFIG.TOKEN ? 'Present' : 'Missing',
    ENDPOINT: ENDPOINTS.CUSTOM_FORMS,
    FULL_URL: baseUrl
  });
  
  // Build URL with query parameters
  const url = new URL(baseUrl);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  console.log('Final URL:', url.toString());
  console.log('Request headers:', getAuthenticatedFetchOptions('GET'));
  
  const response = await fetch(url.toString(), getAuthenticatedFetchOptions('GET'));
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`Failed to fetch custom forms: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('API Success Response:', data);
  
  // Validate the response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format: Expected an object');
  }
  
  // Check if custom_forms exists and is an array
  if (!data.custom_forms) {
    console.warn('No custom_forms field in response, returning empty array');
    return { custom_forms: [] };
  }
  
  if (!Array.isArray(data.custom_forms)) {
    throw new Error('Invalid response format: custom_forms should be an array');
  }
  
  return data;
};

// Interfaces for checklist master data
export interface ChecklistContent {
  label: string;
  name: string;
  className: string;
  group_id: string;
  sub_group_id: string;
  type: string;
  subtype: string;
  required: string;
  is_reading: string;
  hint: string;
  values: Array<{
    label: string;
    type: string;
    value: string;
  }>;
  consumption_type: string;
  consumption_unit_type: string;
  weightage: string;
  rating_enabled: string;
  question_hint_image_ids: any[];
}

export interface ChecklistMaster {
  id: number;
  form_name: string;
  created_at: string;
  updated_at: string;
  description: string;
  checklist_for: string;
  ticket_level: string;
  asset_meter_type_id: number | null;
  helpdesk_category_id: number | null;
  schedule_type: string;
  company_id: number;
  create_ticket: boolean | null;
  weightage_enabled: boolean | null;
  created_source: string;
  temp_name: string | null;
  content: ChecklistContent[];
}

export interface TransformedChecklistData {
  id: number;
  activityName: string;
  meterCategory: string;
  numberOfQuestions: number;
  scheduledFor: string;
  scheduleType: string;
  createdAt: string;
}

// Interfaces for detailed custom form data
export interface CustomFormContent {
  label: string;
  name: string;
  className: string;
  group_id: string;
  sub_group_id: string;
  type: string;
  subtype: string;
  required: string;
  is_reading: string;
  hint: string;
  values: any[];
  weightage: string;
  rating_enabled: string;
  question_hint_image_ids: any[];
  question_hint_image_url: any[];
}

export interface CustomFormDetail {
  id: number;
  form_name: string;
  description: string;
  created_source: string;
  schedule_type: string;
  sch_type: string;
  helpdesk_category_id: number | null;
  weightage_enabled: boolean;
  create_ticket: boolean;
  ticket_level: string;
  observations_enabled: boolean;
  supervisors: string[];
  supplier_id: number | null;
  submission_time_type: string;
  submission_time_value: number | null;
  rule_ids: string[];
  content: CustomFormContent[];
}

export interface AssetTaskDetail {
  id: number;
  assignment_type: string;
  scan_type: string;
  plan_type: string;
  plan_value: string;
  priority: string;
  grace_time_type: string;
  grace_time_value: string;
  overdue_task_start_status: boolean;
  frequency: string;
  cron_expression: string;
  start_date: string;
  end_date: string;
  category: string;
  assets: any[];
  services: Array<{
    id: number;
    service_name: string;
    service_code: string;
  }>;
}

export interface CustomFormDetailsResponse {
  custom_form: CustomFormDetail;
  asset_task: AssetTaskDetail;
  email_rules: any[];
}

export const fetchChecklistMaster = async (): Promise<ChecklistMaster[]> => {
  const url = `${API_CONFIG.BASE_URL}${ENDPOINTS.CHECKLIST_MASTER}`;
  
  const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
  if (!response.ok) {
    throw new Error('Failed to fetch checklist master data');
  }
  return response.json();
};

export const transformChecklistData = (checklists: ChecklistMaster[]): TransformedChecklistData[] => {
  return checklists.map(checklist => {
    // Parse checklist_for to get meter category and scheduled for
    const checklistParts = checklist.checklist_for.split('::');
    const meterCategory = checklistParts[1] || 'Asset'; // Asset or Service
    const scheduledFor = checklistParts[1] || 'Asset';

    return {
      id: checklist.id,
      activityName: checklist.form_name,
      meterCategory: meterCategory,
      numberOfQuestions: checklist.content ? checklist.content.length : 0,
      scheduledFor: scheduledFor,
      scheduleType: checklist.schedule_type,
      createdAt: checklist.created_at
    };
  });
};

export const fetchCustomFormDetails = async (formCode: string): Promise<CustomFormDetailsResponse> => {
  const url = `${API_CONFIG.BASE_URL}/pms/custom_forms/${formCode}/custom_form_preview.json`;
  
  const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
  if (!response.ok) {
    throw new Error('Failed to fetch custom form details');
  }
  return response.json();
};

export const transformCustomFormsData = (forms: CustomForm[]): TransformedScheduleData[] => {
  return forms.map(form => {
    // Split checklist_for to get type and schedule type
    const checklistParts = form.checklist_for.split('::');
    const type = checklistParts[0] || '';
    const scheduleType = checklistParts[1] || '';
    
    // Format dates
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ',');
    };

    return {
      id: form.id.toString(),
      activityName: form.form_name,
      type: type,
      scheduleType: scheduleType,
      noOfAssociation: form.no_of_associations.toString(),
      validFrom: formatDate(form.start_date),
      validTill: formatDate(form.end_date),
      category: type === 'PPM' ? 'Technical' : 'Non Technical',
      active: form.active === 1,
      createdOn: formatDate(form.created_at)
    };
  });
};

// Interfaces for checklist creation
export interface ChecklistCreateRequest {
  source: string;
  schedule_type: string;
  sch_type: string;
  checklist_type: string;
  group_id: string;
  sub_group_id: string;
  tmp_custom_form: {
    ticket_level: string;
    helpdesk_category_id: string;
    schedule_type: string;
    organization_id: string;
    form_name: string;
    description: string;
    asset_meter_type_id: number;
  };
  content: Array<{
    label: string;
    name: string;
    className: string;
    group_id: string;
    sub_group_id: string;
    type: string;
    subtype: string;
    required: string;
    is_reading: string;
    hint: string;
    values: Array<{
      label: string;
      type: string;
      value: string;
    }>;
    consumption_type: string;
    consumption_unit_type: string;
    weightage: string;
    rating_enabled: string;
  }>;
}

export interface ChecklistCreateResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createChecklistMaster = async (requestData: ChecklistCreateRequest): Promise<ChecklistCreateResponse> => {
  const url = `${API_CONFIG.BASE_URL}${ENDPOINTS.CREATE_CHECKLIST}`;
  
  const response = await fetch(url, getAuthenticatedFetchOptions('POST', requestData));
  if (!response.ok) {
    throw new Error('Failed to create checklist master');
  }
  return response.json();
};
