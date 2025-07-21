import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

// Category Types
export interface CategoryFormData {
  name: string;
  tat: string;
  customer_enabled: boolean;
  society_id: string;
  icon?: File;
  complaint_faqs_attributes: Array<{
    question: string;
    answer: string;
    _destroy: boolean;
  }>;
}

export interface CategoryEmailData {
  email: string[];
}

export interface CategoryResponse {
  id: number;
  society_id: number;
  name: string;
  position: number | null;
  created_at: string;
  updated_at: string;
  icon_url: string;
  doc_type: string | null;
  selected_icon_url: string;
}

// Subcategory Types
export interface SubCategoryFormData {
  helpdesk_category_id: number;
  customer_enabled: boolean;
  icon?: File;
  sub_category_tags: string[];
  location_enabled: {
    building?: boolean;
    wing?: boolean;
    zone?: boolean;
    floor?: boolean;
    room?: boolean;
  };
  location_data: {
    building_ids?: number[];
    wing_ids?: number[];
    zone_ids?: number[];
    floor_ids?: number[];
    room_ids?: number[];
  };
  complaint_worker: {
    assign_to: number[];
  };
}

export interface SubCategoryResponse {
  id: number;
  name: string;
  helpdesk_category_id: number;
  customer_enabled: boolean;
  icon_url?: string;
}

// Status Types
export interface StatusFormData {
  name: string;
  fixed_state: string;
  color_code: string;
  position: number;
  of_phase: string;
  society_id: string;
}

// Operational Days Types
export interface OperationalDay {
  id: number;
  dayofweek: string;
  start_hour: number;
  start_min: number;
  end_hour: number;
  end_min: number;
  is_open: boolean;
  active: boolean;
}

// Complaint Mode Types
export interface ComplaintModeFormData {
  name: string;
  of_phase: string;
  society_id: string;
}

// Ticket Types
export interface TicketResponse {
  id: number;
  ticket_number: string;
  heading: string;
  category_type: string;
  sub_category_type: string;
  posted_by: string;
  assigned_to: string | null;
  issue_status: string;
  priority: string;
  site_name: string;
  created_at: string;
  issue_type: string;
  complaint_mode: string;
  service_or_asset: string | null;
  asset_task_occurrence_id: string | null;
  proactive_reactive: string | null;
  review_tracking_date: string | null;
  response_escalation: string;
  response_tat: number;
  response_time: string | null;
  escalation_response_name: string | null;
  resolution_escalation: string;
  resolution_tat: number | null;
  resolution_time: string | null;
  escalation_resolution_name: string | null;
}

export interface TicketListResponse {
  complaints: TicketResponse[];
  pagination?: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

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
  society_staff_type: string;
  assigned_to?: number;
  proactive_reactive: string;
  reference_number?: string;
  heading: string;
  complaint_mode_id: number;
  sub_category_id?: number;
  room_id: number;
  wing_id: number;
  area_id: number;
  floor_id: number;
  tower_id?: number;
}

export interface UserAccountResponse {
  firstname: string;
  lastname: string;
  department_name: string;
  email: string;
  mobile: string;
}

export interface OccupantUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  company: string;
  unit_id: number;
  department_id: number;
  country_code: string;
  designation?: string;
  lock_user_permission: {
    status: string;
    department_id?: number;
    designation?: string;
  };
}

