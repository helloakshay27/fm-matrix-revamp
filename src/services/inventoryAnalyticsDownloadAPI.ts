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

// Utility function to get access token
const getAccessToken = (): string => {
  return localStorage.getItem('token') || API_CONFIG.TOKEN;
};

// Download functionality for inventory analytics
export const inventoryAnalyticsDownloadAPI = {
  // Download items status data
  downloadItemsStatusData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/inventories/items_status.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download items status data: ${response.status}`);
      }

      const jsonData = await response.json();
      
      // Convert JSON to CSV or Excel format for download
      const csvContent = convertItemsStatusToCSV(jsonData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `items-status-${fromDateStr}-to-${toDateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading items status data:', error);
      throw error;
    }
  },

  // Download category wise data
  downloadCategoryWiseData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const endpoint = `${API_CONFIG.BASE_URL}/pms/inventories/category_wise_items.json`;
    const url = `${endpoint}?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download category wise data: ${response.status}`);
      }

      const jsonData = await response.json();
      
      // Convert JSON to CSV format for download
      const csvContent = convertCategoryWiseToCSV(jsonData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `category-wise-items-${fromDateStr}-to-${toDateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading category wise data:', error);
      throw error;
    }
  },
};

// Helper function to convert items status data to CSV
const convertItemsStatusToCSV = (data: any): string => {
  const headers = ['Metric', 'Count', 'Description'];
  const rows = [
    ['Active Items', data.count_of_active_items, data.info_active_items],
    ['Inactive Items', data.count_of_inactive_items, data.info_inactive_items],
    ['Critical Items', data.count_of_critical_items, data.info_critical_items],
    ['Non-Critical Items', data.count_of_non_critical_items, data.info_non_critical_items],
  ];

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

// Helper function to convert category wise data to CSV
const convertCategoryWiseToCSV = (data: any): string => {
  const headers = ['Group Name', 'Item Count'];
  const rows = data.category_counts?.map((item: any) => [
    item.group_name,
    item.item_count
  ]) || [];

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};