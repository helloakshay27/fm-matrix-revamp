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
  site_id: number;
  company_id: number;
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
  complaint_status_fixed_state_eq?: string;
  complaint_status_name_eq?: string;
  complaint_status_fixed_state_not_eq?: string;
  complaint_status_fixed_state_null?: string;
  m?: string;
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
        usersArray: response.data.users,
        usersLength: response.data.users?.length || 0
      });
      
      const rawUsers = response.data.users || [];
      
      // Map the raw user data to UserOption format
      const users: UserOption[] = rawUsers.map((user: any) => ({
        id: user.id,
        name: user.full_name || user.email || `User ${user.id}`
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

  async getSupportStaffCategories(): Promise<{ id: number; name: string }[]> {
    try {
      console.log('🔍 Fetching Support Staff Categories from:', ENDPOINTS.SUPPORT_STAFF_CATEGORIES);
      const response = await apiClient.get(ENDPOINTS.SUPPORT_STAFF_CATEGORIES);
      console.log('✅ Support Staff Categories API Response:', {
        endpoint: ENDPOINTS.SUPPORT_STAFF_CATEGORIES,
        responseData: response.data,
        categoriesArray: response.data.support_staff_categories,
        categoriesLength: response.data.support_staff_categories?.length || 0
      });
      
      const rawCategories = response.data.support_staff_categories || response.data || [];
      
      // Map the raw category data to standard format
      const categories = rawCategories.map((category: any) => ({
        id: category.id,
        name: category.name || category.category_name || `Category ${category.id}`
      }));
      
      console.log('🔄 Mapped Support Staff Categories:', {
        originalCount: rawCategories.length,
        mappedCount: categories.length,
        sampleMappedCategories: categories.slice(0, 3)
      });
      
      if (categories.length === 0) {
        console.warn('⚠️ No support staff categories found in response');
      }
      
      return categories;
    } catch (error) {
      console.error('❌ Error fetching Support Staff Categories:', error);
      console.error('❌ Endpoint that failed:', ENDPOINTS.SUPPORT_STAFF_CATEGORIES);
      throw error;
    }
  },

  async getItemMovementTypes(): Promise<{ id: number; name: string }[]> {
    try {
      console.log('🔍 Fetching Item Movement Types from:', ENDPOINTS.ITEM_MOVEMENT_TYPES);
      const response = await apiClient.get(ENDPOINTS.ITEM_MOVEMENT_TYPES);
      console.log('✅ Item Movement Types API Response:', {
        endpoint: ENDPOINTS.ITEM_MOVEMENT_TYPES,
        responseData: response.data,
        typesArray: response.data.item_movement_types || response.data,
        typesLength: (response.data.item_movement_types || response.data)?.length || 0
      });
      
      const rawTypes = response.data.item_movement_types || response.data || [];
      
      // Map the raw type data to standard format
      const types = rawTypes.map((type: any) => ({
        id: type.id,
        name: type.name || type.movement_type || `Type ${type.id}`
      }));
      
      console.log('🔄 Mapped Item Movement Types:', {
        originalCount: rawTypes.length,
        mappedCount: types.length,
        sampleMappedTypes: types.slice(0, 3)
      });
      
      if (types.length === 0) {
        console.warn('⚠️ No item movement types found in response');
      }
      
      return types;
    } catch (error) {
      console.error('❌ Error fetching Item Movement Types:', error);
      console.error('❌ Endpoint that failed:', ENDPOINTS.ITEM_MOVEMENT_TYPES);
      throw error;
    }
  },

  async getItemTypes(): Promise<{ id: number; name: string }[]> {
    try {
      console.log('🔍 Fetching Item Types from:', ENDPOINTS.ITEM_TYPES);
      const response = await apiClient.get(ENDPOINTS.ITEM_TYPES);
      console.log('✅ Item Types API Response:', {
        endpoint: ENDPOINTS.ITEM_TYPES,
        responseData: response.data,
        itemsArray: response.data.item_movement || response.data.movement_types || response.data.item_types || response.data,
        itemsLength: (response.data.item_movement || response.data.movement_types || response.data.item_types || response.data)?.length || 0
      });
      
      const rawItems = response.data.item_movement || response.data.movement_types || response.data.item_types || response.data || [];
      
      // Map the raw item data to standard format
      const items = rawItems.map((item: any) => ({
        id: item.id,
        name: item.name || item.type || item.movement_type || `Item ${item.id}`
      }));
      
      console.log('🔄 Mapped Item Types:', {
        originalCount: rawItems.length,
        mappedCount: items.length,
        sampleMappedItems: items.slice(0, 3)
      });
      
      if (items.length === 0) {
        console.warn('⚠️ No item types found in response');
      }
      
      return items;
    } catch (error) {
      console.error('❌ Error fetching Item Types:', error);
      console.error('❌ Endpoint that failed:', ENDPOINTS.ITEM_TYPES);
      throw error;
    }
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

  async getEscalationUsers() {
    const response = await apiClient.get(ENDPOINTS.ESCALATION_USERS);
    return response.data;
  },

  async getBuildings() {
    const response = await apiClient.get(ENDPOINTS.BUILDINGS);
    return response.data;
  },

  async createSocietyGate(gateData: {
    gate_name: string;
    gate_device: string;
    resource_id: number;
    building_id: number;
    user_id: number;
    type: string;
  }) {
    const response = await apiClient.post(ENDPOINTS.SOCIETY_GATES, {
      society_gate: gateData
    });
    return response.data;
  },

  async getSocietyGates(page: number = 1, perPage: number = 20) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());
    
    const url = `${ENDPOINTS.SOCIETY_GATES}?${queryParams.toString()}`;
    const response = await apiClient.get(url);
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

  async deleteSubCategory(subCategoryId: string) {
    const response = await apiClient.post('/pms/admin/modify_helpdesk_sub_category.json', {
      id: subCategoryId,
      active: "0"
    });
    return response.data;
  },

  async updateSubCategory(subCategoryId: string | number, formData: FormData) {
    // Add the ID to the FormData
    formData.append('id', subCategoryId.toString());
    formData.append('active', '1');
    
    const response = await apiClient.post('/pms/admin/modify_helpdesk_sub_category.json', formData);
    return response.data;
  },

  async deleteComplaintMode(complaintModeId: number) {
    const response = await apiClient.post('/pms/admin/delete_complaint_mode.json', {
      id: complaintModeId
    });
    return response.data;
  },

  async getEngineers() {
    const response = await apiClient.get('/pms/users/get_escalate_to_users.json');
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
        helpdesk_operations_attributes: data.map(day => {
          const attributes: any = {
            op_of: "Pms::Site",
            op_of_id: siteId,
            dayofweek: day.dayofweek,
            of_phase: "pms",
            is_open: day.is_open ? "1" : "0",
            start_hour: day.start_hour.toString(),
            start_min: day.start_min.toString().padStart(2, '0'),
            end_hour: day.end_hour.toString(),
            end_min: day.end_min.toString().padStart(2, '0')
          };
          
          // Only include id for existing records (id > 0)
          if (day.id > 0) {
            attributes.id = day.id.toString();
          }
          
          return attributes;
        })
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

  // Create visitor
  async createVisitor(visitorData: {
    visitorType: string;
    frequency: string;
    visitorVisit?: string;
    host?: string;
    tower?: string;
    visitPurpose?: string;
    supportCategory?: string;
    passNumber: string;
    vehicleNumber: string;
    visitorName: string;
    mobileNumber: string;
    visitorComingFrom: string;
    remarks: string;
    expected_at?: string;
    skipHostApproval: boolean;
    goodsInwards: boolean;
    passValidFrom?: string;
    passValidTo?: string;
    daysPermitted?: { [key: string]: boolean };
    capturedPhoto?: string;
    additionalVisitors?: Array<{ name: string; mobile: string }>;
    goodsData?: {
      selectType: string;
      category: string;
      modeOfTransport: string;
      lrNumber: string;
      tripId: string;
    };
    items?: Array<{
      selectItem: string;
      uicInvoiceNo: string;
      quantity: string;
    }>;
  }) {
    try {
      console.log('🔍 Creating visitor with data:', visitorData);
      
      // Get current user account to fetch site_id
      let currentUserSiteId = '7'; // Default fallback value
      try {
        console.log('📡 Fetching current user account details for site_id...');
        const userAccount = await this.getUserAccount();
        currentUserSiteId = userAccount.site_id.toString();
        console.log('✅ Got user site_id:', currentUserSiteId);
      } catch (accountError) {
        console.warn('⚠️ Failed to fetch user account, using default site_id:', accountError);
      }
      
      const formData = new FormData();
      
      // Static fields
      formData.append('gatekeeper[created_by]', 'Gatekeeper');
      formData.append('gatekeeper[IsDelete]', '0');
      formData.append('gatekeeper[approve]', '0');
      formData.append('gatekeeper[parent_gk_id]', '');
      
      // Dynamic fields based on visitor type
      if (visitorData.visitorType === 'support') {
        formData.append('gatekeeper[guest_type]', 'Support Staff');
        if (visitorData.supportCategory) {
          formData.append('gatekeeper[support_staff_id]', visitorData.supportCategory);
        }
        formData.append('gatekeeper[support_staff_estimated_time]', '0');
      } else {
        formData.append('gatekeeper[guest_type]', 'Guest');
        formData.append('gatekeeper[support_staff_id]', '');
        formData.append('gatekeeper[support_staff_estimated_time]', '0');
      }
      
      // Host and building
      if (visitorData.host) {
        formData.append('gatekeeper[person_to_meet_id]', visitorData.host);
      }
      if (visitorData.tower) {
        formData.append('gatekeeper[building_id]', visitorData.tower);
      }
      
      // Basic visitor details
      formData.append('gatekeeper[guest_name]', visitorData.visitorName);
      if (visitorData.visitPurpose) {
        formData.append('gatekeeper[visit_purpose]', visitorData.visitPurpose);
      }
      formData.append('gatekeeper[guest_number]', visitorData.mobileNumber);
      formData.append('gatekeeper[pass_number]', visitorData.passNumber || 'FILTERED');
      formData.append('gatekeeper[guest_from]', visitorData.visitorComingFrom);
      formData.append('gatekeeper[guest_vehicle_number]', visitorData.vehicleNumber || 'FILTERED');
      formData.append('gatekeeper[remarks]', visitorData.remarks);
      
      // Expected at - only include for expected visitors
      if (visitorData.expected_at) {
        // Convert datetime-local format (YYYY-MM-DDTHH:MM) to the backend expected format
        const expectedAtDate = new Date(visitorData.expected_at);
        const formattedExpectedAt = `${expectedAtDate.getDate().toString().padStart(2, '0')}/${(expectedAtDate.getMonth() + 1).toString().padStart(2, '0')}/${expectedAtDate.getFullYear()} ${expectedAtDate.getHours().toString().padStart(2, '0')}:${expectedAtDate.getMinutes().toString().padStart(2, '0')}`;
        formData.append('gatekeeper[expected_at]', formattedExpectedAt);
        console.log('📅 Expected at field added:', formattedExpectedAt);
      } else {
        console.log('📅 No expected_at field - likely unexpected visitor');
      }
      
      // Frequency and dates
      if (visitorData.frequency === 'frequently') {
        if (visitorData.passValidFrom) {
          // Convert date from YYYY-MM-DD to DD/MM/YYYY format
          const fromDate = new Date(visitorData.passValidFrom);
          const formattedFromDate = `${fromDate.getDate().toString().padStart(2, '0')}/${(fromDate.getMonth() + 1).toString().padStart(2, '0')}/${fromDate.getFullYear()}`;
          formData.append('gatekeeper[pass_start_date]', formattedFromDate);
        }
        if (visitorData.passValidTo) {
          // Convert date from YYYY-MM-DD to DD/MM/YYYY format
          const toDate = new Date(visitorData.passValidTo);
          const formattedToDate = `${toDate.getDate().toString().padStart(2, '0')}/${(toDate.getMonth() + 1).toString().padStart(2, '0')}/${toDate.getFullYear()}`;
          formData.append('gatekeeper[pass_end_date]', formattedToDate);
        }
        
        // Days permitted (0=Sunday, 1=Monday, ..., 6=Saturday)
        if (visitorData.daysPermitted) {
          const dayMapping = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
          Object.entries(visitorData.daysPermitted).forEach(([day, isSelected]) => {
            if (isSelected && dayMapping[day as keyof typeof dayMapping] !== undefined) {
              formData.append('gatekeeper[pass_days][]', dayMapping[day as keyof typeof dayMapping].toString());
            }
          });
        }
      } else {
        formData.append('gatekeeper[pass_start_date]', '');
        formData.append('gatekeeper[pass_end_date]', '');
      }
      
      formData.append('gatekeeper[mimo_type]', 'move_in');
      formData.append('value', visitorData.frequency === 'frequently' ? 'Frequently' : 'Once');
      formData.append('skip_approval', visitorData.skipHostApproval.toString());
      
      // Additional visitors
      if (visitorData.additionalVisitors && visitorData.additionalVisitors.length > 0) {
        visitorData.additionalVisitors.forEach((visitor, index) => {
          if (visitor.name && visitor.mobile) {
            const timestamp = Date.now() + index;
            formData.append(`gatekeeper[additional_visitors_attributes][${timestamp}][name]`, visitor.name);
            formData.append(`gatekeeper[additional_visitors_attributes][${timestamp}][mobile]`, visitor.mobile);
            formData.append(`gatekeeper[additional_visitors_attributes][${timestamp}][_destroy]`, 'false');
          }
        });
      }
      
      // Goods/Items (if goods inwards is enabled)
      if (visitorData.goodsInwards && visitorData.goodsData && visitorData.items) {
        const timestamp = Date.now();
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][_destroy]`, 'false');
        // Pass the selected type ID from the dropdown
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_movement_type_id]`, visitorData.goodsData.selectType || '');
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][resource_type]`, 'Pms::Site');
        // Use the current user's site_id
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][resource_id]`, currentUserSiteId);
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_of_type]`, 'User');
        if (visitorData.host) {
          formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_of_id]`, visitorData.host);
        }
        
        // Transport mode mapping
        const transportMapping: { [key: string]: string } = {
          truck: 'By Truck',
          van: 'By Van',
          bike: 'By Bike',
          hand: 'By Hand',
          courier: 'By Courier'
        };
        const mappedTransport = transportMapping[visitorData.goodsData.modeOfTransport] || 'By Hand';
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][mode_of_transport]`, mappedTransport);
        
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][lr_number]`, visitorData.goodsData.lrNumber || 'FILTERED');
        formData.append(`gatekeeper[item_movements_attributes][${timestamp}][trip_id]`, visitorData.goodsData.tripId);
        
        // Add items
        visitorData.items.forEach((item, itemIndex) => {
          if (item.selectItem && item.quantity) {
            const itemTimestamp = Date.now() + itemIndex;
            formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_details_attributes][${itemTimestamp}][item_movement_id]`, item.selectItem);
            formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_details_attributes][${itemTimestamp}][number]`, item.uicInvoiceNo || 'FILTERED');
            formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_details_attributes][${itemTimestamp}][quantity]`, item.quantity);
            formData.append(`gatekeeper[item_movements_attributes][${timestamp}][item_details_attributes][${itemTimestamp}][_destroy]`, 'false');
          }
        });
        
        // Pass the selected item movement type ID instead of hardcoded value
        formData.append('item_movement_type_id', visitorData.goodsData.selectType || '1');
      }
      
      // Add photo if captured
      if (visitorData.capturedPhoto) {
        try {
          console.log('📷 Processing captured photo for upload...');
          // Convert base64 to blob
          const base64Response = await fetch(visitorData.capturedPhoto);
          const blob = await base64Response.blob();
          formData.append('gatekeeper[image]', blob, 'visitor_photo.jpg');
          console.log('✅ Photo successfully added to form data');
        } catch (photoError) {
          console.error('❌ Error processing photo:', photoError);
          // Continue without photo if there's an error
        }
      } else {
        console.log('⚠️ No photo captured - skipping image upload');
      }
      
      console.log('🚀 Sending visitor creation request to:', ENDPOINTS.CREATE_VISITOR);
      
      const response = await apiClient.post(ENDPOINTS.CREATE_VISITOR, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('✅ Visitor created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating visitor:', error);
      throw error;
    }
  },

  // Get society gate by ID
  async getSocietyGateById(gateId: string) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.SOCIETY_GATE_BY_ID}/${gateId}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching society gate by ID:', error);
      throw error;
    }
  },

  // Update society gate by ID
  async updateSocietyGate(gateId: string, gateData: {
    gate_name: string;
    gate_device: string;
    resource_id: number;
    building_id?: number;
    user_id?: number;
  }) {
    try {
      const payload = {
        society_gate: gateData
      };
      
      const response = await apiClient.put(`${ENDPOINTS.UPDATE_SOCIETY_GATE}/${gateId}.json`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating society gate:', error);
      throw error;
    }
  },

  // Get recent surveys
  async getRecentSurveys() {
    try {
      const response = await apiClient.get(ENDPOINTS.RECENT_SURVEYS);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent surveys:', error);
      throw error;
    }
  },

  // Fetch tickets by task occurrence ID
  async getTicketsByTaskOccurrenceId(taskOccurrenceId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/pms/admin/complaints.json?q[pms_asset_task_occurrence_id_eq]=${taskOccurrenceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets by task occurrence ID:', error);
      throw error;
    }
  },
};
