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

// Download functionality for different ticket analytics chart types
export const ticketAnalyticsDownloadAPI = {
  // Download ticket aging matrix data
  downloadTicketAgingMatrixData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/admin/complaints/ticket_ageing_matrix_downloads.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download ticket aging matrix data: ${response.status}`);
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `ticket-aging-matrix-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading ticket aging matrix data:', error);
      throw error;
    }
  },

  // Download unit category-wise data
  downloadUnitCategorywiseData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/admin/complaints/chart_unit_categorywise_downloads.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download unit category-wise data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `unit-categorywise-tickets-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading unit category-wise data:', error);
      throw error;
    }
  },

  // Download resolution TAT data
  downloadResolutionTATData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/admin/complaints/chart_resolution_tat_downloads.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download resolution TAT data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `resolution-tat-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading resolution TAT data:', error);
      throw error;
    }
  },

  // Download response TAT data
  downloadResponseTATData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/admin/complaints/chart_response_tat_downloads.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download response TAT data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `response-tat-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading response TAT data:', error);
      throw error;
    }
  },
};