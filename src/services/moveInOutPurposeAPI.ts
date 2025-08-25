import { ENDPOINTS, BASE_URL, API_CONFIG } from '@/config/apiConfig';

export interface CreateMoveInOutPurposeRequest {
  society_mimo_purpose: {
    purpose: string;
    resource_id: number;
    active: boolean;
  };
}

export interface CreateMoveInOutPurposeResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  id?: number;
}

// Helper function to get full URL
const getFullUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  return `${baseUrl}${endpoint}`;
};

// Helper function to get authenticated fetch options
const getAuthenticatedFetchOptions = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: CreateMoveInOutPurposeRequest | EditMoveInOutPurposeRequest | Record<string, unknown>) => {
  const token = API_CONFIG.TOKEN;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  return options;
};

export const createMoveInOutPurpose = async (purpose: string, resourceId: number, active: boolean = true): Promise<CreateMoveInOutPurposeResponse> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.CREATE_MOVE_IN_OUT_PURPOSE);
    
    const requestBody: CreateMoveInOutPurposeRequest = {
      society_mimo_purpose: {
        purpose,
        resource_id: resourceId,
        active
      }
    };
    
    const options = getAuthenticatedFetchOptions('POST', requestBody);

    console.log('=== Create Move In/Out Purpose API Call ===');
    console.log('Full URL:', url);
    console.log('Request body:', requestBody);
    console.log('Request options:', {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer [HIDDEN]'
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
    console.log('Create Move In/Out Purpose API response:', data);
    
    return {
      success: true,
      message: data.message || 'Move In/Out purpose created successfully',
      data: data,
      id: data.id
    };
  } catch (error) {
    console.error('=== Create Move In/Out Purpose API Call Failed ===');
    console.error('Error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create move in/out purpose'
    };
  }
};

// Interface for the Edit Move In/Out Purpose request
export interface EditMoveInOutPurposeRequest {
  society_mimo_purpose: {
    purpose: string;
    active: boolean;
  };
}

// Function to edit an existing move in/out purpose
export const editMoveInOutPurpose = async (
  id: number,
  purpose: string,
  active: boolean = true
): Promise<CreateMoveInOutPurposeResponse> => {
  try {
    console.log('=== Edit Move In/Out Purpose API Call ===');
    console.log('ID:', id);
    console.log('Purpose:', purpose);
    console.log('Active:', active);
    console.log('Base URL:', BASE_URL);
    console.log('Token available:', !!API_CONFIG.TOKEN);
    
    const url = `${BASE_URL}${ENDPOINTS.EDIT_MOVE_IN_OUT_PURPOSE}/${id}.json`;
    console.log('Edit Move In/Out Purpose API URL:', url);

    const requestBody: EditMoveInOutPurposeRequest = {
      society_mimo_purpose: {
        purpose: purpose,
        active: active
      }
    };

    console.log('Edit Move In/Out Purpose Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('PUT', requestBody),
      headers: {
        ...getAuthenticatedFetchOptions('PUT', requestBody).headers,
        'Content-Type': 'application/json',
      },
    });

    console.log('Edit Move In/Out Purpose API Response status:', response.status);
    console.log('Edit Move In/Out Purpose API Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edit Move In/Out Purpose API Error response body:', errorText);
      
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        console.warn('Could not parse error response as JSON');
      }
      
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('Edit Move In/Out Purpose API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Move in/out purpose updated successfully'
    };
  } catch (error) {
    console.error('=== Edit Move In/Out Purpose API Call Failed ===');
    console.error('Error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update move in/out purpose'
    };
  }
};
