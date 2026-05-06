import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export interface SnagQuestion {
  id?: number;
  descr: string;
  qtype: string;
}

export const fieldsSetupService = {
  async getFields(siteId: string | number) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/complaints/get_fields.json?site_id=${siteId}`,
        {
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch fields');
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching fields.');
      throw error;
    }
  },

  async setupFields(questions: SnagQuestion[]) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/complaints/fields_setup.json`,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ snag_questions: questions }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : 'Failed to save fields setup';
        throw new Error(errorMessage);
      }
      const data = await response.json().catch(() => ({}));
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving fields setup.');
      throw error;
    }
  },

  async getComplaintFields() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/complaints/get_complaint_fields.json`,
        {
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch complaint fields');
      return await response.json();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching complaint fields.');
      throw error;
    }
  },

  async updateComplaintFields(fields: { field_name: string; field_value: string }[]) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/complaints/setup_fields.json`,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields }),
        }
      );
      if (!response.ok) throw new Error('Failed to update complaint fields');
      return await response.json();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating complaint fields.');
      throw error;
    }
  },
};
