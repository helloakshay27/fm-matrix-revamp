import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Helper function to format date as YYYY-MM-DD (using local date components to avoid timezone issues)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper functions to get site ID and access token
const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') || '0';
};

const getAccessToken = (): string => {
  return localStorage.getItem('token') || '';
};

// F&B Analytics Interfaces
export interface PopularRestaurant {
  name: string;
  orders: number;
}

export interface OrderStatsData {
  food_and_booking_statistics: {
    order_stats: {
      total_orders: number;
      popular_restaurants: PopularRestaurant[];
    };
    orders_over_time?: {
      daily?: Array<{
        period: string;
        day_name: string;
        count: number;
      }>;
      weekly?: Array<{
        period: string;
        week_start: string;
        week_end: string;
        month_name: string;
        count: number;
      }>;
      monthly?: Array<{
        period: string;
        month_name: string;
        count: number;
      }>;
    };
    peak_ordering?: {
      hourly_distribution?: Array<{
        date: string;
        day_name: string;
        hour: string;
        count: number;
      }>;
      peak_slots?: Array<{
        date: string;
        day_name: string;
        hour: string;
        count: number;
      }>;
      peak_count?: number;
    };
    filters?: {
      site_ids: number[];
      from_date: string | null;
      to_date: string | null;
    };
  };
}

// F&B Analytics API
export const fbAnalyticsAPI = {
  async getOrderStats(fromDate: Date, toDate: Date): Promise<OrderStatsData> {
    const siteId = getCurrentSiteId();
    const accessToken = getAccessToken();
    const baseUrl = localStorage.getItem('baseUrl') || API_CONFIG.BASE_URL.replace('https://', '');
    
    // Format dates for API
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `https://${baseUrl}/pms/admin/food_orders/food_and_booking.json?site_id=${siteId}&access_token=${encodeURIComponent(accessToken)}&true=order_stats&from_date=${fromDateStr}&to_date=${toDateStr}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order stats: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Order stats API response:', data);
    return data;
  },
};


