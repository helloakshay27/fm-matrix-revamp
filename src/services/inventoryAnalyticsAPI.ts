import { apiClient } from '@/utils/apiClient';

// API Response Types for Inventory Analytics
export interface ItemsStatusData {
  activeItems: number;
  inactiveItems: number;
  criticalItems: number;
  nonCriticalItems: number;
}

export interface CategoryWiseItem {
  category: string;
  count: number;
  percentage: number;
}

export interface GreenConsumptionData {
  date: string;
  product: string;
  opening: number;
  addition: number;
  consumption: number;
  current_stock: number;
  cost: number;
  unit: string;
}

export interface ConsumptionReportData {
  product: string;
  total_consumption: number;
  total_cost: number;
  unit: string;
}

export interface MinimumStockData {
  product: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  status: 'low' | 'critical' | 'normal';
}

export interface LowStockItem {
  id: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  category: string;
}

export interface HighValueItem {
  id: string;
  name: string;
  value: number;
  category: string;
  quantity: number;
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  monthly_consumption: number;
}

export interface CriticalPriorityItem {
  id: string;
  name: string;
  priority: string;
  status: string;
  category: string;
}

export interface MaintenanceDueItem {
  id: string;
  name: string;
  last_maintenance: string;
  next_maintenance: string;
  days_overdue: number;
}

export interface ItemsAgingMatrix {
  priority: string;
  '0-30': number;
  '31-60': number;
  '61-90': number;
  '91-180': number;
  '180+': number;
}

