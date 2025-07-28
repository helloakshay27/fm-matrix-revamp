import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Utility function to format date for API
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Utility function to get current site ID
const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') || 
         new URLSearchParams(window.location.search).get('site_id') || 
         '7';
};

// Download functionality for different chart types
export const taskAnalyticsDownloadAPI = {
  // Download technical checklist data
  downloadTechnicalChecklistData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/custom_forms/chart_technical_checklist_download.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download technical checklist data: ${response.status}`);
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `technical-checklist-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading technical checklist data:', error);
      throw error;
    }
  },

  // Download non-technical checklist data
  downloadNonTechnicalChecklistData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/custom_forms/chart_non_technical_checklist_download.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download non-technical checklist data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `non-technical-checklist-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading non-technical checklist data:', error);
      throw error;
    }
  },

  // Download top ten checklist data
  downloadTopTenChecklistData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/custom_forms/top_ten_checklist_download.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download top ten checklist data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `top-ten-checklist-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading top ten checklist data:', error);
      throw error;
    }
  },

  // Download site-wise checklist data
  downloadSiteWiseChecklistData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/custom_forms/chart_checklist_download.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download site-wise checklist data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `site-wise-checklist-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading site-wise checklist data:', error);
      throw error;
    }
  },
};