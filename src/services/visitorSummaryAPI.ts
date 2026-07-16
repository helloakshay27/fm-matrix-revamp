import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

export interface VisitorSummaryResponse {
  success: number;
  message: string;
  totalVisitors: number;
  expectedVisitors: number;
  unexpectedVisitors: number;
  totalGatePass: number;
  returnableGatePass: number;
  nonReturnableGatePass: number;
  totalVehicle: number;
  info: {
    totalVisitors: string;
    expectedVisitors: string;
    unexpectedVisitors: string;
    totalGatePass: string;
    totalVehicle: string;
    returnableGatePass: string;
    nonReturnableGatePass: string;
  };
}

export const visitorSummaryAPI = {
  getVisitorSummary: async (
    fromDate: string,
    toDate: string
  ): Promise<VisitorSummaryResponse> => {
    const endpoint = '/pms/visitors/visitor_summary.json';
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
    });

    const siteId =
      localStorage.getItem('selectedSiteId') ||
      localStorage.getItem('site_id') ||
      localStorage.getItem('siteId');
    if (siteId) {
      params.append('site_id', siteId);
    }

    const url = `${getFullUrl(endpoint)}?${params.toString()}`;

    const response = await fetch(url, getAuthenticatedFetchOptions('GET'));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};

export default visitorSummaryAPI;
