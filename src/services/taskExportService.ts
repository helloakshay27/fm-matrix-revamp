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
  export_id: string;
  [key: string]: any;
}

interface ExportStatusResponse {
  status: 'processing' | 'completed' | 'failed';
  [key: string]: any;
}

interface ExportFilters {
  dateFrom?: string;
  dateTo?: string;
  checklist?: string;
  type?: string;
  assignedTo?: string;
  supplierId?: string;
  taskId?: string;
  assetGroupId?: string;
  assetSubGroupId?: string;
  scheduleType?: string;
  searchChecklist?: string;
  searchTaskId?: string;
  taskCategory?: string;
  [key: string]: string | undefined;
}

export const taskExportService = {
  /**
   * Start the task export process
   * GET /pms/users/scheduled_tasks_export
   * Supports filters for filtered exports
   */
  startExport: async (filters?: ExportFilters): Promise<ExportStartResponse> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('site_id', siteId);
    queryParams.append('access_token', accessToken);
    
    // Add filters if provided
    if (filters) {
      if (filters.dateFrom) queryParams.append('q[start_date_gteq]', filters.dateFrom);
      if (filters.dateTo) queryParams.append('q[start_date_lteq]', filters.dateTo);
      if (filters.checklist) queryParams.append('q[custom_form_form_name_eq]', filters.checklist);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.assignedTo) queryParams.append('q[pms_task_assignments_assigned_to_id_eq]', filters.assignedTo);
      if (filters.supplierId) queryParams.append('q[custom_form_supplier_id_eq]', filters.supplierId);
      if (filters.taskId) queryParams.append('q[id_eq]', filters.taskId);
      if (filters.assetGroupId) queryParams.append('q[asset_pms_asset_group_id_eq]', filters.assetGroupId);
      if (filters.assetSubGroupId) queryParams.append('q[asset_pms_asset_sub_group_id_eq]', filters.assetSubGroupId);
      if (filters.scheduleType) queryParams.append('q[custom_form_sch_type_eq', filters.scheduleType);
      if (filters.searchChecklist) queryParams.append('q[custom_form_form_name_cont]', filters.searchChecklist);
      if (filters.searchTaskId) queryParams.append('q[id_cont]', filters.searchTaskId);
      if (filters.taskCategory) queryParams.append('q[task_category_eq]', filters.taskCategory);
    }
    
    const url = `${getBaseUrl()}/pms/users/scheduled_tasks_export?${queryParams.toString()}`;
    
    console.log('Starting task export with URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to start task export: ${response.status}`);
      }

      const data = await response.json();
      console.log('Task export started successfully, response:', data);
      return data;
    } catch (error) {
      console.error('Error starting task export:', error);
      throw error;
    }
  },

  /**
   * Poll the status of an export
   * GET /pms/users/export_status?id=ID
   * Returns either JSON (status: processing/completed/failed)
   */
  checkExportStatus: async (id: string): Promise<ExportStatusResponse> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${getBaseUrl()}/pms/users/export_status?id=${id}&site_id=${siteId}&access_token=${accessToken}`;
    
    console.log('Checking task export status with URL:', url);
    
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
      
      console.log('Task export status response content-type:', contentType);
      
      // If it's a file download (binary), the file is ready
      if (contentType.includes('spreadsheet') || response.headers.get('content-disposition')) {
        console.log('File is ready for download!');
        return {
          status: 'completed',
          isFile: true,
        };
      }

      // Otherwise, it's JSON with status
      const data = await response.json();
      console.log('Task export status:', data);
      return data;
    } catch (error) {
      console.error('Error checking task export status:', error);
      throw error;
    }
  },

  /**
   * Download the exported file
   * GET /pms/users/download_export?id=ID
   */
  downloadExport: async (id: string, filename?: string): Promise<void> => {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${getBaseUrl()}/pms/users/download_export?id=${id}&site_id=${siteId}&access_token=${accessToken}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download task export: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || `tasks-export-${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading task export:', error);
      throw error;
    }
  },
};
