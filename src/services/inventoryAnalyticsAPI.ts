// Types for inventory analytics API responses
export interface ItemsStatusData {
  info_active_items: string;
  count_of_active_items: number;
  info_inactive_items: string;
  count_of_inactive_items: number;
  info_critical_items: string;
  count_of_critical_items: number;
  info_non_critical_items: string;
  count_of_non_critical_items: number;
}

export interface CategoryWiseData {
  info_active_items: string;
  count_of_active_items: number;
  info_inactive_items: string;
  count_of_inactive_items: number;
  info_critical_items: string;
  count_of_critical_items: number;
  info_non_critical_items: string;
  count_of_non_critical_items: number;
}

export interface GreenConsumptionData {
  success: number;
  message: string;
  response: Array<{
    date: string;
    product: string;
    unit: string;
    opening: number;
    addition: number;
    consumption: number;
    current_stock: number;
    cost_per_unit: number;
    cost: number;
  }>;
  info: {
    formula: string;
    info: string;
  };
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
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentSiteId = (): string => {
  const siteId = localStorage.getItem('currentSiteId') || 
                localStorage.getItem('site_id') || 
                localStorage.getItem('siteId') ||
                localStorage.getItem('selectedSiteId');
  
  if (!siteId) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSiteId = urlParams.get('site_id');
    if (urlSiteId) return urlSiteId;
    
    console.warn('Site ID not found, using default: 7');
    return '7';
  }
  
  return siteId;
};

const getAccessToken = (): string => {
  return localStorage.getItem('access_token') || 'WzsvAV9ZPDWxXK-e0sJK0Sda6HDnQ1aTLaYnjXuWthU';
};

// Inventory Analytics API
export const inventoryAnalyticsAPI = {
  // Get items status data (active/inactive/critical)
  async getItemsStatus(fromDate: Date, toDate: Date): Promise<ItemsStatusData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/items_status.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get category-wise items data
  async getCategoryWise(fromDate: Date, toDate: Date): Promise<CategoryWiseData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/category_wise_items.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get green consumption data
  async getGreenConsumption(fromDate: Date, toDate: Date): Promise<GreenConsumptionData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/inventory_consumption_green.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get consumption report green data
  async getConsumptionReportGreen(fromDate: Date, toDate: Date): Promise<any> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/consumption_report_green.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get consumption report non-green data
  async getConsumptionReportNonGreen(fromDate: Date, toDate: Date): Promise<any> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/consumption_report_non_green.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get minimum stock non-green data
  async getCurrentMinimumStockNonGreen(fromDate: Date, toDate: Date): Promise<any> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/current_minimum_stock_non_green.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // Get minimum stock green data
  async getCurrentMinimumStockGreen(fromDate: Date, toDate: Date): Promise<any> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `https://fm-uat-api.lockated.com/pms/inventories/current_minimum_stock_green.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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