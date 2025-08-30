import { API_CONFIG } from '@/config/apiConfig';

export interface ParkingCategory {
  id: number;
  name: string;
  active: boolean;
  created_at: string;
  resource_id: number;
  resource_type: string;
}

export interface ParkingNumber {
  id?: number;
  name: string;
  reserved: boolean;
  stacked?: boolean;
  parking_type?: number;
  active?: boolean;
}

export interface ParkingConfiguration {
  id: number;
  parking_category_id: number;
  building_id: number;
  floor_id: number;
  no_of_parkings: number;
  reserved_parkings: number;
  resource_id: number;
  resource_type: string;
  active: boolean;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  category_name: string;
  floor_name: string;
  building_name: string;
  parking_image_url?: string;
  unstacked_count: number;
  stacked_count: number;
  parking_numbers: ParkingNumber[];
}

export async function fetchParkingConfigById(id: number) {
  console.log('Fetching parking config for ID:', id);
  const url = `${API_CONFIG.BASE_URL}/pms/admin/parking_configurations/${id}.json`;
  console.log('API URL:', url);
  console.log('Token available:', !!API_CONFIG.TOKEN);
  
  const res = await fetch(url, {
    headers: { 
      Authorization: `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  console.log('Response status:', res.status);
  console.log('Response headers:', Object.fromEntries(res.headers.entries()));
  
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        // It's likely HTML error page, don't try to parse as JSON
        console.error('Received HTML error page instead of JSON');
        if (res.status === 404) {
          errorMessage = `Parking configuration with ID ${id} not found`;
        } else if (res.status === 401) {
          errorMessage = 'Unauthorized - please log in again';
        } else if (res.status === 500) {
          errorMessage = 'Server error - please try again later';
        }
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      // Keep the basic error message if we can't parse the response
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    const data = await res.json();
    console.log('API Response data:', data);
    return data;
  } catch (jsonError) {
    console.error('Error parsing JSON response:', jsonError);
    throw new Error('Invalid response format from server');
  }
}

export async function fetchParkingConfigByBuildingAndFloor(buildingId: number, floorId: number) {
  console.log('Fetching parking config for building:', buildingId, 'floor:', floorId);
  
  // Construct query parameters manually to avoid URL encoding of square brackets
  const queryString = `q[building_id_eq]=${buildingId}&q[floor_id_eq]=${floorId}`;
  
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARKING_CONFIGURATIONS_SEARCH}?${queryString}`;
  console.log('API URL:', url);
  console.log('Query params:', queryString);
  console.log('Token available:', !!API_CONFIG.TOKEN);
  
  const res = await fetch(url, {
    headers: { 
      Authorization: `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  console.log('Request made to URL:', url);
  console.log('Full request details:', {
    url,
    headers: {
      Authorization: `Bearer ${API_CONFIG.TOKEN?.substring(0, 10)}...`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    buildingId,
    floorId
  });
  console.log('Response status:', res.status);
  console.log('Response headers:', Object.fromEntries(res.headers.entries()));
  
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        // It's likely HTML error page, don't try to parse as JSON
        console.error('Received HTML error page instead of JSON');
        if (res.status === 404) {
          errorMessage = `Parking configurations not found for building ${buildingId} and floor ${floorId}`;
        } else if (res.status === 401) {
          errorMessage = 'Unauthorized - please log in again';
        } else if (res.status === 500) {
          errorMessage = 'Server error - please try again later';
        }
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      // Keep the basic error message if we can't parse the response
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    const data = await res.json();
    console.log('API Response data:', data);
    return data;
  } catch (jsonError) {
    console.error('Error parsing JSON response:', jsonError);
    throw new Error('Invalid response format from server');
  }
}

export async function updateParkingConfig(body: Record<string, unknown>) {
  try {
    console.log('Updating parking config with body:', body);
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARKING_CONFIGURATIONS}`;
    console.log('Update API URL:', url);
    
    // Use the same approach as createParkingConfiguration for consistency
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
    });
    
    console.log('Update Response status:', res.status);
    
    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          console.error('Received HTML error page instead of JSON');
          if (res.status === 404) {
            errorMessage = 'Parking configuration not found';
          } else if (res.status === 401) {
            errorMessage = 'Unauthorized - please log in again';
          } else if (res.status === 422) {
            errorMessage = 'Invalid data provided';
          } else if (res.status === 500) {
            errorMessage = 'Server error - please try again later';
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.error('Error updating parking configuration:', error);
    throw error;
  }
}

export async function fetchParkingCategories(): Promise<ParkingCategory[]> {
  console.log('Fetching parking categories');
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PARKING_CATEGORIES}`;
  console.log('Parking Categories API URL:', url);
  
  const res = await fetch(url, {
    headers: { 
      Authorization: `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  console.log('Parking Categories Response status:', res.status);
  
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        console.error('Received HTML error page instead of JSON');
        if (res.status === 404) {
          errorMessage = 'Parking categories not found';
        } else if (res.status === 401) {
          errorMessage = 'Unauthorized - please log in again';
        } else if (res.status === 500) {
          errorMessage = 'Server error - please try again later';
        }
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    const data = await res.json();
    console.log('Parking Categories API Response data:', data);
    return data.parking_categories || [];
  } catch (jsonError) {
    console.error('Error parsing JSON response:', jsonError);
    throw new Error('Invalid response format from server');
  }
}
