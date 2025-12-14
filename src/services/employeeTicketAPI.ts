import { apiClient } from '@/utils/apiClient';
import { getUser } from '@/utils/auth';

// New types for ticket creation
export interface CreateTicketFormData {
  of_phase: string;
  site_id: number;
  id_user?: number;
  sel_id_user?: number;
  on_behalf_of: string;
  complaint_type: string;
  category_type_id: number;
  priority: string;
  severity?: string;
  society_staff_type: string;
  assigned_to?: number;
  proactive_reactive: string;
  reference_number?: string;
  heading: string;
  complaint_mode: string;
  sub_category_id?: number;
  area_id?: number;
  tower_id?: number;
  wing_id?: number;
  floor_id?: number;
  room_id?: number;
  is_golden_ticket?: boolean;
  is_flagged?: boolean;
  supplier_id?: number;
}

// Employee Ticket Types - Based on /pms/complaints.json response
export interface ComplaintLog {
  id: number;
  complaint_id: number;
  complaint_status_id: number;
  changed_by: number | null;
  priority: string;
  created_at: string;
  updated_at: string;
  log_comment: string;
  log_status: string;
  log_by: string;
  documents: any[];
}

export interface EmployeeTicketResponse {
  id: number;
  id_user: number;
  ticket_number: string;
  heading: string;
  text: string | null;
  active: string | null;
  action: string | null;
  IsDelete: string | null;
  created_at: string;
  updated_at: string;
  is_urgent: string | null;
  dept_id: number;
  unit_id: number | null;
  site_id: number;
  relation: string | null;
  relation_id: number | null;
  proactive_reactive: string | null;
  issue_type: string;
  issue_status: string;
  color_code: string;
  category_type: string;
  department_name: string;
  unit_name: string;
  site_name: string;
  updated_by: string;
  sub_category_type: string;
  building_name: string;
  floor_name: string;
  posted_by: string;
  assigned_to: string | null;
  response_escalation: string;
  response_tat: number;
  priority: string;
  response_time: string | null;
  escalation_response_name: string | null;
  resolution_escalation: string;
  resolution_tat: number;
  resolution_time?: string | null;
  escalation_resolution_name?: string | null;
  ticket_urgency: string;
  on_behalf_of: string;
  internal_comments: any[];
  complaint_logs: ComplaintLog[];
  doc_attached: boolean;
  documents: any[];
  complaint_status_id?: number;
  is_golden_ticket?: boolean;
  is_flagged?: boolean;
  complaint_mode?: string;
  review_tracking_date?: string | null;
}

