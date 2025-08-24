import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '../config/apiConfig';

export interface RecentVisitor {
  id: number;
  guest_name: string;
  guest_number: string;
  status: string;
  status_class: string;
  visitor_image: string;
  guest_from: string;
  visit_purpose: string;
  pass_number: string | null;
  expected_at: string | null;
  expected_at_formatted: string | null;
  created_at: string;
  created_at_formatted: string;
  pass_holder: boolean;
  pass_valid: string | null;
  primary_host: string;
  additional_hosts: string[];
  additional_hosts_count: number;
  guest_vehicle_number: string;
  notes: string | null;
  approve: number;
  approve_status: string;
  item_details: unknown[];
  check_in_available: boolean;
}

export interface RecentVisitorsResponse {
  recent_visitors: RecentVisitor[];
}

export const fetchRecentVisitors = async (): Promise<RecentVisitorsResponse> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.RECENT_VISITORS);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('=== Recent Visitors API Call ===');
    console.log('Full URL:', url);
    console.log('Request options:', {
      method: options.method,
      headers: options.headers
    });
    
    const response = await fetch(url, options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Recent visitors API response:', data);
    console.log('Response type:', typeof data);
    console.log('Has recent_visitors property:', 'recent_visitors' in data);
    
    if (data.recent_visitors) {
      console.log('Recent visitors count:', data.recent_visitors.length);
      console.log('First visitor sample:', data.recent_visitors[0]);
    }
    
    return data;
  } catch (error) {
    console.error('=== API Call Failed ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    throw error;
  }
};
