import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  unit: string;
  department: string;
  workType: string;
  staffId: string;
  vendorName: string;
  validFrom: string;
  validTill: string;
  status: string;
  resourceId?: string;
  resourceType?: string;
  departmentId?: string;
  typeId?: string;
  expiryType?: string;
  expiryValue?: string;
}

export interface ScheduleData {
  [key: string]: {
    checked: boolean;
    startTime: string;
    startMinute: string;
    endTime: string;
    endMinute: string;
  };
}

export interface StaffAttachments {
  profilePicture?: File;
  manuals?: File;
  documents?: File[];
}

export interface Unit {
  id: number;
  unit_name: string;
  active: boolean;
  building_id: number;
  building: {
    id: number;
    name: string;
    site_id: string;
    company_id: string;
    active: boolean;
  };
}

export interface Department {
  id: number;
  department_name: string;
  site_id: number;
  company_id: number;
  active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  site_name: string;
}

export interface DepartmentsResponse {
  departments: Department[];
}

export const staffService = {
  // Fetch units for dropdown
  getUnits: async (): Promise<Unit[]> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNITS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch units');
      }

      const units: Unit[] = await response.json();
      return units.filter(unit => unit.active); // Only return active units
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load units');
      return [];
    }
  },

  // Fetch departments for dropdown
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEPARTMENTS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }

      const data: DepartmentsResponse = await response.json();
      return data.departments.filter(dept => dept.active); // Only return active departments
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
      return [];
    }
  },

  createSocietyStaff: async (
    staffData: StaffFormData, 
    schedule: ScheduleData, 
    attachments: StaffAttachments = {}
  ) => {
    try {
      const formData = new FormData();

      // Basic staff information
      formData.append('society_staff[first_name]', staffData.firstName);
      formData.append('society_staff[last_name]', staffData.lastName);
      formData.append('society_staff[mobile]', staffData.mobile);
      formData.append('society_staff[email]', staffData.email);
      formData.append('society_staff[password]', staffData.password);
      
      // Resource and type information
      formData.append('society_staff[resource_id]', staffData.resourceId || '12');
      formData.append('society_staff[resource_type]', staffData.resourceType || staffData.workType || 'Guard');
      formData.append('society_staff[status]', staffData.status || 'active');
      formData.append('society_staff[department_id]', staffData.departmentId || '3');
      formData.append('society_staff[type_id]', staffData.typeId || '5');
      
      // Validity information
      formData.append('society_staff[valid_from]', staffData.validFrom);
      formData.append('society_staff[expiry_type]', staffData.expiryType || 'days');
      formData.append('society_staff[expiry_value]', staffData.expiryValue || '90');

      // Schedule operations for each day
      let operationIndex = 0;
      Object.entries(schedule).forEach(([day, dayData]) => {
        if (dayData.checked) {
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][op_of]`, 'Society');
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][op_of_id]`, '1');
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][dayofweek]`, 
            day.charAt(0).toUpperCase() + day.slice(1));
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][start_hour]`, 
            dayData.startTime.padStart(2, '0'));
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][start_min]`, 
            dayData.startMinute.padStart(2, '0'));
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][end_hour]`, 
            dayData.endTime.padStart(2, '0'));
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][end_min]`, 
            dayData.endMinute.padStart(2, '0'));
          formData.append(`society_staff[helpdesk_operations_attributes][${operationIndex}][is_open]`, 'true');
          operationIndex++;
        }
      });

      // File attachments
      if (attachments.profilePicture) {
        formData.append('staffimage', attachments.profilePicture);
      }
      
      if (attachments.manuals) {
        formData.append('society_staff[document]', attachments.manuals);
      }
      
      if (attachments.documents && attachments.documents.length > 0) {
        attachments.documents.forEach((doc, index) => {
          formData.append('attachments[]', doc);
        });
      }

      // Empty array for documents if none provided
      formData.append('society_staff[documents][]', '');

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_SOCIETY_STAFF}`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          // Don't set Content-Type for FormData, browser will set it automatically
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create society staff');
      }

      const result = await response.json();
      toast.success('Society staff created successfully!');
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create society staff';
      console.error('Error creating society staff:', error);
      toast.error(errorMessage);
      throw error;
    }
  },
};
