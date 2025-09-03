import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export const gateNumberService = {
  async getCompanies() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/allowed_companies.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      // The API returns company_name, so we map it to name for consistency
      return (data.companies || []).map((c: any) => ({ id: c.id, name: c.name }));
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching companies.');
      throw error;
    }
  },

  async getSites() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/sites/allowed_sites.json?user_id=87989`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch sites');
      const data = await response.json();
      // The API returns site_name, so we map it to name for consistency
      return (data.sites || []).map((s: any) => ({ id: s.id, name: s.name }));
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching sites.');
      throw error;
    }
  },

  async getProjectsBySite(siteId: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/sites/${siteId}/buildings.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      // The API returns buildings which have a name property
      return data.buildings || [];
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching projects.');
      throw error;
    }
  },

  async getGateNumbers() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_numbers.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch gate numbers');
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching gate numbers.');
      throw error;
    }
  },

  async getGateNumberById(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_numbers/${id}.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch gate number details');
      const data = await response.json();
      return data.gate_number;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching gate number details.');
      throw error;
    }
  },

  async createGateNumber(gateNumberData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_numbers.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gateNumberData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to create gate number';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the gate number.');
      throw error;
    }
  },

  async updateGateNumber(id: number, gateNumberData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_numbers/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gateNumberData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to update gate number';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating the gate number.');
      throw error;
    }
  },

  async deleteGateNumber(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_numbers/${id}.json`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete gate number');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting the gate number.');
      throw error;
    }
  },
};
