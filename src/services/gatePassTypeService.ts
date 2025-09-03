import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export const gatePassTypeService = {
  async getGatePassTypes() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_pass_types.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch gate pass types');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching gate pass types.');
      throw error;
    }
  },

  async getGatePassTypeById(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_pass_types/${id}.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch gate pass type details');
      const data = await response.json();
      return data.gate_pass_type;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching gate pass type details.');
      throw error;
    }
  },

  async createGatePassType(gatePassTypeData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_pass_types.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gatePassTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to create gate pass type';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the gate pass type.');
      throw error;
    }
  },

  async updateGatePassType(id: number, gatePassTypeData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_pass_types/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gatePassTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to update gate pass type';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating the gate pass type.');
      throw error;
    }
  },

  async deleteGatePassType(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_pass_types/${id}.json`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete gate pass type');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting the gate pass type.');
      throw error;
    }
  },
};
