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

export interface WorkType {
  id: number;
  staff_type: string;
  active: number;
  related_to: string | null;
  resource_id: number | null;
  resource_type: string;
}

export interface WorkTypesResponse {
  success: boolean;
  data: WorkType[];
}

export interface HelpdeskOperation {
  day: string;
  dayofweek: string;
  id: number | null;
  op_of: string | null;
  op_of_id: number | null;
  start_hour: string | null;
  start_min: string | null;
  end_hour: string | null;
  end_min: string | null;
  is_open: boolean | null;
  active: boolean | null;
  show_times: string | null;
}

export interface StaffWorking {
  // Add fields as needed based on staff_workings structure
  [key: string]: unknown;
}

export interface StaffDocument {
  // Add fields as needed based on documents structure
  [key: string]: unknown;
}

export interface SocietyStaffDetails {
  id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  soc_staff_id: string | null;
  vendor_name: string | null;
  active: boolean | null;
  staff_type: string | null;
  status: string;
  resource_id: number;
  resource_type: string;
  department_id: number;
  type_id: number;
  pms_unit_id: number | null;
  created_by: number;
  expiry_type: string;
  expiry_value: number;
  number_verified: boolean;
  otp: string | null;
  notes: string | null;
  valid_from: string;
  expiry: string | null;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  user_id: number;
  unit_name: string | null;
  department_name: string;
  work_type_name: string;
  status_text: string;
  staff_image_url: string;
  qr_code_present: boolean;
  qr_code_url: string | null;
  helpdesk_operations: HelpdeskOperation[];
  staff_workings: StaffWorking[];
  documents: StaffDocument[];
}

export interface SocietyStaffDetailsResponse {
  society_staff: SocietyStaffDetails;
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

  // Fetch work types for dropdown
  getWorkTypes: async (): Promise<WorkType[]> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SOCIETY_STAFF_TYPES}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch work types');
      }

      const responseData: WorkTypesResponse = await response.json();
      
      if (responseData.success && responseData.data) {
        return responseData.data.filter(type => type.active === 1); // Only return active work types
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching work types:', error);
      toast.error('Failed to load work types');
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
      
      if (attachments.documents && attachments.documents.length > 0) {
        attachments.documents.forEach((doc) => {
          formData.append('attachments[]', doc);
        });
      }

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

  // Fetch staff details by ID
  getStaffDetails: async (staffId: string): Promise<SocietyStaffDetails> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SOCIETY_STAFF_DETAILS}/${staffId}.json`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff details');
      }

      const data: SocietyStaffDetailsResponse = await response.json();
      return data.society_staff;
    } catch (error) {
      console.error('Error fetching staff details:', error);
      toast.error('Failed to load staff details');
      throw error;
    }
  },

  // Print QR codes for selected staff
  printQRCodes: async (staffIds: number[]): Promise<void> => {
    try {
      console.log('Sending print QR request with body:', { ids: staffIds });
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRINT_QR_CODES}`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: staffIds
        }),
      });

      console.log('Print QR response status:', response.status);
      console.log('Print QR response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Print QR error response:', errorText);
        throw new Error(`Failed to print QR codes (${response.status}): ${errorText}`);
      }

      // Check if the response is a file (PDF, ZIP, etc.)
      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      
      console.log('Response content-type:', contentType);
      console.log('Response content-disposition:', contentDisposition);

      if (contentType && (
        contentType.includes('application/pdf') || 
        contentType.includes('application/zip') || 
        contentType.includes('application/octet-stream') ||
        contentDisposition?.includes('attachment')
      )) {
        // Handle file download
        const blob = await response.blob();
        
        // Extract filename from content-disposition header or use default
        let filename = 'qr-codes.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }
        
        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success(`QR codes downloaded successfully for ${staffIds.length} staff member(s)`);
      } else {
        // Handle JSON response
        const result = await response.json();
        console.log('Print QR JSON response:', result);
        toast.success(`QR codes printed successfully for ${staffIds.length} staff member(s)`);
      }
    } catch (error) {
      console.error('Error printing QR codes:', error);
      toast.error('Failed to print QR codes');
      throw error;
    }
  },

  // Update staff by ID
  updateStaff: async (staffId: string, formData: FormData): Promise<SocietyStaffDetails | Record<string, unknown>> => {
    try {
      console.log('Updating staff with ID:', staffId);
      console.log('Update form data entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Use the correct API endpoint format for updating society staff
      const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_SOCIETY_STAFF}/${staffId}.json`;
      console.log('Making PUT request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          // Don't set Content-Type for FormData, let browser handle it
        },
        body: formData,
      });

      console.log('Update staff response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = 'Failed to update society staff';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Update staff success response:', result);
      toast.success('Society staff updated successfully!');
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update society staff';
      console.error('Error updating society staff:', error);
      toast.error(errorMessage);
      throw error;
    }
  },

  // Send OTP for staff number verification
  sendStaffOTP: async (staffId: number): Promise<void> => {
    try {
      console.log('Sending OTP for staff ID:', staffId);

      const requestBody = {
        id: staffId
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_STAFF_OTP}`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Send OTP response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }

      const result = await response.json();
      console.log('Send OTP response:', result);
      toast.success('OTP sent successfully to staff member\'s mobile number!');
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      console.error('Error sending OTP:', error);
      toast.error(errorMessage);
      throw error;
    }
  },

  // Verify staff number with OTP
  verifyStaffNumber: async (staffId: number, otp: string): Promise<void> => {
    try {
      console.log('Verifying staff number for ID:', staffId, 'with OTP:', otp);

      const requestBody = {
        id: staffId,
        otp: otp
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_STAFF_NUMBER}`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Verify number response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify staff number');
      }

      const result = await response.json();
      console.log('Verify number response:', result);
      toast.success('Staff number verified successfully!');
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify staff number';
      console.error('Error verifying staff number:', error);
      toast.error(errorMessage);
      throw error;
    }
  },
};
