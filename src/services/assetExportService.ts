import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Utility function to get current site ID
const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') || 
         new URLSearchParams(window.location.search).get('site_id') ||
         '';
};

// Utility function to get access token
const getAccessToken = (): string => {
  return localStorage.getItem('token') || API_CONFIG.TOKEN || '';
};

const getBaseUrl = (): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (!baseUrl) {
    throw new Error('Base URL is not configured. Please check your authentication settings.');
  }
  return baseUrl;
};

interface ExportStartResponse {
  export_key: string;
  [key: string]: any;
}

interface ExportStatusResponse {
  status: 'processing' | 'done' | 'failed';
  isFile?: boolean;
  [key: string]: any;
}

export const assetExportService = {
  /**
   * Start the digital register export (asset_register_export)
   * GET /pms/assets/asset_register_export
   */
  startDigitalRegisterExport: async (): Promise<ExportStartResponse> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    const params = new URLSearchParams({ access_token: accessToken });
    // if (siteId) params.set('q[pms_site_id_eq]', siteId);
    const url = `${getBaseUrl()}/pms/assets/asset_register_export?${params}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to start digital register export: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error starting digital register export:', error);
      throw error;
    }
  },

  /**
   * Start the asset export process (excel data report)
   * GET /pms/assets/assets_data_report_export
   */
  startExport: async (): Promise<ExportStartResponse> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${getBaseUrl()}/pms/assets/assets_data_report_export?site_id=${siteId}&access_token=${accessToken}`;
    
    console.log('Starting asset export with URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to start asset export: ${response.status}`);
      }

      const data = await response.json();
      console.log('Export started successfully, response:', data);
      return data;
    } catch (error) {
      console.error('Error starting asset export:', error);
      throw error;
    }
  },

  /**
   * Poll the status of a digital register export
   * GET /pms/assets/export_status?key=KEY  → always returns JSON { status: 'processing' | 'done' | 'failed' }
   */
  checkDigitalRegisterExportStatus: async (key: string): Promise<ExportStatusResponse> => {
    const accessToken = getAccessToken();
    const url = `${getBaseUrl()}/pms/assets/export_status?key=${key}&access_token=${accessToken}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: getAuthHeader() },
      });
      if (!response.ok) {
        throw new Error(`Failed to check digital register export status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error checking digital register export status:', error);
      throw error;
    }
  },

  /**
   * Trigger download of a digital register export via browser navigation
   * GET /pms/assets/download_export?key=KEY  → returns .xlsx attachment
   */
  downloadDigitalRegisterExport: (key: string): void => {
    const accessToken = getAccessToken();
    window.location.href = `${getBaseUrl()}/pms/assets/download_export?key=${key}&access_token=${accessToken}`;
  },

  /**
   * Poll the status of an export
   * GET /pms/assets/export_status?key=KEY
   * Returns either JSON (status: processing/failed) or binary file (when ready)
   */
  checkExportStatus: async (key: string): Promise<ExportStatusResponse> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${getBaseUrl()}/pms/assets/export_status.json?key=${key}&site_id=${siteId}&access_token=${accessToken}`;
    
    console.log('Checking export status with URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check export status: ${response.status}`);
      }

      // Check content type to determine response format
      const contentType = response.headers.get('content-type') || '';
      
      console.log('Export status response content-type:', contentType);
      
      // If it's a file download (binary), the file is ready
      if (contentType.includes('spreadsheet') || response.headers.get('content-disposition')) {
        console.log('File is ready for download!');
        return {
          status: 'done',
          isFile: true,
        };
      }

      // Otherwise, it's JSON with status
      const data = await response.json();
      console.log('Export status:', data);
      return data;
    } catch (error) {
      console.error('Error checking export status:', error);
      throw error;
    }
  },

  /**
   * Download the exported file
   * GET /pms/assets/download_export?key=KEY
   */
  downloadExport: async (key: string, filename?: string): Promise<void> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${getBaseUrl()}/pms/assets/download_export.json?key=${key}&site_id=${siteId}&access_token=${accessToken}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download asset export: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || `assets-export-${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading asset export:', error);
      throw error;
    }
  },
};
