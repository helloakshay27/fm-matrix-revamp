import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

export interface VisitorComparisonResponse {
  success: number;
  message: string;
  comparison: {
    supportStaffVisitors: number;
    guestVisitors: number;
    info: {
      supportStaffVisitors: string;
      guestVisitors: string;
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export const visitorComparisonAPI = {
  getVisitorComparison: async (
    fromDate: string, 
    toDate: string
  ): Promise<VisitorComparisonResponse> => {
    const endpoint = '/pms/visitors/visitor_summary.json';
    const params = new URLSearchParams({
      comparison: 'true',
      from_date: fromDate,
      to_date: toDate,
    });

    const url = `${getFullUrl(endpoint)}?${params.toString()}`;
    
    const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};

export default visitorComparisonAPI;