import { apiClient } from '@/utils/apiClient';

// Helpers
const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const inventoryManagementAnalyticsAPI = {
  async getInventoryOverstockReport(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/inventory_overstock_report?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },
  async getCenterWiseConsumables(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/center_wise_consumables?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },
  async getConsumableInventoryComparison(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/consumable_inventory_comparison?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },
  async downloadInventoryOverstockReport(fromDate: Date, toDate: Date): Promise<Blob> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/export_inventory_overstock_report/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Create blob and trigger download
    const blob = new Blob([resp.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `inventory_overstock_report_${start}_to_${end}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
    
    return blob;
  },
  async downloadCenterWiseConsumables(fromDate: Date, toDate: Date): Promise<Blob> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/export_center_wise_consumables/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Create blob and trigger download
    const blob = new Blob([resp.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `center_wise_consumables_${start}_to_${end}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
    
    return blob;
  },
  async downloadConsumableInventoryComparison(fromDate: Date, toDate: Date): Promise<Blob> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/export_consumable_inventory_comparison/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    // Create blob and trigger download
    const blob = new Blob([resp.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `consumable_inventory_comparison_${start}_to_${end}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
    
    return blob;
  },
};

export default inventoryManagementAnalyticsAPI;
