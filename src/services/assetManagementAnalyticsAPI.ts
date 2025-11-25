import { apiClient } from '@/utils/apiClient';

// Helpers
const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const assetManagementAnalyticsAPI = {
  async getAssetOverview(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/asset_overview?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getHighestMaintenanceAssets(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/highest_maintenance_assets?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getAmcContractSummary(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/amc_contract_summary?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async downloadAssetOverview(fromDate: Date, toDate: Date): Promise<void> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/export_asset_overview/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Create a blob from the response
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `asset_overview_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  async downloadAmcOverview(fromDate: Date, toDate: Date): Promise<void> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/export_amc_overview/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Create a blob from the response
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `amc_overview_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export default assetManagementAnalyticsAPI;
