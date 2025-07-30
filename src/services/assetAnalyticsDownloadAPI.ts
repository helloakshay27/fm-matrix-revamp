import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Utility function to format date for API
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Utility function to get current site ID
const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') || 
         new URLSearchParams(window.location.search).get('site_id');
};

// Utility function to get access token
const getAccessToken = (): string => {
  return localStorage.getItem('token') || API_CONFIG.TOKEN;
};
const getBaseUrl = (): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (!baseUrl) {
    console.warn('Base URL is not configured, this should not happen with fallback');
    throw new Error('Base URL is not configured. Please check your authentication settings.');
  }
  return baseUrl;
};

// Download functionality for asset analytics
export const assetAnalyticsDownloadAPI = {
  // Download group-wise assets data
  downloadGroupWiseAssetsData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();

    const url = `${getBaseUrl()}/pms/assets/export_group_wise_assets_download.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    try {
      console.log("Fetching group-wise assets from:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download group-wise assets data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `group-wise-assets-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading group-wise assets data:', error);
      throw error;
    }
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download group-wise assets data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `group-wise-assets-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading group-wise assets data:', error);
      throw error;
    }
  },

  // Download category-wise assets data
  downloadCategoryWiseAssetsData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();

    const url = `${getBaseUrl()}/pms/assets/category_wise_assets_count_download.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    console.log("Fetching category-wise assets from:", url);
    console.log("Fetching category-wise assets from:", url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download category-wise assets data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `category-wise-assets-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading category-wise assets data:', error);
      throw error;
    }
  },

  // Download asset distributions data
  downloadAssetDistributionsData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();

    const url = `${getBaseUrl()}/pms/assets/assets_distributions_download.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    console.log("Fetching asset distributions from:", url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download asset distributions data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `asset-distributions-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading asset distributions data:', error);
      throw error;
    }
  },

  // Download assets in use data
  downloadAssetsInUseData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();

    const url = `${getBaseUrl()}/pms/assets/card_assets_in_use_download.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    console.log("Fetching assets in use from:", url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download assets in use data: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `assets-in-use-${fromDateStr}-to-${toDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading assets in use data:', error);
      throw error;
    }
  },

  // Download all asset analytics data
  downloadAllAssetAnalyticsData: async (fromDate: Date, toDate: Date, selectedTypes: string[] = []): Promise<void> => {
    try {
      const promises: Promise<void>[] = [];

      if (selectedTypes.includes('groupWise')) {
        promises.push(assetAnalyticsDownloadAPI.downloadGroupWiseAssetsData(fromDate, toDate));
      }

      if (selectedTypes.includes('categoryWise')) {
        promises.push(assetAnalyticsDownloadAPI.downloadCategoryWiseAssetsData(fromDate, toDate));
      }

      if (selectedTypes.includes('assetDistributions')) {
        promises.push(assetAnalyticsDownloadAPI.downloadAssetDistributionsData(fromDate, toDate));
      }

      if (selectedTypes.includes('statusDistribution')) {
        promises.push(assetAnalyticsDownloadAPI.downloadAssetsInUseData(fromDate, toDate));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error downloading asset analytics data:', error);
      throw error;
    }
  },
};