// API Services
export const ticketManagementAPI = {
  // Categories
  async createCategory(data: CategoryFormData, emailData: CategoryEmailData) {
    const formData = new FormData();
    
    // Add category data
    formData.append('helpdesk_category[name]', data.name);
    formData.append('helpdesk_category[tat]', data.tat);
    formData.append('helpdesk_category[customer_enabled]', data.customer_enabled ? '1' : '0');
    formData.append('helpdesk_category[society_id]', data.society_id);
    formData.append('helpdesk_category[of_phase]', 'pms');
    
    if (data.icon) {
      formData.append('helpdesk_category[icon]', data.icon);
    }
    
    // Add FAQ data
    data.complaint_faqs_attributes.forEach((faq, index) => {
      formData.append(`helpdesk_category[complaint_faqs_attributes][${index}][question]`, faq.question);
      formData.append(`helpdesk_category[complaint_faqs_attributes][${index}][answer]`, faq.answer);
      formData.append(`helpdesk_category[complaint_faqs_attributes][${index}][_destroy]`, faq._destroy.toString());
    });
    
    // Add email data
    emailData.email.forEach((email, index) => {
      formData.append(`category_email[email][${index}]`, email);
    });
    
    const response = await apiClient.post('/pms/admin/helpdesk_categories.json', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getCategories() {
    const response = await apiClient.get('/pms/admin/helpdesk_categories.json');
    return response.data;
  },

  async getSites(userId: string) {
    const response = await apiClient.get(`/pms/sites/allowed_sites.json?user_id=${userId}`);
    return response.data;
  },

  // Tickets
  async getTickets(page: number = 1, perPage: number = 20): Promise<TicketListResponse> {
    const response = await apiClient.get(`/pms/admin/complaints.json?per_page=${perPage}&page=${page}`);
    return {
      complaints: response.data.complaints || [],
      pagination: response.data.pagination
    };
  },

  // New ticket creation method
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
    formData.append('complaint[complaint_mode_id]', ticketData.complaint_mode_id.toString());
    formData.append('complaint[room_id]', ticketData.room_id.toString());
    formData.append('complaint[wing_id]', ticketData.wing_id.toString());
    formData.append('complaint[area_id]', ticketData.area_id.toString());
    formData.append('complaint[floor_id]', ticketData.floor_id.toString());

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
    if (ticketData.tower_id) {
      formData.append('complaint[tower_id]', ticketData.tower_id.toString());
    }

    // Add attachments
    attachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    const response = await apiClient.post(ENDPOINTS.CREATE_TICKET, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get subcategories by category ID
  async getSubCategoriesByCategory(categoryId: number): Promise<SubCategoryResponse[]> {
    const response = await apiClient.get(`${ENDPOINTS.GET_SUBCATEGORIES}.json?category_type_id=${categoryId}`);
    return response.data.sub_categories || [];
  },

  // Get current user account details
  async getUserAccount(): Promise<UserAccountResponse> {
    const response = await apiClient.get(ENDPOINTS.ACCOUNT_DETAILS);
    return response.data;
  },

  // Get occupant users
  async getOccupantUsers(): Promise<OccupantUserResponse[]> {
    const response = await apiClient.get(ENDPOINTS.OCCUPANT_USERS);
    return response.data.occupant_users || [];
  },

  // Subcategories
  async createSubCategory(data: SubCategoryFormData) {
    const formData = new FormData();
    
    formData.append('helpdesk_sub_category[helpdesk_category_id]', data.helpdesk_category_id.toString());
    formData.append('helpdesk_sub_category[customer_enabled]', data.customer_enabled ? '1' : '0');
    
    if (data.icon) {
      formData.append('helpdesk_sub_category[icon]', data.icon);
    }
    
    // Add tags
    data.sub_category_tags.forEach((tag, index) => {
      formData.append(`sub_category_tags[${index}]`, tag);
    });
    
    // Add location enabled flags
    Object.entries(data.location_enabled).forEach(([key, value]) => {
      formData.append(`location_enabled[${key}]`, value ? 'true' : 'false');
    });
    
    // Add location data
    Object.entries(data.location_data).forEach(([key, ids]) => {
      if (ids && ids.length > 0) {
        ids.forEach((id, index) => {
          formData.append(`location_data[${key}][${index}]`, id.toString());
        });
      }
    });
    
    // Add engineer assignments
    data.complaint_worker.assign_to.forEach((id, index) => {
      formData.append(`complaint_worker[assign_to][${index}]`, id.toString());
    });
    
    const response = await apiClient.post('/pms/admin/create_helpdesk_sub_category.json', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getSubCategories() {
    const response = await apiClient.get('/pms/admin/get_all_helpdesk_sub_categories.json');
    return response.data;
  },

  async getEngineers() {
    const response = await apiClient.get('/pms/account_setups/fm_users.json');
    return response.data;
  },

  async getBuildings() {
    const response = await apiClient.get('/buildings.json');
    return response.data;
  },

  async getWings() {
    const response = await apiClient.get('/pms/wings.json');
    return response.data;
  },

  async getZones() {
    const response = await apiClient.get('/pms/zones.json');
    return response.data;
  },

  async getFloors() {
    const response = await apiClient.get('/pms/floors.json');
    return response.data;
  },

  async getRooms() {
    const response = await apiClient.get('/pms/rooms.json');
    return response.data;
  },

  // Status
  async createStatus(data: StatusFormData) {
    const response = await apiClient.post('/pms/admin/create_complaint_statuses.json', {
      complaint_status: data
    });
    return response.data;
  },

  async getStatuses() {
    const response = await apiClient.get('/pms/admin/complaint_statuses.json');
    return response.data;
  },

  // Operational Days
  async getOperationalDays() {
    const response = await apiClient.get('/helpdesk_operations.json');
    return response.data;
  },

  async updateOperationalDays(siteId: string, data: OperationalDay[]) {
    const response = await apiClient.patch(`/pms/sites/${siteId}.json`, {
      pms_site: {
        helpdesk_operations_attributes: data.map(day => ({
          id: day.id.toString(),
          op_of: "Pms::Site",
          op_of_id: siteId,
          dayofweek: day.dayofweek,
          of_phase: "pms",
          is_open: day.is_open ? "1" : "0",
          start_hour: day.start_hour.toString(),
          start_min: day.start_min.toString().padStart(2, '0'),
          end_hour: day.end_hour.toString(),
          end_min: day.end_min.toString().padStart(2, '0')
        }))
      },
      id: siteId
    });
    return response.data;
  },

  async downloadSampleFile() {
    const response = await apiClient.get('/assets/operational_import.xlsx', {
      responseType: 'blob'
    });
    return response.data;
  },

  async uploadOperationalFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/helpdesk_operations/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Complaint Modes
  async createComplaintMode(data: ComplaintModeFormData) {
    const response = await apiClient.post('/pms/admin/create_complaint_modes.json', {
      complaint_mode: data
    });
    return response.data;
  },

  async getComplaintModes() {
    const response = await apiClient.get('/pms/admin/complaint_modes.json');
    return response.data;
  },

  // New methods for ticket actions
  async markAsGoldenTicket(ticketIds: number[]) {
    const idsParam = ticketIds.join(',');
    const response = await apiClient.post(`/pms/admin/complaints/mark_as_golden_ticket.json?ids=[${idsParam}]`);
    return response.data;
  },

  async markAsFlagged(ticketIds: number[]) {
    const idsParam = ticketIds.join(',');
    const response = await apiClient.post(`/pms/admin/complaints/mark_as_flagged.json?ids=[${idsParam}]`);
    return response.data;
  },
};
