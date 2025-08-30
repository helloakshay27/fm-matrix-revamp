import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export const vendorService = {
  createVendor: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/suppliers.json`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vendor');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating vendor:', error);
      toast.error(error.message || 'An unknown error occurred');
      throw error;
    }
  },

  getVendors: async (page = 1, searchQuery = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (searchQuery) {
        params.append('q[company_name_cont]', searchQuery);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/suppliers.json?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vendors');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      toast.error(error.message || 'An unknown error occurred');
      throw error;
    }
  },
};
