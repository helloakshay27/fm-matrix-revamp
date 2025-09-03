import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export const inventoryTypeService = {
  async getInventoryTypes() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_types.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory types');
      const data = await response.json();
      return data.pms_inventory_types || [];
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventory types.');
      throw error;
    }
  },

  async getInventoryTypeById(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_types/${id}.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory type details');
      const data = await response.json();
      return data.pms_inventory_type;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventory type details.');
      throw error;
    }
  },

  async createInventoryType(inventoryTypeData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_types.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to create inventory type';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the inventory type.');
      throw error;
    }
  },

  async updateInventoryType(id: number, inventoryTypeData: any) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_types/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryTypeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to update inventory type';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating the inventory type.');
      throw error;
    }
  },

  async deleteInventoryType(id: number) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/inventory_types/${id}.json`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete inventory type');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting the inventory type.');
      throw error;
    }
  },
};
