import { ENDPOINTS, BASE_URL, API_CONFIG } from '@/config/apiConfig';

// Interface for visitor comment data
export interface VisitorCommentData {
  id: number;
  description: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface for the Edit Visitor Comment request
export interface EditVisitorCommentRequest {
  visitor_comment: {
    description: string;
    active: boolean;
  };
}

// Interface for the Create Visitor Comment request
export interface CreateVisitorCommentRequest {
  visitor_comment: {
    description: string;
    active: boolean;
  };
}

// Interface for the API response
export interface VisitorCommentResponse {
  success: boolean;
  message?: string;
  data?: VisitorCommentData | VisitorCommentData[];
  error?: string;
}

// Local authentication helper function
const getAuthenticatedFetchOptions = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: EditVisitorCommentRequest | CreateVisitorCommentRequest | Record<string, unknown>) => {
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

// Function to get a visitor comment by ID
export const getVisitorCommentById = async (id: number): Promise<VisitorCommentResponse> => {
  try {
    console.log('=== Get Visitor Comment By ID API Call ===');
    console.log('ID:', id);
    console.log('Base URL:', BASE_URL);
    console.log('Token available:', !!API_CONFIG.TOKEN);
    
    const url = `${BASE_URL}${ENDPOINTS.EDIT_VISITOR_COMMENT}/${id}.json`;
    console.log('Get Visitor Comment API URL:', url);

    // Check if we have required authentication
    if (!API_CONFIG.TOKEN) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('GET'),
    });

    console.log('Get Visitor Comment API Response status:', response.status);
    console.log('Get Visitor Comment API Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get Visitor Comment API Error response body:', errorText);
      
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
    console.log('Get Visitor Comment API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Visitor comment retrieved successfully'
    };
  } catch (error) {
    console.error('=== Get Visitor Comment By ID API Call Failed ===');
    console.error('Error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to retrieve visitor comment'
    };
  }
};

// Function to create a new visitor comment
export const createVisitorComment = async (
  description: string,
  active: boolean = true
): Promise<VisitorCommentResponse> => {
  try {
    console.log('=== Create Visitor Comment API Call ===');
    console.log('Description:', description);
    console.log('Active:', active);
    console.log('Base URL:', BASE_URL);
    console.log('Token available:', !!API_CONFIG.TOKEN);
    
    const url = `${BASE_URL}${ENDPOINTS.CREATE_VISITOR_COMMENT}`;
    console.log('Create Visitor Comment API URL:', url);

    const requestBody: CreateVisitorCommentRequest = {
      visitor_comment: {
        description: description,
        active: active
      }
    };

    console.log('Create Visitor Comment Request body:', JSON.stringify(requestBody, null, 2));

    // Check if we have required authentication
    if (!API_CONFIG.TOKEN) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('POST', requestBody),
    });

    console.log('Create Visitor Comment API Response status:', response.status);
    console.log('Create Visitor Comment API Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create Visitor Comment API Error response body:', errorText);
      
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
    console.log('Create Visitor Comment API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Visitor comment created successfully'
    };
  } catch (error) {
    console.error('=== Create Visitor Comment API Call Failed ===');
    console.error('Error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create visitor comment'
    };
  }
};

// Function to edit an existing visitor comment
export const editVisitorComment = async (
  id: number,
  description: string,
  active: boolean = true
): Promise<VisitorCommentResponse> => {
  try {
    console.log('=== Edit Visitor Comment API Call ===');
    console.log('ID:', id);
    console.log('Description:', description);
    console.log('Active:', active);
    console.log('Base URL:', BASE_URL);
    console.log('Token available:', !!API_CONFIG.TOKEN);
    
    const url = `${BASE_URL}${ENDPOINTS.EDIT_VISITOR_COMMENT}/${id}.json`;
    console.log('Edit Visitor Comment API URL:', url);

    const requestBody: EditVisitorCommentRequest = {
      visitor_comment: {
        description: description,
        active: active
      }
    };

    console.log('Edit Visitor Comment Request body:', JSON.stringify(requestBody, null, 2));

    // Check if we have required authentication
    if (!API_CONFIG.TOKEN) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('PUT', requestBody),
    });

    console.log('Edit Visitor Comment API Response status:', response.status);
    console.log('Edit Visitor Comment API Response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edit Visitor Comment API Error response body:', errorText);
      
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
    console.log('Edit Visitor Comment API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Visitor comment updated successfully'
    };
  } catch (error) {
    console.error('=== Edit Visitor Comment API Call Failed ===');
    console.error('Error details:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update visitor comment'
    };
  }
};
