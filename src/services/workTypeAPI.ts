import { ENDPOINTS, getAuthenticatedFetchOptions, BASE_URL } from '../config/apiConfig';

// Interface for the Work Type creation request
export interface CreateWorkTypeRequest {
  society_staff_type: {
    staff_type: string;
    related_to: string;
    resource_id: number;
    active: boolean;
  };
}

// Interface for the Work Type edit request
export interface EditWorkTypeRequest {
  society_staff_type: {
    staff_type: string;
    related_to: string;
    active: boolean;
  };
}

// Interface for the API response
export interface CreateWorkTypeResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// Interface for getting work type by ID
export interface WorkTypeDetails {
  id: number;
  staff_type: string;
  related_to: string;
  active: boolean;
  resource_id: number;
}

// Function to create a new work type
export const createWorkType = async (
  staffType: string,
  relatedTo: string,
  resourceId: number,
  active: boolean = true
): Promise<CreateWorkTypeResponse> => {
  try {
    console.log('Creating work type:', { staffType, relatedTo, resourceId, active });
    
    const url = `${BASE_URL}${ENDPOINTS.CREATE_WORK_TYPE}`;
    console.log('Work Type API URL:', url);

    const requestBody: CreateWorkTypeRequest = {
      society_staff_type: {
        staff_type: staffType,
        related_to: relatedTo,
        resource_id: resourceId,
        active: active
      }
    };

    console.log('Work Type Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('POST', requestBody),
      headers: {
        ...getAuthenticatedFetchOptions('POST', requestBody).headers,
        'Content-Type': 'application/json',
      },
    });

    console.log('Work Type API Response status:', response.status);
    console.log('Work Type API Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Work Type API Error response:', errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || 'Failed to create work type'}`
      };
    }

    const responseData = await response.json();
    console.log('Work Type API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Work type created successfully'
    };

  } catch (error) {
    console.error('Work Type API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to get work type by ID
export const getWorkTypeById = async (id: number): Promise<CreateWorkTypeResponse> => {
  try {
    console.log('Fetching work type by ID:', id);
    
    const url = `${BASE_URL}${ENDPOINTS.EDIT_WORK_TYPE}/${id}.json`;
    console.log('Work Type GET API URL:', url);

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('GET'),
    });

    console.log('Work Type GET API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Work Type GET API Error response:', errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || 'Failed to fetch work type'}`
      };
    }

    const responseData = await response.json();
    console.log('Work Type GET API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Work type fetched successfully'
    };

  } catch (error) {
    console.error('Work Type GET API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to edit a work type
export const editWorkType = async (
  id: number,
  staffType: string,
  relatedTo: string,
  active: boolean = true
): Promise<CreateWorkTypeResponse> => {
  try {
    console.log('Editing work type:', { id, staffType, relatedTo, active });
    
    const url = `${BASE_URL}${ENDPOINTS.EDIT_WORK_TYPE}/${id}.json`;
    console.log('Work Type Edit API URL:', url);

    const requestBody: EditWorkTypeRequest = {
      society_staff_type: {
        staff_type: staffType,
        related_to: relatedTo,
        active: active
      }
    };

    console.log('Work Type Edit Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      ...getAuthenticatedFetchOptions('PUT', requestBody),
      headers: {
        ...getAuthenticatedFetchOptions('PUT', requestBody).headers,
        'Content-Type': 'application/json',
      },
    });

    console.log('Work Type Edit API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Work Type Edit API Error response:', errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || 'Failed to edit work type'}`
      };
    }

    const responseData = await response.json();
    console.log('Work Type Edit API Success response:', responseData);

    return {
      success: true,
      data: responseData,
      message: 'Work type updated successfully'
    };

  } catch (error) {
    console.error('Work Type Edit API Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
