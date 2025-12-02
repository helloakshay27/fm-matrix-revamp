import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export const communicationTemplateService = {
  async getCommunicationTemplates() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/communication_templates.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch communication templates');
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching communication templates.');
      throw error;
    }
  },

  async getCommunicationTemplateById(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/communication_templates/${id}.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch communication template details');
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching communication template details.');
      throw error;
    }
  },

  async createCommunicationTemplate(templateData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/communication_templates.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to create communication template';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the communication template.');
      throw error;
    }
  },

  async updateCommunicationTemplate(id: number, templateData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/communication_templates/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to update communication template';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating the communication template.');
      throw error;
    }
  },

  async deleteCommunicationTemplate(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/communication_templates/${id}.json`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete communication template');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting the communication template.');
      throw error;
    }
  },
};
