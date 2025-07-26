import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

// Types for AMC Analytics API responses
export interface AMCStatusData {
  info_active_inactive: string;
  active_amc: number;
  inactive_amc: number;
  info_resource_wise: string;
  service_total: number;
  assets_total: number;
}

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current site ID dynamically from localStorage or header
const getCurrentSiteId = (): string => {
  // First try to get from localStorage with different possible keys
  const siteId = localStorage.getItem('currentSiteId') || 
                localStorage.getItem('site_id') || 
                localStorage.getItem('siteId') ||
                localStorage.getItem('selectedSiteId');
  
  // If not found in localStorage, try to get from URL or other sources
  if (!siteId) {
    // Check if there's a site ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlSiteId = urlParams.get('site_id');
    if (urlSiteId) return urlSiteId;
    
    // Default fallback
    console.warn('Site ID not found in localStorage or URL, using default: 7');
    return '7';
  }
  
  return siteId;
};

export const amcAnalyticsAPI = {
  // Get AMC status data (active/inactive and service/asset breakdown)
  async getAMCStatusData(fromDate: Date, toDate: Date): Promise<AMCStatusData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/status_of_amcs.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  }
};