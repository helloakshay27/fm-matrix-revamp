import { getFullUrl } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';

// Technical Checklist Response
export interface TechnicalChecklistData {
  [key: string]: {
    closed: number;
    open: number;
    work_in_progress: number;
    overdue: number;
  };
}

export interface TechnicalChecklistResponse {
  success: number;
  message: string;
  response: TechnicalChecklistData;
  info: string;
}

// Non-Technical Checklist Response
export interface NonTechnicalChecklistData {
  [key: string]: {
    closed: number;
    open: number;
    work_in_progress: number;
    overdue: number;
  };
}

export interface NonTechnicalChecklistResponse {
  success: number;
  message: string;
  response: NonTechnicalChecklistData;
  info: string;
}

// Top Ten Checklist Response
export interface TopTenChecklistItem {
  type: string;
  count: number;
}

export interface TopTenChecklistResponse {
  success: number;
  message: string;
  response: TopTenChecklistItem[];
  info: string;
}

// Site Wise Checklist Response
export interface SiteWiseChecklistData {
  [siteName: string]: {
    open: number;
    closed: number;
    work_in_progress: number;
    overdue: number;
  };
}

export interface SiteWiseChecklistResponse {
  success: number;
  message: string;
  response: SiteWiseChecklistData;
  info: string;
}

// Utility Functions
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getSelectedSiteId = () => {
  return localStorage.getItem("selectedSiteId") ; // Default to 2189 if not found
};
export const getCurrentSiteId = (): string => {
  // Try to get site_id from localStorage first
  const siteId = localStorage.getItem('selectedSiteId');
  if (siteId) return siteId;

  console.log("siteId default", siteId);

  // Fallback to URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('site_id'); // Default site_id
};

// Task Analytics API Functions
export const taskAnalyticsAPI = {
  getTechnicalChecklistData: async (fromDate: Date, toDate: Date): Promise<TechnicalChecklistResponse> => {
    const token = getToken();
    const siteId = getSelectedSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    
    
    const url = getFullUrl(`/pms/custom_forms/chart_technical_checklist_monthly.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${token}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch technical checklist data: ${response.status}`);
    }
    
    return response.json();
  },

  getNonTechnicalChecklistData: async (fromDate: Date, toDate: Date): Promise<NonTechnicalChecklistResponse> => {
    const token = getToken();
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = getFullUrl(`/pms/custom_forms/chart_non_technical_checklist_monthly.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${token}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch non-technical checklist data: ${response.status}`);
    }
    
    return response.json();
  },

  getTopTenChecklistData: async (fromDate: Date, toDate: Date): Promise<TopTenChecklistResponse> => {
    const token = getToken();
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = getFullUrl(`/pms/custom_forms/top_ten_checklist.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${token}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch top ten checklist data: ${response.status}`);
    }
    
    return response.json();
  },

  getSiteWiseChecklistData: async (fromDate: Date, toDate: Date): Promise<SiteWiseChecklistResponse> => {
    const token = getToken();
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = getFullUrl(`/pms/custom_forms/site_wise_checklist.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${token}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch site wise checklist data: ${response.status}`);
    }
    
    return response.json();
  },
};