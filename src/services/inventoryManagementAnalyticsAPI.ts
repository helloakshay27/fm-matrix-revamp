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
};

export default inventoryManagementAnalyticsAPI;