// Utility functions
function formatDateForAPI(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getCurrentSiteId(): string {
  // Get site ID from localStorage or URL params
  const siteId = localStorage.getItem('currentSiteId') || new URLSearchParams(window.location.search).get('site_id') || '1';
  return siteId;
}

export const inventoryAnalyticsAPI = {
  // Get items status data (active/inactive/critical)
  async getItemsStatusData(fromDate: Date, toDate: Date): Promise<ItemsStatusData> {
    try {
      const response = await apiClient.get('/pms/inventory/items_status.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching items status data:', error);
      // Return mock data for development
      return {
        activeItems: 234,
        inactiveItems: 56,
        criticalItems: 23,
        nonCriticalItems: 267
      };
    }
  },

  // Get category-wise items data
  async getCategoryWiseData(fromDate: Date, toDate: Date): Promise<CategoryWiseItem[]> {
    try {
      const response = await apiClient.get('/pms/inventory/category_wise_items.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching category wise data:', error);
      // Return mock data for development
      return [
        { category: 'Electronics', count: 45, percentage: 25 },
        { category: 'Mechanical', count: 38, percentage: 21 },
        { category: 'Electrical', count: 32, percentage: 18 },
        { category: 'Consumables', count: 28, percentage: 16 },
        { category: 'Safety', count: 20, percentage: 11 },
        { category: 'Others', count: 17, percentage: 9 }
      ];
    }
  },

  // Get green consumption data
  async getGreenConsumptionData(fromDate: Date, toDate: Date): Promise<GreenConsumptionData[]> {
    try {
      const response = await apiClient.get('/pms/inventory/inventory_consumption_green.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching green consumption data:', error);
      // Return mock data for development
      return [
        {
          date: '2024-01-15',
          product: 'Eco-friendly Cleaning Spray',
          opening: 100,
          addition: 50,
          consumption: 25,
          current_stock: 125,
          cost: 2500,
          unit: 'bottles'
        },
        {
          date: '2024-01-14',
          product: 'Biodegradable Paper Towels',
          opening: 200,
          addition: 100,
          consumption: 75,
          current_stock: 225,
          cost: 1125,
          unit: 'packs'
        }
      ];
    }
  },

  // Get consumption report green data
  async getConsumptionReportGreenData(fromDate: Date, toDate: Date): Promise<ConsumptionReportData[]> {
    try {
      const response = await apiClient.get('/pms/inventory/consumption_report_green.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consumption report green data:', error);
      return [
        { product: 'Green Product A', total_consumption: 150, total_cost: 3000, unit: 'units' },
        { product: 'Green Product B', total_consumption: 89, total_cost: 1780, unit: 'pieces' }
      ];
    }
  },

  // Get consumption report non-green data
  async getConsumptionReportNonGreenData(fromDate: Date, toDate: Date): Promise<ConsumptionReportData[]> {
    try {
      const response = await apiClient.get('/pms/inventory/consumption_report_non_green.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consumption report non-green data:', error);
      return [
        { product: 'Standard Product A', total_consumption: 200, total_cost: 4000, unit: 'units' },
        { product: 'Standard Product B', total_consumption: 125, total_cost: 2500, unit: 'pieces' }
      ];
    }
  },

  // Get current minimum stock green data
  async getCurrentMinimumStockGreenData(fromDate: Date, toDate: Date): Promise<MinimumStockData[]> {
    try {
      const response = await apiClient.get('/pms/inventory/current_minimum_stock_green.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current minimum stock green data:', error);
      return [
        { product: 'Eco Cleaner', current_stock: 15, minimum_stock: 25, unit: 'bottles', status: 'low' },
        { product: 'Bio Paper', current_stock: 5, minimum_stock: 20, unit: 'packs', status: 'critical' }
      ];
    }
  },

  // Get current minimum stock non-green data
  async getCurrentMinimumStockNonGreenData(fromDate: Date, toDate: Date): Promise<MinimumStockData[]> {
    try {
      const response = await apiClient.get('/pms/inventory/current_minimum_stock_non_green.json', {
        params: {
          site_id: getCurrentSiteId(),
          from_date: formatDateForAPI(fromDate),
          to_date: formatDateForAPI(toDate)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current minimum stock non-green data:', error);
      return [
        { product: 'Standard Cleaner', current_stock: 10, minimum_stock: 30, unit: 'bottles', status: 'low' },
        { product: 'Regular Paper', current_stock: 8, minimum_stock: 25, unit: 'packs', status: 'critical' }
      ];
    }
  },

  // Get low stock items
  async getLowStockItems(fromDate: Date, toDate: Date): Promise<LowStockItem[]> {
    try {
      // This would be a custom endpoint or derived from existing data
      const [greenStock, nonGreenStock] = await Promise.all([
        this.getCurrentMinimumStockGreenData(fromDate, toDate),
        this.getCurrentMinimumStockNonGreenData(fromDate, toDate)
      ]);

      return [
        ...greenStock.filter(item => item.status === 'low' || item.status === 'critical').map((item, index) => ({
          id: `green-${index}`,
          name: item.product,
          current_stock: item.current_stock,
          minimum_stock: item.minimum_stock,
          unit: item.unit,
          category: 'Green Products'
        })),
        ...nonGreenStock.filter(item => item.status === 'low' || item.status === 'critical').map((item, index) => ({
          id: `non-green-${index}`,
          name: item.product,
          current_stock: item.current_stock,
          minimum_stock: item.minimum_stock,
          unit: item.unit,
          category: 'Standard Products'
        }))
      ];
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      return [];
    }
  },

  // Get high value items (mock implementation)
  async getHighValueItems(fromDate: Date, toDate: Date): Promise<HighValueItem[]> {
    try {
      // This would need a custom API endpoint
      return [
        { id: '1', name: 'Industrial Equipment A', value: 50000, category: 'Machinery', quantity: 2 },
        { id: '2', name: 'High-End Computer System', value: 25000, category: 'Electronics', quantity: 5 },
        { id: '3', name: 'Specialized Tool Set', value: 15000, category: 'Tools', quantity: 3 }
      ];
    } catch (error) {
      console.error('Error fetching high value items:', error);
      return [];
    }
  },

  // Get consumable items (mock implementation)
  async getConsumableItems(fromDate: Date, toDate: Date): Promise<ConsumableItem[]> {
    try {
      return [
        { id: '1', name: 'Office Supplies', category: 'Stationery', current_stock: 500, monthly_consumption: 150 },
        { id: '2', name: 'Cleaning Materials', category: 'Maintenance', current_stock: 200, monthly_consumption: 75 },
        { id: '3', name: 'Safety Equipment', category: 'Safety', current_stock: 100, monthly_consumption: 25 }
      ];
    } catch (error) {
      console.error('Error fetching consumable items:', error);
      return [];
    }
  },

  // Get non-consumable items (mock implementation)
  async getNonConsumableItems(fromDate: Date, toDate: Date): Promise<ConsumableItem[]> {
    try {
      return [
        { id: '1', name: 'Furniture', category: 'Office Equipment', current_stock: 50, monthly_consumption: 2 },
        { id: '2', name: 'Machinery', category: 'Industrial', current_stock: 15, monthly_consumption: 0 },
        { id: '3', name: 'IT Equipment', category: 'Technology', current_stock: 75, monthly_consumption: 5 }
      ];
    } catch (error) {
      console.error('Error fetching non-consumable items:', error);
      return [];
    }
  },

  // Get critical priority items (mock implementation)
  async getCriticalPriorityItems(fromDate: Date, toDate: Date): Promise<CriticalPriorityItem[]> {
    try {
      return [
        { id: '1', name: 'Emergency Generator', priority: 'Critical', status: 'Active', category: 'Emergency Equipment' },
        { id: '2', name: 'Fire Safety System', priority: 'High', status: 'Maintenance Required', category: 'Safety' },
        { id: '3', name: 'Server Equipment', priority: 'Critical', status: 'Active', category: 'IT Infrastructure' }
      ];
    } catch (error) {
      console.error('Error fetching critical priority items:', error);
      return [];
    }
  },

  // Get maintenance due items (mock implementation)
  async getMaintenanceDueItems(fromDate: Date, toDate: Date): Promise<MaintenanceDueItem[]> {
    try {
      return [
        { id: '1', name: 'Air Conditioning Unit', last_maintenance: '2024-01-01', next_maintenance: '2024-01-15', days_overdue: 5 },
        { id: '2', name: 'Elevator System', last_maintenance: '2023-12-15', next_maintenance: '2024-01-10', days_overdue: 10 },
        { id: '3', name: 'HVAC System', last_maintenance: '2023-12-20', next_maintenance: '2024-01-20', days_overdue: 0 }
      ];
    } catch (error) {
      console.error('Error fetching maintenance due items:', error);
      return [];
    }
  },

  // Get items aging matrix
  async getItemsAgingMatrix(fromDate: Date, toDate: Date): Promise<ItemsAgingMatrix[]> {
    try {
      // This would need a custom API endpoint
      return [
        { priority: 'P1', '0-30': 20, '31-60': 3, '61-90': 4, '91-180': 0, '180+': 203 },
        { priority: 'P2', '0-30': 2, '31-60': 0, '61-90': 0, '91-180': 0, '180+': 4 },
        { priority: 'P3', '0-30': 1, '31-60': 0, '61-90': 1, '91-180': 0, '180+': 7 },
        { priority: 'P4', '0-30': 1, '31-60': 0, '61-90': 0, '91-180': 0, '180+': 5 }
      ];
    } catch (error) {
      console.error('Error fetching items aging matrix:', error);
      return [];
    }
  }
};