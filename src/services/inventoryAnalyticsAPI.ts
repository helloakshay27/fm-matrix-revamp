// Types for inventory analytics API responses
export interface ItemsStatusData {
  active_items: number;
  inactive_items: number;
  critical_items: number;
  non_critical_items: number;
}

export interface CategoryWiseData {
  category_name: string;
  item_count: number;
}

export interface GreenConsumptionItem {
  product_name: string;
  consumption_quantity: number;
  unit: string;
  last_consumed_date: string;
}

export interface GreenConsumptionData {
  total_green_products: number;
  total_consumption: number;
  recent_consumption: GreenConsumptionItem[];
}

export interface ConsumptionReportGreenData {
  product_summary: Array<{
    product_name: string;
    total_consumed: number;
    unit: string;
    percentage_of_total: number;
  }>;
  total_consumption: number;
  reporting_period: string;
}

export interface NonGreenConsumptionItem {
  product_name: string;
  consumption_quantity: number;
  unit: string;
  category: string;
  last_consumed_date: string;
}

export interface ConsumptionReportNonGreenData {
  product_summary: Array<{
    product_name: string;
    total_consumed: number;
    unit: string;
    category: string;
    percentage_of_total: number;
  }>;
  total_consumption: number;
  reporting_period: string;
}

export interface StockData {
  product_name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  status: 'low' | 'normal' | 'overstocked';
}

export interface MinimumStockData {
  low_stock_items: StockData[];
  normal_stock_items: StockData[];
  total_monitored_items: number;
}

export interface InventoryAgingMatrix {
  age_ranges: {
    "0-30": number;
    "31-60": number;
    "61-90": number;
    "91-180": number;
    "180+": number;
  };
  categories: Array<{
    category_name: string;
    age_distribution: {
      "0-30": number;
      "31-60": number;
      "61-90": number;
      "91-180": number;
      "180+": number;
    };
  }>;
}

export interface LowStockData {
  items: Array<{
    item_name: string;
    current_stock: number;
    minimum_stock: number;
    unit: string;
    category: string;
    criticality: string;
  }>;
  total_low_stock_items: number;
}

export interface HighValueData {
  items: Array<{
    item_name: string;
    unit_cost: number;
    total_value: number;
    quantity: number;
    category: string;
  }>;
  total_high_value_items: number;
  total_value: number;
}

export interface ConsumableData {
  items: Array<{
    item_name: string;
    monthly_consumption: number;
    unit: string;
    category: string;
    stock_level: number;
  }>;
  total_consumable_items: number;
}

export interface NonConsumableData {
  items: Array<{
    item_name: string;
    asset_value: number;
    depreciation: number;
    category: string;
    condition: string;
  }>;
  total_non_consumable_items: number;
}

export interface CriticalPriorityData {
  items: Array<{
    item_name: string;
    priority_level: string;
    stock_level: number;
    minimum_required: number;
    category: string;
  }>;
  total_critical_items: number;
}

export interface MaintenanceDueData {
  items: Array<{
    item_name: string;
    last_maintenance: string;
    next_due: string;
    maintenance_type: string;
    status: string;
  }>;
  total_due_items: number;
  overdue_items: number;
}

// Utility functions
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getCurrentSiteId = (): string => {
  // Try to get site ID from localStorage or URL params
  const siteId = localStorage.getItem('current_site_id') || 
                 new URLSearchParams(window.location.search).get('site_id') ||
                 '1'; // fallback
  return siteId;
};

// Inventory Analytics API
export const inventoryAnalyticsAPI = {
  // Get items status data (active/inactive/critical)
  async getItemsStatus(fromDate: Date, toDate: Date): Promise<ItemsStatusData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/items_status.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch items status data');
    return response.json();
  },

  // Get category-wise items data
  async getCategoryWise(fromDate: Date, toDate: Date): Promise<CategoryWiseData[]> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/category_wise_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch category-wise data');
    return response.json();
  },

  // Get green consumption data
  async getGreenConsumption(fromDate: Date, toDate: Date): Promise<GreenConsumptionData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/inventory_consumption_green.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch green consumption data');
    return response.json();
  },

  // Get consumption report green data
  async getConsumptionReportGreen(fromDate: Date, toDate: Date): Promise<ConsumptionReportGreenData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/consumption_report_green.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch consumption report green data');
    return response.json();
  },

  // Get consumption report non-green data
  async getConsumptionReportNonGreen(fromDate: Date, toDate: Date): Promise<ConsumptionReportNonGreenData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/consumption_report_non_green.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch consumption report non-green data');
    return response.json();
  },

  // Get minimum stock non-green data
  async getMinimumStockNonGreen(fromDate: Date, toDate: Date): Promise<MinimumStockData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/current_minimum_stock_non_green.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch minimum stock non-green data');
    return response.json();
  },

  // Get minimum stock green data
  async getMinimumStockGreen(fromDate: Date, toDate: Date): Promise<MinimumStockData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/current_minimum_stock_green.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch minimum stock green data');
    return response.json();
  },

  // Get inventory aging matrix
  async getAgingMatrix(fromDate: Date, toDate: Date): Promise<InventoryAgingMatrix> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/aging_matrix.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch aging matrix data');
    return response.json();
  },

  // Get low stock items
  async getLowStockItems(fromDate: Date, toDate: Date): Promise<LowStockData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/low_stock_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch low stock items data');
    return response.json();
  },

  // Get high value items
  async getHighValueItems(fromDate: Date, toDate: Date): Promise<HighValueData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/high_value_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch high value items data');
    return response.json();
  },

  // Get consumable items
  async getConsumableItems(fromDate: Date, toDate: Date): Promise<ConsumableData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/consumable_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch consumable items data');
    return response.json();
  },

  // Get non-consumable items
  async getNonConsumableItems(fromDate: Date, toDate: Date): Promise<NonConsumableData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/non_consumable_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch non-consumable items data');
    return response.json();
  },

  // Get critical priority items
  async getCriticalPriorityItems(fromDate: Date, toDate: Date): Promise<CriticalPriorityData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/critical_priority_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch critical priority items data');
    return response.json();
  },

  // Get maintenance due items
  async getMaintenanceDueItems(fromDate: Date, toDate: Date): Promise<MaintenanceDueData> {
    const siteId = getCurrentSiteId();
    const response = await fetch(
      `/analytics/inventory/maintenance_due_items.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`
    );
    if (!response.ok) throw new Error('Failed to fetch maintenance due items data');
    return response.json();
  }
};