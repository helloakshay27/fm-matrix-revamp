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

// New interfaces for filter dropdown data
export interface CategoryOption {
  id: number;
  name: string;
}

export interface SubcategoryOption {
  id: number;
  name: string;
  category_id: number;
}

export interface DepartmentOption {
  id: number;
  department_name: string;
}

export interface SiteOption {
  id: number;
  name: string;
  site_name?: string; // Keep for backward compatibility
}

export interface UnitOption {
  id: number;
  unit_name: string;
}

export interface StatusOption {
  id: number;
  name: string;
}

export interface UserOption {
  id: number;
  name: string;
}

export interface SupplierOption {
  id: number;
  name: string;
  supplier_name?: string;
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
  complaint_status_id: number;
  is_golden_ticket?: boolean;
  is_flagged?: boolean;
  updated_at?: string;
  color_code?: string;
  priority_status?: string;
  effective_priority?: string;
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
  is_golden_ticket?: boolean;
  is_flagged?: boolean;
}

export interface UserAccountResponse {
  id: number;
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

// Interface for ticket filters
export interface TicketFilters {
  date_range?: string;
  category_type_id_eq?: number;
  sub_category_id_eq?: number;
  dept_id_eq?: number;
  site_id_eq?: number;
  unit_id_eq?: number;
  issue_status_in?: number[];
  issue_status_eq?: string;
  priority_eq?: string;
  user_firstname_or_user_lastname_cont?: string;
  search_all_fields_cont?: string;
  assigned_to_in?: number[];
  complaint_status_name_eq?: string;
}

// Helper function to format date for API (DD/MM/YYYY)
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// API Services
export const ticketManagementAPI = {
  // New methods for filter dropdown data
  async getHelpdeskCategories(): Promise<CategoryOption[]> {
    const response = await apiClient.get(ENDPOINTS.HELPDESK_CATEGORIES);
    return response.data.helpdesk_categories || [];
  },

  async getHelpdeskSubcategories(): Promise<SubcategoryOption[]> {
    const response = await apiClient.get(`${ENDPOINTS.HELPDESK_SUBCATEGORIES}.json`);
    return response.data.helpdesk_sub_categories || [];
  },

  async getDepartments(): Promise<DepartmentOption[]> {
    const response = await apiClient.get(ENDPOINTS.DEPARTMENTS);
    return response.data.departments || [];
  },

  async getAllSites(): Promise<SiteOption[]> {
    try {
      console.log('🏢 Fetching sites from:', ENDPOINTS.SITES);
      const response = await apiClient.get(ENDPOINTS.SITES);
      console.log('✅ Sites API Response:', {
        endpoint: ENDPOINTS.SITES,
        responseData: response.data,
        sitesArray: response.data.sites,
        sitesLength: response.data.sites?.length || 0,
        sampleSites: response.data.sites?.slice(0, 3)
      });
      
      const rawSites = response.data.sites || [];
      
      // Map the raw site data to SiteOption format
      const sites: SiteOption[] = rawSites.map((site: any) => ({
        id: site.id,
        name: site.name || site.site_name || `Site ${site.id}`,
        site_name: site.name || site.site_name // Keep for backward compatibility
      }));
      
      console.log('🔄 Mapped Sites:', {
        originalCount: rawSites.length,
        mappedCount: sites.length,
        sampleMappedSites: sites.slice(0, 3)
      });
      
      if (sites.length === 0) {
        console.warn('⚠️ No sites found in response');
      }
      
      return sites;
    } catch (error) {
      console.error('❌ Error fetching sites:', error);
      console.error('❌ Endpoint that failed:', ENDPOINTS.SITES);
      throw error;
    }
  },

  async getUnits(): Promise<UnitOption[]> {
    const response = await apiClient.get(ENDPOINTS.UNITS);
    return response.data || [];
  },

  async getComplaintStatuses(): Promise<StatusOption[]> {
    const response = await apiClient.get(ENDPOINTS.COMPLAINT_STATUSES);
    return response.data || [];
  },

  async getFMUsers(): Promise<UserOption[]> {
    try {
      console.log('🔍 Fetching FM Users from:', ENDPOINTS.FM_USERS);
      const response = await apiClient.get(ENDPOINTS.FM_USERS);
      console.log('✅ FM Users API Response:', {
        endpoint: ENDPOINTS.FM_USERS,
        responseData: response.data,
        fmUsersArray: response.data.fm_users,
        fmUsersLength: response.data.fm_users?.length || 0
      });
      
      const rawUsers = response.data.fm_users || [];
      
      // Map the raw user data to UserOption format
      const users: UserOption[] = rawUsers.map((user: any) => ({
        id: user.id,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || `User ${user.id}`
      }));
      
      console.log('🔄 Mapped FM Users:', {
        originalCount: rawUsers.length,
        mappedCount: users.length,
        sampleMappedUsers: users.slice(0, 3)
      });
      
      if (users.length === 0) {
        console.warn('⚠️ No FM users found in response');
      }
      
      return users;
    } catch (error) {
      console.error('❌ Error fetching FM Users:', error);
      console.error('❌ Endpoint that failed:', ENDPOINTS.FM_USERS);
      throw error;
    }
  },

  async getSuppliers(): Promise<SupplierOption[]> {
    const response = await apiClient.get('/pms/suppliers.json');
    return response.data.suppliers || response.data || [];
  },

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
    try {
      console.log('Fetching categories from:', '/pms/admin/helpdesk_categories.json');
      const response = await apiClient.get('/pms/admin/helpdesk_categories.json');
      console.log('Categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getSites(userId: string) {
    const response = await apiClient.get(`/pms/sites/allowed_sites.json?user_id=${userId}`);
    return response.data;
  },

  // Tickets
  async getTickets(page: number = 1, perPage: number = 20, filters?: TicketFilters): Promise<TicketListResponse> {
    const queryParams = new URLSearchParams();
    
    // Add pagination
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());
    
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
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

    const url = `/pms/admin/complaints.json?${queryParams.toString()}`;
    console.log('API URL:', url);
    console.log('Query parameters:', Object.fromEntries(queryParams.entries()));
    const response = await apiClient.get(url);
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

    // Add golden ticket and flagged parameters
    if (ticketData.is_golden_ticket !== undefined) {
      formData.append('complaint[is_golden_ticket]', ticketData.is_golden_ticket.toString());
    }
    if (ticketData.is_flagged !== undefined) {
      formData.append('complaint[is_flagged]', ticketData.is_flagged.toString());
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
    
    // Add tags - use array format as specified in API
    data.sub_category_tags.forEach((tag) => {
      formData.append('sub_category_tags[]', tag);
    });
    
    // Add location enabled flags
    Object.entries(data.location_enabled).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(`location_enabled[${key}]`, value ? 'true' : 'false');
      }
    });
    
