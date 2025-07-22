import { apiClient } from '@/utils/apiClient';
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';

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
  const baseUrl = `${API_CONFIG.BASE_URL}/pms/custom_forms.json`;
  
  // Build URL with query parameters
  const url = new URL(baseUrl);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  const response = await fetch(url.toString(), getAuthenticatedFetchOptions('GET'));
  if (!response.ok) {
    throw new Error('Failed to fetch custom forms');
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
