import { API_CONFIG } from '@/config/apiConfig';

// Types for Schedule Analytics API responses
export interface ScheduleOverviewData {
  total_schedules: number;
  completed_schedules: number;
  pending_schedules: number;
  overdue_schedules: number;
  completion_rate: number;
  schedule_breakdown: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface ScheduleCompletionData {
  completion_trend: Array<{
    date: string;
    completed: number;
    pending: number;
    total: number;
  }>;
  monthly_completion: Array<{
    month: string;
    completion_rate: number;
    total_schedules: number;
  }>;
}

export interface ResourceUtilizationData {
  resource_allocation: Array<{
    resource_name: string;
    allocated_schedules: number;
    completed_schedules: number;
    utilization_rate: number;
  }>;
  department_wise: Array<{
    department: string;
    total_resources: number;
    active_schedules: number;
    efficiency_rate: number;
  }>;
}

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current site ID dynamically from localStorage
const getCurrentSiteId = (): string => {
  const siteId = localStorage.getItem('currentSiteId') || 
                localStorage.getItem('site_id') || 
                localStorage.getItem('siteId') ||
                localStorage.getItem('selectedSiteId');
  
  if (!siteId) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSiteId = urlParams.get('site_id');
    if (urlSiteId) return urlSiteId;
    
    console.warn('Site ID not found in localStorage or URL, using default: 7');
    return '7';
  }
  
  return siteId;
};

// Get access token from localStorage
const getAccessToken = (): string => {
  return localStorage.getItem('token') || API_CONFIG.TOKEN || '';
};

export const scheduleAnalyticsAPI = {
  // Get schedule overview data
  async getScheduleOverview(fromDate: Date, toDate: Date): Promise<ScheduleOverviewData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `${API_CONFIG.BASE_URL}/pms/schedule_analytics/overview.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get schedule completion data
  async getScheduleCompletion(fromDate: Date, toDate: Date): Promise<ScheduleCompletionData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `${API_CONFIG.BASE_URL}/pms/schedule_analytics/completion.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get resource utilization data
  async getResourceUtilization(fromDate: Date, toDate: Date): Promise<ResourceUtilizationData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    const accessToken = getAccessToken();
    
    const url = `${API_CONFIG.BASE_URL}/pms/schedule_analytics/resource_utilization.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};