    // Add location data - use array format as specified in API
    Object.entries(data.location_data).forEach(([key, ids]) => {
      if (ids && ids.length > 0) {
        ids.forEach((id) => {
          formData.append(`location_data[${key}][]`, id.toString());
        });
      }
    });
    
    // Add engineer assignments - use array format as specified in API
    data.complaint_worker.assign_to.forEach((id) => {
      formData.append('complaint_worker[assign_to][]', id.toString());
    });
    
    const response = await apiClient.post('/pms/admin/create_helpdesk_sub_category.json', formData);
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

  async getAllowedSites(userId: string) {
    const response = await apiClient.get(`/pms/sites/allowed_sites.json?user_id=${userId}`);
    return response.data;
  },

  async createBuilding(buildingData: any) {
    const response = await apiClient.post('/buildings.json', { building: buildingData });
    return response.data;
  },

  async updateBuilding(id: number, buildingData: any) {
    const response = await apiClient.put(`/buildings/${id}.json`, { building: buildingData });
    return response.data;
  },

  async getWings() {
    const response = await apiClient.get('/pms/wings.json');
    return response.data;
  },

  async createWing(wingData: { name: string; building_id: string; active: boolean }) {
    const response = await apiClient.post('/pms/wings.json', {
      pms_wing: wingData
    });
    return response.data;
  },

