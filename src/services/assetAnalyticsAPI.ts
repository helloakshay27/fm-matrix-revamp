import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Asset Analytics Interfaces
export interface AssetGroupWiseData {
  info: string;
  group_wise_assets: Array<{
    group_name: string;
    asset_count: number;
  }>;
}

export interface AssetStatusData {
  success?: number;
  message?: string;
  info?: {
    info: string;
    total_assets_in_breakdown: number;
    total_assets_in_use: number;
  };
}

export interface AssetDistributionData {
  success?: number;
  message?: string;
  info?: {
    info: string;
    total_it_assets: number;
    total_non_it_assets: number;
  };
  sites?: Array<{
    site_name: string;
    asset_count: number;
  }>;
}

export interface AssetStatisticsData {
  total_assets_count?: {
    info: string;
    total_assets_count: number;
  };
  assets_in_use?: {
    info: string;
    total_assets_in_use: number;
  };
  assets_in_breakdown?: {
    info: string;
    total_assets_in_breakdown: number;
  };
  critical_assets_in_breakdown?: {
    info: string;
    total_assets_in_breakdown: number;
  };
  ppm_conduct_assets_count?: {
    info: string;
    overdue_assets: string;
    total: number;
  };
  average_customer_rating?: {
    info: string;
    avg_rating: number;
  };
  // Legacy support for transformed data
  total_assets?: number;
  total_value?: string;
  it_assets?: number;
  non_it_assets?: number;
  critical_assets?: number;
  ppm_assets?: number;
  average_rating?: number;
}

export interface AssetBreakdownData {
  breakdown_by_group: Array<{
    group_name: string;
    breakdown_count: number;
    total_count: number;
  }>;
  critical_breakdown: Array<{
    asset_name: string;
    group_name: string;
    breakdown_date: string;
    priority: string;
  }>;
}

export interface CategoryWiseAssetsData {
  categories: Array<{
    category_name: string;
    asset_count: number;
    percentage: number;
  }>;
}

// Utility Functions
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') || 
         new URLSearchParams(window.location.search).get('site_id');
};

const getAccessToken = (): string => {
  return localStorage.getItem('access_token') || 
         API_CONFIG.TOKEN || 
         'BcN-zqYejFbQ2jnNorpCGRoVfdzPHcgQRP1bw8jQJYQ';
};

// Asset Analytics API
export const assetAnalyticsAPI = {
  async getGroupWiseAssets(fromDate: Date, toDate: Date): Promise<AssetGroupWiseData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    const url = `${API_CONFIG.BASE_URL}/pms/assets/group_wise_assets.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch group wise assets: ${response.statusText}`);
    }

    return response.json();
  },

  async getAssetStatus(fromDate: Date, toDate: Date): Promise<AssetStatusData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    // Use the new assets_status endpoint
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_status.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset status: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Asset status API response:', data);
    
    // Return the data as received from the API
    return data;
  },

  async getAssetDistribution(fromDate: Date, toDate: Date): Promise<AssetDistributionData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_distributions.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset distributions: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Asset distributions API response:', data);
    return data;
  },

  async getAssetStatistics(fromDate: Date, toDate: Date): Promise<AssetStatisticsData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    // Note: The API endpoint has "statictics" (not "statistics") - this appears to be the correct endpoint
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_statictics.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset statistics: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Asset statistics API response:', data);
    
    return data;
  },

  async getAssetBreakdown(fromDate: Date, toDate: Date): Promise<AssetBreakdownData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${API_CONFIG.BASE_URL}/pms/assets/asset_breakdown.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset breakdown: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Asset breakdown API response:', data);
    return data;
  },

  async getCategoryWiseAssets(fromDate: Date, toDate: Date): Promise<CategoryWiseAssetsData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/assets/category_wise_assets_count.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch category wise assets: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Category wise assets API response:', data);
      
      // Transform the API response to match our interface
      const assetCounts = Object.values(data.asset_type_category_counts) as number[];
      const totalAssets = assetCounts.reduce((sum, count) => sum + Number(count), 0);
      
      const categories = Object.entries(data.asset_type_category_counts).map(([categoryName, assetCount]) => {
        const count = Number(assetCount);
        return {
          category_name: categoryName,
          asset_count: count,
          percentage: totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0
        };
      });
      
      return { categories };
    } catch (error) {
      console.error('Error fetching category wise assets:', error);
      throw error;
    }
  },

  // Overall analytics API that combines multiple endpoints
  async getOverallAssetAnalytics(fromDate: Date, toDate: Date): Promise<any> {
    try {
      const [groupWise, status, statistics, distributions, categoryWise] = await Promise.all([
        this.getGroupWiseAssets(fromDate, toDate),
        this.getAssetStatus(fromDate, toDate),
        this.getAssetStatistics(fromDate, toDate),
        this.getAssetDistribution(fromDate, toDate),
        this.getCategoryWiseAssets(fromDate, toDate),
      ]);

      return {
        group_wise: groupWise,
        status: status,
        statistics: statistics,
        distributions: distributions,
        category_wise: categoryWise,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching overall asset analytics:', error);
      throw error;
    }
  },
};