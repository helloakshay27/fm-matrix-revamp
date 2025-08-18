import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

export interface HostWiseVisitorResponse {
  success: number;
  message: string;
  host_wise_guest_count: {
    visitorsByHost: Record<string, number>;
    info: {
      visitorsByHost: string;
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export const visitorHostWiseAPI = {
  getHostWiseVisitors: async (
    fromDate: string, 
    toDate: string
  ): Promise<HostWiseVisitorResponse> => {
    const endpoint = '/pms/visitors/visitor_summary.json';
    const params = new URLSearchParams({
      host_wise_guest_count: 'true',
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

export default visitorHostWiseAPI;