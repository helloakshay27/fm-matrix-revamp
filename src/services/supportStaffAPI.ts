import { API_CONFIG } from '@/config/apiConfig';

export interface SupportStaffCategoryRequest {
  support_staff_category: {
    name: string;
    estimated_time: number; // in minutes
    resource_id: number;
    resource_type: string;
    active: boolean;
    icon_id?: number; // Add icon_id as optional parameter
  };
}

export interface SupportStaffCategoryCreateResponse {
  id: number;
  resource_id: number;
  resource_type: string;
  name: string;
  active: number;
  created_at: string;
  updated_at: string;
  estimated_time: string;
  support_staff_estimated_time_hash: {
    mt: number;
    dd: number;
    hh: number;
    mm: number;
  };
  icon: string | null;
}

export interface SupportStaffCategoryResponse {
  id: number;
  resource_id: number;
  resource_type: string;
  name: string;
  active: number;
  created_at: string;
  updated_at: string;
  estimated_time: string;
  support_staff_estimated_time_hash: {
    mt: number;
    dd: number;
    hh: number;
    mm: number;
  };
  icon: string | null;
}

export interface SupportStaffCategoriesGetResponse {
  support_staff_categories: SupportStaffCategoryResponse[];
}

export interface SupportStaffCategory {
  id: number;
  name: string;
  estimated_time: string;
  created_on: string;
  created_by: string;
  active: boolean;
  icon_id?: number; // Add icon_id to track the associated icon
}

// Single support staff category response interface (for GET by ID)
export interface SupportStaffCategoryDetailResponse {
  id: number;
  icon_id: number;
  resource_id: number;
  resource_type: string;
  name: string;
  active: number;
  created_at: string;
  updated_at: string;
  estimated_time: string;
  support_staff_estimated_time_hash: {
    mt: number;
    dd: number;
    hh: number;
    mm: number;
  };
  icon_image_url: string;
  created_by: {
    id: number | null;
    name: string | null;
  };
}

// Create a new support staff category
export const createSupportStaffCategory = async (
  categoryData: {
    name: string;
    days: number;
    hours: number;
    minutes: number;
    iconId?: number; // Add iconId parameter
  }
): Promise<SupportStaffCategoryCreateResponse> => {
  const { BASE_URL, TOKEN } = API_CONFIG;
  
  if (!TOKEN) {
    throw new Error('Authentication token is required');
  }

  // Calculate total estimated time in minutes
  const totalMinutes = (categoryData.days * 24 * 60) + (categoryData.hours * 60) + categoryData.minutes;

  const requestBody: SupportStaffCategoryRequest = {
    support_staff_category: {
      name: categoryData.name,
      estimated_time: totalMinutes,
      resource_id: 2189, // This should ideally come from user context/site selection
      resource_type: "Pms::Site",
      active: true,
      ...(categoryData.iconId && { icon_id: categoryData.iconId }) // Include icon_id if provided
    }
  };

  console.log('Creating support staff category:', requestBody);

  const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.SUPPORT_STAFF_CATEGORIES}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to create support staff category:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Failed to create support staff category: ${response.status} ${response.statusText}`);
  }

  const data: SupportStaffCategoryCreateResponse = await response.json();
  console.log('Support staff category created successfully:', data);
  return data;
};

// Update an existing support staff category
export const updateSupportStaffCategory = async (
  categoryId: number,
  categoryData: {
    name: string;
    days: number;
    hours: number;
    minutes: number;
    iconId?: number; // Add iconId parameter
  }
): Promise<SupportStaffCategoryCreateResponse> => {
  const { BASE_URL, TOKEN } = API_CONFIG;
  
  if (!TOKEN) {
    throw new Error('Authentication token is required');
  }

  // Calculate total estimated time in minutes
  const totalMinutes = (categoryData.days * 24 * 60) + (categoryData.hours * 60) + categoryData.minutes;

  const requestBody: SupportStaffCategoryRequest = {
    support_staff_category: {
      name: categoryData.name,
      estimated_time: totalMinutes,
      resource_id: 2189, // This should ideally come from user context/site selection
      resource_type: "Pms::Site",
      active: true,
      ...(categoryData.iconId && { icon_id: categoryData.iconId }) // Include icon_id if provided
    }
  };

  console.log('Updating support staff category:', categoryId, requestBody);

  // Use PATCH method for updates, endpoint would be like /pms/admin/support_staff_categories/1930.json
  const response = await fetch(`${BASE_URL}/pms/admin/support_staff_categories/${categoryId}.json`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to update support staff category:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Failed to update support staff category: ${response.status} ${response.statusText}`);
  }

  const data: SupportStaffCategoryCreateResponse = await response.json();
  console.log('Support staff category updated successfully:', data);
  return data;
};

// Fetch a single support staff category by ID
export const fetchSupportStaffCategoryById = async (id: number): Promise<SupportStaffCategoryDetailResponse> => {
  const { BASE_URL, TOKEN } = API_CONFIG;
  
  if (!TOKEN) {
    throw new Error('Authentication token is required');
  }

  console.log(`Fetching support staff category with ID: ${id}`);

  const response = await fetch(`${BASE_URL}/pms/admin/support_staff_categories/${id}.json`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to fetch support staff category:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Failed to fetch support staff category: ${response.status} ${response.statusText}`);
  }

  const data: SupportStaffCategoryDetailResponse = await response.json();
  console.log('Support staff category fetched successfully:', data);
  return data;
};

// Fetch all support staff categories
export const fetchSupportStaffCategories = async (): Promise<SupportStaffCategory[]> => {
  const { BASE_URL, TOKEN } = API_CONFIG;
  
  if (!TOKEN) {
    throw new Error('Authentication token is required');
  }

  console.log('Fetching support staff categories...');

  const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.SUPPORT_STAFF_CATEGORIES}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to fetch support staff categories:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Failed to fetch support staff categories: ${response.status} ${response.statusText}`);
  }

  const data: SupportStaffCategoriesGetResponse = await response.json();
  
  // Transform the API response to match the component's expected format
  const transformedData: SupportStaffCategory[] = data.support_staff_categories.map((item) => ({
    id: item.id,
    name: item.name,
    estimated_time: item.estimated_time.trim(),
    created_on: new Date(item.created_at).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    created_by: 'Admin', // This should come from API if available in future
    active: item.active === 1
  }));

  console.log('Support staff categories fetched successfully:', transformedData);
  return transformedData;
};

// Helper function to parse estimated time string back to components
export const parseEstimatedTime = (estimatedTimeString: string): { days: number; hours: number; minutes: number } => {
  const timeHash = estimatedTimeString.match(/(\d+)\s*(days?|hours?|hrs?|minutes?|mins?)/gi);
  
  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (timeHash) {
    timeHash.forEach(match => {
      const value = parseInt(match.match(/\d+/)?.[0] || '0');
      const unit = match.match(/(days?|hours?|hrs?|minutes?|mins?)/i)?.[0].toLowerCase();
      
      if (unit?.includes('day')) {
        days = value;
      } else if (unit?.includes('hour') || unit?.includes('hr')) {
        hours = value;
      } else if (unit?.includes('minute') || unit?.includes('min')) {
        minutes = value;
      }
    });
  }

  return { days, hours, minutes };
};