export interface EmployeeTicketListResponse {
  complaints: EmployeeTicketResponse[];
  pagination?: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface EmployeeTicketFilters {
  date_range?: string;
  category_type_id_eq?: number;
  sub_category_id_eq?: number;
  dept_id_eq?: number;
  site_id_eq?: number;
  unit_id_eq?: number;
  complaint_status_fixed_state_eq?: string;
  complaint_status_fixed_state_not_eq?: string;
  complaint_status_fixed_state_null?: string;
  priority_eq?: string;
  proactive_reactive_eq?: string;
  issue_type_eq?: string;
  complaint_mode_id_eq?: number;
  assigned_to_eq?: number;
  posted_by_eq?: number;
  search_all_fields_cont?: string;
  m?: string;
  g?: Array<{
    m?: string;
    complaint_status_fixed_state_not_eq?: string;
    complaint_status_fixed_state_null?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

// Helper function to format dates for API
const formatDateForAPI = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

class EmployeeTicketAPI {
  // Get tickets for employee dashboard - uses /pms/complaints.json
  async getTickets(page: number = 1, perPage: number = 20, filters?: EmployeeTicketFilters): Promise<EmployeeTicketListResponse> {
    const queryParams = new URLSearchParams();
    
    // Add pagination
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());
    
    // Get current user and add id_user_eq filter
    const currentUser = getUser();
    if (currentUser?.id) {
      queryParams.append('q[id_user_eq]', currentUser.id.toString());
    }
    
    console.log('🔵 Employee API getTickets called with filters:', filters);
    console.log('🔵 Employee API Current user ID:', currentUser?.id);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle nested group structure for open tickets
          if (key === 'g' && Array.isArray(value)) {
            value.forEach((group, index) => {
              Object.entries(group).forEach(([groupKey, groupValue]) => {
                if (groupValue !== undefined && groupValue !== null && groupValue !== '') {
                  queryParams.append(`q[g][${index}][${groupKey}]`, groupValue.toString());
                }
              });
            });
          } else if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(`q[${key}][]`, v.toString()));
          } else if (key === 'date_range' && typeof value === 'string' && value.includes('+-+')) {
            // Handle date range - convert from ISO to DD/MM/YYYY format
            const [fromDate, toDate] = value.split('+-+');
            const formattedFromDate = formatDateForAPI(fromDate);
            const formattedToDate = formatDateForAPI(toDate);
            if (formattedFromDate && formattedToDate) {
              queryParams.append(`q[${key}]`, `${formattedFromDate}+-+${formattedToDate}`);
            }
          } else {
            queryParams.append(`q[${key}]`, value.toString());
          }
        }
      });
    }

    const url = `/pms/complaints.json?${queryParams.toString()}`;
    console.log('🔵 Employee API Final URL:', url);
    console.log('🔵 Query parameters object:', Object.fromEntries(queryParams.entries()));
    
    const response = await apiClient.get(url);
    return {
      complaints: response.data.complaints || [],
      pagination: response.data.pagination
    };
  }

  // Get ticket summary for employee dashboard
  async getTicketSummary(filters?: EmployeeTicketFilters): Promise<{
    total_tickets: number;
    open_tickets: number;
    in_progress_tickets: number;
    closed_tickets: number;
    complaints: number;
    suggestions: number;
    requests: number;
    pending_tickets: number;
  }> {
    const queryParams = new URLSearchParams();
    
    // Get current user and add id_user_eq filter
    const currentUser = getUser();
    if (currentUser?.id) {
      queryParams.append('q[id_user_eq]', currentUser.id.toString());
    }
    
    console.log('🔵 Employee API getTicketSummary called with filters:', filters);
    console.log('🔵 Employee API Current user ID:', currentUser?.id);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(`q[${key}][]`, v.toString()));
          } else if (key === 'date_range' && typeof value === 'string') {
            // Handle date range format
            if (value.includes(' - ')) {
              // Format: "DD/MM/YYYY - DD/MM/YYYY"
              queryParams.append(`q[${key}]`, value);
            } else if (value.includes('+-+')) {
              // Convert from ISO to DD/MM/YYYY format
              const [fromDate, toDate] = value.split('+-+');
              const formattedFromDate = formatDateForAPI(fromDate);
              const formattedToDate = formatDateForAPI(toDate);
              if (formattedFromDate && formattedToDate) {
                queryParams.append(`q[${key}]`, `${formattedFromDate}+-+${formattedToDate}`);
              }
            }
          } else {
            queryParams.append(`q[${key}]`, value.toString());
          }
        }
      });
    }

    const url = `/pms/admin/ticket_summary.json?${queryParams.toString()}`;
    console.log('🔵 Employee API Final summary URL:', url);
    
    const response = await apiClient.get(url);
    return response.data;
  }

  // Mark tickets as golden ticket
  async markAsGoldenTicket(ticketIds: number[]): Promise<{ message: string }> {
    const response = await apiClient.post('/pms/complaints/mark_as_golden_ticket.json', {
      complaint_ids: ticketIds
    });
    return response.data;
  }

  // Mark tickets as flagged
  async markAsFlagged(ticketIds: number[]): Promise<{ message: string }> {
    const response = await apiClient.post('/pms/complaints/mark_as_flagged.json', {
      complaint_ids: ticketIds
    });
    return response.data;
  }

  // Export tickets to Excel
  async exportTicketsExcel(filters?: EmployeeTicketFilters): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'g' && Array.isArray(value)) {
            value.forEach((group, index) => {
              Object.entries(group).forEach(([groupKey, groupValue]) => {
                if (groupValue !== undefined && groupValue !== null && groupValue !== '') {
                  queryParams.append(`q[g][${index}][${groupKey}]`, groupValue.toString());
                }
              });
            });
          } else if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(`q[${key}][]`, v.toString()));
          } else {
            queryParams.append(`q[${key}]`, value.toString());
          }
        }
      });
    }

    const url = `/pms/complaints.xlsx?${queryParams.toString()}`;
    const response = await apiClient.get(url, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Get employee ticket details by ID
  async getTicketDetails(ticketId: string) {
    try {
      const response = await apiClient.get(`/pms/complaints/${ticketId}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee ticket details:', error);
      throw error;
    }
  }

  // Get response TAT timings for an employee ticket by ID
  async getResponseTatTimings(ticketId: string) {
    try {
      const response = await apiClient.get(`/response_tat_timings?id=${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching response TAT timings:', error);
      throw error;
    }
  }

  // Get resolution TAT timings for an employee ticket by ID
  async getResolutionTatTimings(ticketId: string) {
    try {
      const response = await apiClient.get(`/resolution_tat_timings?id=${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resolution TAT timings:', error);
      throw error;
    }
  }

  // Get employee ticket feeds by ID
  async getTicketFeeds(ticketId: string) {
    try {
      const response = await apiClient.get(`/pms/complaints/${ticketId}/feeds.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee ticket feeds:', error);
      throw error;
    }
  }

  // Create new ticket
  async createTicket(ticketData: CreateTicketFormData, attachments: File[] = []) {
    const formData = new FormData();
    
    // Add all ticket data with complaint[] prefix
    formData.append('complaint[of_phase]', ticketData.of_phase);
    formData.append('complaint[site_id]', ticketData.site_id.toString());
    formData.append('complaint[on_behalf_of]', ticketData.on_behalf_of);
    formData.append('complaint[complaint_type]', ticketData.complaint_type);
    formData.append('complaint[category_type_id]', ticketData.category_type_id.toString());
    formData.append('complaint[priority]', ticketData.priority);
    formData.append('complaint[society_staff_type]', ticketData.society_staff_type);
    formData.append('complaint[proactive_reactive]', ticketData.proactive_reactive);
    formData.append('complaint[heading]', ticketData.heading);
    formData.append('complaint[complaint_mode]', ticketData.complaint_mode);
    
    // Add severity if provided
    if (ticketData.severity) {
      formData.append('complaint[severity]', ticketData.severity);
    }

    // Optional fields
    if (ticketData.id_user) {
      formData.append('complaint[id_user]', ticketData.id_user.toString());
    }
    if (ticketData.sel_id_user) {
      formData.append('complaint[sel_id_user]', ticketData.sel_id_user.toString());
    }
    if (ticketData.assigned_to) {
      formData.append('complaint[assigned_to]', ticketData.assigned_to.toString());
    }
    if (ticketData.reference_number) {
      formData.append('complaint[reference_number]', ticketData.reference_number);
    }
    if (ticketData.sub_category_id) {
      formData.append('complaint[sub_category_id]', ticketData.sub_category_id.toString());
    }
    if (ticketData.supplier_id) {
      formData.append('complaint[supplier_id]', ticketData.supplier_id.toString());
    }
    
    // Add all location parameters
    if (ticketData.area_id) {
      formData.append('complaint[area_id]', ticketData.area_id.toString());
    }
    if (ticketData.tower_id) {
      formData.append('complaint[tower_id]', ticketData.tower_id.toString());
    }
    if (ticketData.wing_id) {
      formData.append('complaint[wing_id]', ticketData.wing_id.toString());
    }
    if (ticketData.floor_id) {
      formData.append('complaint[floor_id]', ticketData.floor_id.toString());
    }
    if (ticketData.room_id) {
      formData.append('complaint[room_id]', ticketData.room_id.toString());
    }

    // Add golden ticket and flagged parameters
    if (ticketData.is_golden_ticket !== undefined) {
      formData.append('complaint[is_golden_ticket]', ticketData.is_golden_ticket ? '1' : '0');
    }
    if (ticketData.is_flagged !== undefined) {
      formData.append('complaint[is_flagged]', ticketData.is_flagged ? '1' : '0');
    }

    // Add attachments
    attachments.forEach((file) => {
      formData.append('complaint[documents][]', file);
    });

    const response = await apiClient.post('/pms/admin/complaints.json', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}

export const employeeTicketAPI = new EmployeeTicketAPI();