  async updateWing(wingId: number, wingData: { name: string; building_id: string; active: boolean }) {
    const response = await apiClient.put(`/pms/wings/${wingId}.json`, {
      pms_wing: wingData
    });
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

  // Update ticket
  async updateTicket(ticketId: number, updateData: {
    priority?: string;
    issue_status?: string;
    assigned_to?: string;
    comment?: string;
  }) {
    try {
      // Create URL-encoded data for the PATCH request (matching EditStatusDialog pattern)
      const params = new URLSearchParams();
      
      if (updateData.priority) {
        params.append('complaint[priority]', updateData.priority);
      }
      if (updateData.issue_status) {
        params.append('complaint[issue_status]', updateData.issue_status);
      }
      if (updateData.assigned_to) {
        params.append('complaint[assigned_to]', updateData.assigned_to);
      }
      if (updateData.comment) {
        params.append('complaint[comment]', updateData.comment);
      }

      const response = await apiClient.patch(`/pms/admin/complaints/${ticketId}.json`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Get ticket details by ID
  async getTicketDetails(ticketId: string) {
    try {
      const response = await apiClient.get(`/pms/admin/complaints/${ticketId}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error;
    }
  },

  // Get ticket feeds by ID
  async getTicketFeeds(ticketId: string) {
    try {
      const response = await apiClient.get(`/pms/admin/complaints/${ticketId}/feeds.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket feeds:', error);
      throw error;
    }
  },

  // Get ticket summary with optional filters
  async getTicketSummary(filters?: TicketFilters): Promise<{
    total_tickets: number;
    open_tickets: number;
    pending_tickets: number;
    in_progress_tickets: number;
    closed_tickets: number;
    complaints: number;
    suggestions: number;
    requests: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
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

    const url = `${ENDPOINTS.TICKETS_SUMMARY}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    // Ensure pending_tickets is included even if not returned by API
    const summary = {
      total_tickets: 0,
      open_tickets: 0,
      pending_tickets: 0,
      in_progress_tickets: 0,
      closed_tickets: 0,
      complaints: 0,
      suggestions: 0,
      requests: 0,
      ...response.data
    };
    
    return summary;
  },

  // Export tickets with filters in Excel format
  async exportTicketsExcel(filters?: TicketFilters): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
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

    const url = `${ENDPOINTS.TICKETS_EXPORT_EXCEL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Export tickets (legacy CSV method)
  async exportTickets(ticketIds: number[]) {
    // Implementation for CSV export if needed
    return null;
  },

  // Tag vendor to ticket
  async tagVendor(data: { ticket_id: string; vendor_id: number; comments?: string }) {
    const response = await apiClient.post(`/pms/admin/complaints/${data.ticket_id}/tag_vendor.json`, {
      vendor_id: data.vendor_id,
      comments: data.comments || '',
    });
    return response.data;
  },

  // Tag multiple vendors to complaint
  async tagVendorsToComplaint(data: { complaint_id: string; vendor_ids: string[] }) {
    const formData = new FormData();
    formData.append('complaint_id', data.complaint_id);
    
    // Add vendor IDs as array
    data.vendor_ids.forEach((vendorId) => {
      formData.append('vendor_ids[]', vendorId);
    });

    const response = await apiClient.post('/pms/admin/complaint_vendors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get complaint vendors
  async getComplaintVendors(complaintId: string) {
    const response = await apiClient.get(`/pms/admin/complaint_vendors.json?complaint_id=${complaintId}`);
    return response.data;
  },

  // Get create task data
  async getCreateTaskData(complaintId: string) {
    const response = await apiClient.get(`/pms/admin/complaints/${complaintId}/create_task.json`);
    return response.data;
  },
};
