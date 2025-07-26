import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

// Types for API responses
export interface TicketCategoryData {
  category: string;
  proactive: {
    Open: number;
    Closed: number;
  };
  reactive: {
    Open: number;
    Closed: number;
  };
}

export interface TicketStatusData {
  overall: {
    info: string;
    total_open: number;
    total_closed: number;
    total_wip: number;
  };
  proactive_reactive: {
    info: string;
    proactive: {
      open: number;
      closed: number;
    };
    reactive: {
      open: number;
      closed: number;
    };
  };
}

export interface TicketAgingMatrix {
  success: number;
  message: string;
  response: {
    matrix: {
      [priority: string]: {
        [timeRange: string]: number;
      };
    };
  };
  average_days: number;
  info: string;
}

export interface RecentTicket {
  id: number;
  id_user: number;
  ticket_number: string;
  priority: string;
  heading: string;
  text: string | null;
  active: boolean | null;
  action: boolean;
  IsDelete: boolean | null;
  created_at: string;
  updated_at: string;
  is_urgent: boolean | null;
  dept_id: number;
  unit_id: number | null;
  site_id: number;
  issue_type: string;
  issue_status: string;
  color_code: string;
  complaint_status_id: number;
  is_golden_ticket: boolean;
  is_flagged: boolean;
  priority_status: string;
  effective_priority: string;
  golden_ticket_priority_level: string;
  flagged_severity: string;
  golden_ticket_reason: string;
  flagged_reason: string;
  category_type: string;
  sub_category_type: string;
  department_name: string;
  unit_name: string;
  building_name: string;
  floor_name: string | null;
  site_name: string;
  pms_site_name: string;
  updated_by: string;
  posted_by: string;
  assigned_to: string | null;
  ticked_raised_for_booked_facility: string;
  complaint_mode: string;
  complaint_type: string;
  reference_number: string | null;
  proactive_reactive: string | null;
  review_tracking_date: string | null;
  status: {
    name: string;
    color_code: string;
  };
  service_or_asset: string | null;
  asset_or_service_name: string | null;
  schedule_type: string | null;
  asset_task_occurrence_id: string | null;
  response_escalation: string;
  response_tat: number;
  response_time: string | null;
  escalation_response_name: string | null;
  resolution_escalation: string;
  resolution_tat: number | null;
  resolution_time: string | null;
  escalation_resolution_name: string | null;
  complaint_logs: any[];
  documents: any[];
  faqs: any[];
}

export interface RecentTicketsResponse {
  complaints: RecentTicket[];
}

export interface UnitCategorywiseData {
  success: number;
  message: string;
  response: {
    tickets_category: string[];
    open_tickets: number[];
    closed_tickets: number[];
    total_tickets: number[];
  };
  info: string;
}

export interface ResponseTATData {
  success: number;
  message: string;
  response: {
    resolution: {
      breached: number;
      achieved: number;
    };
    response: {
      breached: number;
      achieved: number;
    };
  };
  info: string;
}

export interface ResolutionTATReportData {
  success: number;
  message: string;
  response: {
    categories: string[];
    breached: number[];
    achieved: number[];
    total: number[];
    percentage_breached: number[];
    percentage_achieved: number[];
  };
  info: string;
}

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current site ID dynamically from localStorage or header
const getCurrentSiteId = (): string => {
  // First try to get from localStorage with different possible keys
  const siteId = localStorage.getItem('currentSiteId') || 
                localStorage.getItem('site_id') || 
                localStorage.getItem('siteId') ||
                localStorage.getItem('selectedSiteId');
  
  // If not found in localStorage, try to get from URL or other sources
  if (!siteId) {
    // Check if there's a site ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlSiteId = urlParams.get('site_id');
    if (urlSiteId) return urlSiteId;
    
    // Default fallback
    console.warn('Site ID not found in localStorage or URL, using default: 7');
    return '7';
  }
  
  return siteId;
};

export const ticketAnalyticsAPI = {
  // Get tickets categorywise proactive/reactive data
  async getTicketsCategorywiseData(fromDate: Date, toDate: Date): Promise<TicketCategoryData[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/admin/complaints/tickets_categorywise_proactive_reactive.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data.tickets || [];
  },

  // Get ticket status data
  async getTicketStatusData(fromDate: Date, toDate: Date): Promise<TicketStatusData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/admin/complaints/ticket_status.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get ticket aging matrix data
  async getTicketAgingMatrix(fromDate: Date, toDate: Date): Promise<TicketAgingMatrix> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/admin/complaints/ticket_ageing_matrix.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get recent tickets
  async getRecentTickets(): Promise<RecentTicketsResponse> {
    const url = `/pms/admin/complaints/recent_tickets`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get unit categorywise data
  async getUnitCategorywiseData(fromDate: Date, toDate: Date): Promise<UnitCategorywiseData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/admin/complaints/chart_unit_categorywise.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get response TAT data
  async getResponseTATData(fromDate: Date, toDate: Date): Promise<ResponseTATData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/admin/complaints/chart_response_tat.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get resolution TAT report data
  async getResolutionTATReportData(fromDate: Date, toDate: Date): Promise<ResolutionTATReportData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/admin/complaints/chart_resolution_tat_report.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  }
};