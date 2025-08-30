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
};
