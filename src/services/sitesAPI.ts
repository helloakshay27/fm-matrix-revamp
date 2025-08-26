import { API_CONFIG } from '@/config/apiConfig';

export interface Site {
  id: number;
  name: string;
  company_id?: number;
  status?: boolean;
}

export interface SitesResponse {
  sites: Site[];
  selected_site?: Site;
}

// Helper function to get full URL
const getFullUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  return `${baseUrl}${endpoint}`;
};

// Helper function to get authenticated fetch options
const getAuthenticatedFetchOptions = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET') => {
  const token = API_CONFIG.TOKEN;
  return {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const fetchSites = async (): Promise<SitesResponse> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.SITES);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('=== Sites API Call ===');
    console.log('Full URL:', url);
    console.log('Request options:', {
      method: options.method,
      headers: {
        ...options.headers,
        'Authorization': options.headers.Authorization ? 'Bearer [HIDDEN]' : 'Missing'
      }
    });
    
    // Check if we have required authentication
    if (!API_CONFIG.TOKEN) {
      throw new Error('No authentication token available');
    }
    
    if (!API_CONFIG.BASE_URL) {
      throw new Error('No base URL configured');
    }
    
    const response = await fetch(url, options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Sites API response:', data);
    console.log('Response type:', typeof data);
    console.log('Has sites property:', 'sites' in data);
    
    if (data.sites) {
      console.log('Sites count:', data.sites.length);
      console.log('Sample sites:', data.sites.slice(0, 3));
    }
    
    // Ensure we always return the expected structure
    return {
      sites: Array.isArray(data.sites) ? data.sites : [],
      selected_site: data.selected_site || null
    };
  } catch (error) {
    console.error('=== Sites API Call Failed ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    // Return empty sites array instead of throwing to provide fallback
    return {
      sites: [],
      selected_site: null
    };
  }
};

export const fetchAllowedSites = async (userId: string): Promise<SitesResponse> => {
  try {
    const url = getFullUrl(`${API_CONFIG.ENDPOINTS.ALLOWED_SITES}?user_id=${userId}`);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('=== Allowed Sites API Call ===');
    console.log('Full URL:', url);
    console.log('User ID:', userId);
    console.log('Request options:', {
      method: options.method,
      headers: {
        ...options.headers,
        'Authorization': options.headers.Authorization ? 'Bearer [HIDDEN]' : 'Missing'
      }
    });
    
    // Check if we have required authentication
    if (!API_CONFIG.TOKEN) {
      throw new Error('No authentication token available');
    }
    
    if (!API_CONFIG.BASE_URL) {
      throw new Error('No base URL configured');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const response = await fetch(url, options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Allowed Sites API response:', data);
    
    // Ensure we always return the expected structure
    return {
      sites: Array.isArray(data.sites) ? data.sites : [],
      selected_site: data.selected_site || null
    };
  } catch (error) {
    console.error('=== Allowed Sites API Call Failed ===');
    console.error('Error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    // Return empty sites array instead of throwing to provide fallback
    return {
      sites: [],
      selected_site: null
    };
  }
};
