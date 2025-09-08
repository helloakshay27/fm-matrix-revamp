import { API_CONFIG } from '@/config/apiConfig';

export interface SocietyStaff {
  id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  soc_staff_id: string | null;
  vendor_name: string | null;
  active: number | null;
  full_name: string;
  email: string | null;
  unit_name: string | null;
  department_name: string | null;
  work_type_name: string | null;
  status_text: string;
  user_id: number | null;
  number_verified: boolean;
  staff_image_url: string | null;
  qr_code_url: string | null;
  staff_workings: unknown[];
  helpdesk_operations: unknown[];
  created_at: string;
  updated_at: string;
  valid_from: string | null;
  expiry: string | null;
}

export interface PaginationInfo {
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface SocietyStaffsResponse {
  society_staffs: SocietyStaff[];
  pagination: PaginationInfo;
}

export const fetchSocietyStaffs = async (page: number = 1, searchQuery?: string): Promise<SocietyStaffsResponse> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (page > 1) {
      params.append('page', page.toString());
    }
    
    if (searchQuery && searchQuery.trim()) {
      params.append('q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]', searchQuery.trim());
    }
    
    const queryString = params.toString();
    const url = `${API_CONFIG.BASE_URL}/pms/admin/society_staffs.json${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching society staffs from URL:', url);
    console.log('Search query:', searchQuery);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SocietyStaffsResponse = await response.json();
    console.log('Society Staffs API Response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching society staffs:', error);
    throw error;
  }
};

// Enhanced search function for society staffs
export const searchSocietyStaffs = async (searchQuery: string, page: number = 1): Promise<SocietyStaffsResponse> => {
  return fetchSocietyStaffs(page, searchQuery);
};
