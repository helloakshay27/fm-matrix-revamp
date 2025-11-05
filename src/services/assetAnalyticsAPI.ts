import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Asset Analytics Interfaces
export interface AssetGroupWiseData {
  assets_statistics?: {
    assets_group_count_by_name?: Array<{
      group_name: string;
      count: number;
    }>;
    filters?: {
      site_ids: number[];
      site_names: string[];
      from_date: string | null;
      to_date: string | null;
    };
  };
  // Legacy support for old structure
  info?: string;
  group_wise_assets?: Array<{
    group_name: string;
    asset_count: number;
  }>;
}

export interface AssetStatusData {
  success?: number;
  message?: string;
  assets_in_use_total?: number;
  assets_in_breakdown_total?: number;
  in_store?: number;
  in_disposed?: number;
  info?: string;
}

export interface AssetDistributionData {
  success?: number;
  message?: string;
  assets_statistics?: {
    assets_distribution?: {
      it_assets_count: number;
      non_it_assets_count: number;
    };
    filters?: {
      site_ids: number[];
      site_names: string[];
      from_date: string | null;
      to_date: string | null;
    };
  };
  // Legacy support for old structure
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
  total_assets?: {
    assets_total_count: number;
    assets_total_count_info: string;
  };
  total_assets_count?: {
    info: string;
    total_assets_count: number;
  };
  assets_in_use?: {
    assets_in_use_total: number;
    assets_in_use_info: string;
  };
  assets_in_breakdown?: {
    assets_in_breakdown_total: number;
    assets_in_breakdown_info: string;
  };
  critical_assets_breakdown?: {
    critical_assets_breakdown_total: number;
    critical_assets_breakdown_info: string;
  };
  ppm_conduct_assets_count?: {
    info: string;
    overdue_assets: string;
    total: number;
  };
  ppm_overdue_assets?: {
    ppm_conduct_assets_count: number;
    ppm_conduct_assets_info: {
      info: string;
      total: number;
    };
  };
  amc_assets?: {
    assets_under_amc: number;
    assets_missing_amc: number;
    info: string;
  };
  average_customer_rating?: {
    info: string;
    avg_rating: number;
  };
  // Legacy support for transformed data
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
  assets_statistics?: {
    asset_categorywise?: Array<{
      category: string;
      count: number;
    }>;
    filters?: {
      site_ids: number[];
      site_names: string[];
      from_date: string | null;
      to_date: string | null;
    };
  };
  // Legacy support for old structure
  categories?: Array<{
    category_name: string;
    asset_count: number;
    percentage: number;
  }>;
  // Legacy support for old API structure
  asset_type_category_counts?: {
    [key: string]: number;
  };
}

// Utility Functions
const formatDateForAPI = (date: Date): string => {
  // Use local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_statistics.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}&assets_group_count_by_name=true`;

    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch group wise assets: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Group wise assets API response:', data);
    
    // Transform the new response structure to maintain backward compatibility
    if (data.assets_statistics?.assets_group_count_by_name) {
      return {
        ...data,
        // Add legacy group_wise_assets structure for backward compatibility
        group_wise_assets: data.assets_statistics.assets_group_count_by_name.map(item => ({
          group_name: item.group_name,
          asset_count: item.count
        })),
        // Add legacy info field
        info: `Total groups: ${data.assets_statistics.assets_group_count_by_name.length}`
      };
    }
    
    return data;
  },

  async getAssetStatus(fromDate: Date, toDate: Date): Promise<AssetStatusData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    // Use the new assets_status endpoint
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_statistics.json?assets_status=true&site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}`;

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
    
    // Extract the status data from the response
    return data.assets_statistics?.status || data;
  },

  async getAssetDistribution(fromDate: Date, toDate: Date): Promise<AssetDistributionData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_statistics.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}&assets_distribution=true`;
    
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
    
    // Transform the new response structure to maintain backward compatibility
    if (data.assets_statistics?.assets_distribution) {
      return {
        ...data,
        // Add legacy info structure for backward compatibility
        info: {
          info: `IT Assets: ${data.assets_statistics.assets_distribution.it_assets_count}, Non-IT Assets: ${data.assets_statistics.assets_distribution.non_it_assets_count}`,
          total_it_assets: data.assets_statistics.assets_distribution.it_assets_count,
          total_non_it_assets: data.assets_statistics.assets_distribution.non_it_assets_count,
        }
      };
    }
    
    return data;
  },

  async getAssetStatistics(fromDate: Date, toDate: Date): Promise<AssetStatisticsData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    
    // Note: The API endpoint has "statictics" (not "statistics") - this appears to be the correct endpoint
    const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_statistics.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}&total_assets=true&assets_in_use=true&assets_in_breakdown=true&critical_assets_breakdown=true&ppm_overdue_assets=true&amc_assets=true`;
    
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
    
    // Extract the assets_statistics from the response
    return data.assets_statistics || data;
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
      const url = `${API_CONFIG.BASE_URL}/pms/assets/assets_statistics.json?site_id=${siteId}&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}&access_token=${accessToken}&asset_categorywise=true`;
      
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
      
      // Transform the new API response structure to maintain backward compatibility
      if (data.assets_statistics?.asset_categorywise) {
        const assetCounts = data.assets_statistics.asset_categorywise.map(item => item.count);
        const totalAssets = assetCounts.reduce((sum, count) => sum + Number(count), 0);
        
        const categories = data.assets_statistics.asset_categorywise.map(item => {
          const count = Number(item.count);
          return {
            category_name: item.category,
            asset_count: count,
            percentage: totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0
          };
        });
        
        return {
          ...data,
          categories
        };
      }
      
      // Legacy support for old structure
      if (data.asset_type_category_counts) {
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
      }
      
      return data;
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