import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

const fetchAndFormat = async (url: string, key: string) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
  const data = await response.json();
  const items = data[key] || data || [];
  if (!Array.isArray(items)) {
    console.error("Expected an array but got:", items);
    return [];
  }

  // Special handling for item_categories with only 'category' property (even if null or empty string)
  if (key === 'item_categories' && items.length > 0 && Object.keys(items[0]).length === 1 && 'category' in items[0]) {
    return items.map((item: any) => ({
      id: item.category ?? '',
      name: item.category ?? '',
      quantity: undefined,
      unit: undefined
    }));
  }

  return items.map((item: any) => ({ id: item.id, name: item.name, quantity: item.quantity, unit: item.unit }) );
};

export const gatePassInwardService = {
  async getInventoryTypes() {
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/inventory_types/autocomplete.json`;
      return await fetchAndFormat(url, 'item_types');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventory types.');
      throw error;
    }
  },

  async getInventorySubTypes() {
    try {
      let url = `${API_CONFIG.BASE_URL}/pms/inventory_types/get_subtype.json`;
      return await fetchAndFormat(url, 'item_categories');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventory sub-types.');
      throw error;
    }
  },

  async getInventories(inventoryTypeId: number, inventorySubTypeId: number) {
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/inventory_types/inventories.json?q[category_eq]=${inventorySubTypeId}`;
      return await fetchAndFormat(url, 'items');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while fetching inventories.');
      throw error;
    }
  },

  async createGatePassInward(payload: FormData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/gate_passes.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: payload,
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Failed to create gate pass';
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the gate pass.');
      throw error;
    }
  },
};
