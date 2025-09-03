import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export const inventorySubTypeService = {
  async getInventorySubTypes() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_sub_types.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory sub-types');
      const data = await response.json();
      return data || [];
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventory sub-types.');
      throw error;
    }
  },

  async getInventorySubTypeById(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_sub_types/${id}.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory sub-type details');
      const data = await response.json();
      return data.pms_inventory_sub_type;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventory sub-type details.');
      throw error;
    }
  },

  async createInventorySubType(inventorySubTypeData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_sub_types.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventorySubTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to create inventory sub-type';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the inventory sub-type.');
      throw error;
    }
  },

  async updateInventorySubType(id: number, inventorySubTypeData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_sub_types/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventorySubTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to update inventory sub-type';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating the inventory sub-type.');
      throw error;
    }
  },

  async deleteInventorySubType(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_sub_types/${id}.json`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete inventory sub-type');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting the inventory sub-type.');
      throw error;
    }
  },
};
