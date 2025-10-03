import { API_CONFIG } from '@/config/apiConfig';
import { getAuthenticatedFetchOptions } from '@/utils/auth';

export interface CreateAdminUserRequest {
  user: {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    organization_id: number;
    company_id: number;
  };
}

export interface CreateAdminUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  organization_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  message?: string;
}

export interface AdminUserAPIError {
  error?: string;
  errors?: string[];
  message?: string;
}

/**
 * Create a new organization admin user
 */
export const createOrganizationAdmin = async (
  userData: CreateAdminUserRequest
): Promise<{ success: boolean; data?: CreateAdminUserResponse; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    
    if (!token || !baseUrl) {
      throw new Error('Authentication required. Please log in again.');
    }

    console.log('Creating organization admin with data:', userData);

    // Build the URL with access token as query parameter
    const url = `https://${baseUrl}/pms/users/create_organization_admin.json?access_token=${token}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    console.log('Admin user API response status:', response.status);
    console.log('Admin user API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Admin user API Error response:', errorText);
      
      let errorMessage = 'Failed to create admin user';
      
      try {
        const errorJson = JSON.parse(errorText) as AdminUserAPIError;
        if (errorJson.error) {
          errorMessage = errorJson.error;
        } else if (errorJson.errors && Array.isArray(errorJson.errors)) {
          errorMessage = errorJson.errors.join(', ');
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {
        // If we can't parse the error, provide a context-specific message
        if (response.status === 422) {
          errorMessage = 'Invalid data provided. Please check your inputs and try again.';
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to create admin users.';
        } else if (response.status === 409) {
          errorMessage = 'A user with this email already exists.';
        } else if (response.status === 400) {
          errorMessage = 'Bad request. Please check the provided data.';
        } else {
          errorMessage = `Server error (${response.status}). Please try again later.`;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

    const responseData = await response.json() as CreateAdminUserResponse;
    console.log('Admin user created successfully:', responseData);

    return {
      success: true,
      data: responseData
    };

  } catch (error) {
    console.error('Error creating admin user:', error);
    
    let errorMessage = 'Network error. Please check your connection and try again.';
    
    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        errorMessage = error.message;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Get organizations list for dropdown
 */
export const getOrganizations = async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    
    if (!token || !baseUrl) {
      throw new Error('Authentication required');
    }

    const url = `https://${baseUrl}/organizations.json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.status}`);
    }

    const data = await response.json();
    
    let organizations = [];
    if (data && data.organizations && Array.isArray(data.organizations)) {
      organizations = data.organizations.filter((org: any) => org.active);
    } else if (Array.isArray(data)) {
      organizations = data.filter((org: any) => org.active);
    }

    return {
      success: true,
      data: organizations
    };

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organizations'
    };
  }
};

/**
 * Get companies list for dropdown
 */
export const getCompanies = async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    
    if (!token || !baseUrl) {
      throw new Error('Authentication required');
    }

    const url = `https://${baseUrl}/pms/company_setups/company_index.json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }

    const responseData = await response.json();
    
    let companies = [];
    if (responseData && responseData.code === 200 && Array.isArray(responseData.data)) {
      companies = responseData.data;
    } else if (responseData && Array.isArray(responseData.companies)) {
      companies = responseData.companies;
    } else if (Array.isArray(responseData)) {
      companies = responseData;
    }

    return {
      success: true,
      data: companies
    };

  } catch (error) {
    console.error('Error fetching companies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch companies'
    };
  }
};
