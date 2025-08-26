import { API_CONFIG } from '@/config/apiConfig';

export interface VisitPurpose {
  id: number;
  purpose: string;
  active: number;
}

export interface MoveInOutPurpose {
  id: number;
  purpose: string;
  active: number;
}

export interface StaffType {
  id: number;
  staff_type: string;
  related_to: string | null;
  active: number;
}

export interface VisitorComment {
  id: number;
  description: string;
  active: boolean;
}

export interface VisitorSetupResponse {
  visit_purposes: VisitPurpose[];
  move_in_out_purposes: MoveInOutPurpose[];
  staff_types: StaffType[];
  visitor_comment: VisitorComment;
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

export const fetchVisitorSetup = async (): Promise<VisitorSetupResponse> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.VISITOR_SETUP);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('=== Visitor Setup API Call ===');
    console.log('Full URL:', url);
    console.log('Request options:', {
      method: options.method,
      headers: options.headers
    });
    
    const response = await fetch(url, options);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Visitor Setup API response:', data);
    console.log('Response type:', typeof data);
    
    // Log the data structure
    console.log('Visit Purposes:', data.visit_purposes?.length || 0);
    console.log('Move In/Out Purposes:', data.move_in_out_purposes?.length || 0);
    console.log('Staff Types:', data.staff_types?.length || 0);
    console.log('Visitor Comment:', data.visitor_comment ? 'Present' : 'Missing');
    
    // Ensure we always return the expected structure with defaults
    return {
      visit_purposes: data.visit_purposes || [],
      move_in_out_purposes: data.move_in_out_purposes || [],
      staff_types: data.staff_types || [],
      visitor_comment: data.visitor_comment || { id: 0, description: '', active: false }
    };
  } catch (error) {
    console.error('=== Visitor Setup API Call Failed ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    // Return empty structure instead of throwing to provide fallback
    return {
      visit_purposes: [],
      move_in_out_purposes: [],
      staff_types: [],
      visitor_comment: { id: 0, description: '', active: false }
    };
  }
};
