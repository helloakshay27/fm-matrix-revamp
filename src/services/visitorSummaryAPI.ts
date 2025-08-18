import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

export interface VisitorSummaryResponse {
  success: number;
  message: string;
  summary: {
    totalVisitors: number;
    expectedVisitors: number;
    unexpectedVisitors: number;
    info: {
      totalVisitors: string;
      expectedVisitors: string;
      unexpectedVisitors: string;
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export const visitorSummaryAPI = {
  getVisitorSummary: async (
    fromDate: string, 
    toDate: string
  ): Promise<VisitorSummaryResponse> => {
    const endpoint = '/pms/visitors/visitor_summary.json';
    const params = new URLSearchParams({
      summary: 'true',
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

export default visitorSummaryAPI;