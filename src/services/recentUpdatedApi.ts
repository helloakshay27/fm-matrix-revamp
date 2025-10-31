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
  return localStorage.getItem('selectedSiteId') 
    // new URLSearchParams(window.location.search).get('site_id') ;
};

export const recentUpdatedApi = {
  // Get tickets categorywise proactive/reactive data
  async getTicketsCategorywiseData(fromDate: Date, toDate: Date): Promise<TicketCategoryData[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/admin/complaints/tickets_categorywise_proactive_reactive.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;

    const response = await apiClient.get(url);
    return response.data.tickets || [];
  },

  // Get recent updates (activities)
  async getRecentUpdates(): Promise<any[]> {
    const siteId = getCurrentSiteId();
    const url = `/pms/admin/complaints/recent_updates.json?site_ids=${siteId}&access_token=${API_CONFIG.TOKEN}`;
    const response = await apiClient.get(url);
    return response.data.activities || [];
  }
};