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
        
        // Handle 422 Unprocessable Entity (validation errors)
        if (response.status === 422) {
          const error = new Error('Validation failed');
          (error as any).status = 422;
          (error as any).validationErrors = errorData;
          throw error;
        }
        
        throw new Error(errorData.message || 'Failed to create vendor');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating vendor:', error);
      
      // Don't show toast for 422 errors, let the component handle them
      if (error.status !== 422) {
        toast.error(error.message || 'An unknown error occurred');
      }
      
      throw error;
    }
  },

  getVendors: async (page = 1, searchQuery = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (searchQuery) {
        // Search across multiple fields for comprehensive search
        params.append('q[company_name_or_ext_business_partner_code_or_gstin_number_or_pan_number_or_email_or_mobile1_cont]', searchQuery);
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

  getVendorById: async (id: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/suppliers/${id}.json`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vendor details at service');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching vendor details:', error);
      toast.error(error.message || 'An unknown error occurred');
      throw error;
    }
  },
};
