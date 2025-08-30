import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '../config/apiConfig';

export interface ParkingNumber {
  id: number;
  name: string;
  reserved: boolean;
  stacked: boolean;
  parking_type: number;
  active: boolean;
}

export interface ParkingConfiguration {
  id: number;
  parking_category_id: number;
  category_name: string;
  no_of_parkings: number;
  reserved_parkings: number;
  resource_id: number;
  resource_type: string;
  active: boolean;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  parking_image_url: string;
  unstacked_count: number;
  stacked_count: number;
  parking_numbers: ParkingNumber[];
}

export interface GroupedParkingConfiguration {
  floor_id: number;
  floor_name: string;
  building_id: string;
  building_name: string;
  total_count: number;
  qrcode_needed?: string | boolean;
  parking_configurations: ParkingConfiguration[];
}

export interface ParkingConfigurationsResponse {
  grouped_parking_configurations: GroupedParkingConfiguration[];
}

export interface ParkingSlotData {
  parking_name: string;
  reserved: boolean;
  stacked?: boolean;
}

export interface CategoryParkingData {
  no_of_parkings: number;
  reserved_parkings: number;
  parking: ParkingSlotData[];
}

export interface CreateParkingConfigurationRequest {
  building_id: string;
  floor_id: string;
  qrcode_needed?: boolean;
  attachment?: File | string; // Use 'attachment' parameter for image upload
  [categoryId: string]: string | boolean | CategoryParkingData | File | undefined;
}

export interface Building {
  id: number;
  name: string;
  site_id?: string;
  has_wing?: boolean;
  has_floor?: boolean;
  has_area?: boolean;
  has_room?: boolean;
  active?: boolean;
}

export interface Floor {
  id: number;
  name: string;
  building_id: string;
  wing_id?: number;
  area_id?: number;
  active?: boolean;
}

export const fetchParkingConfigurations = async (): Promise<ParkingConfigurationsResponse> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.PARKING_CONFIGURATIONS);
    const options = getAuthenticatedFetchOptions('GET');

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching parking configurations:', error);
    throw error;
  }
};

export const createParkingConfiguration = async (data: CreateParkingConfigurationRequest): Promise<{ success: boolean; message?: string }> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.PARKING_CONFIGURATIONS);
    
    // Check if there's a file to upload
    const hasFile = data.attachment && data.attachment instanceof File;
    
    let options: RequestInit;
    
    if (hasFile) {
      // Use FormData for file upload but maintain the exact same structure
      const formData = new FormData();
      
      // Add basic fields
      formData.append('building_id', data.building_id);
      formData.append('floor_id', data.floor_id);
      
      // Add the attachment file
      formData.append('attachment', data.attachment as File);
      
      // Add qrcode_needed field if it exists
      if (data.qrcode_needed !== undefined) {
        formData.append('qrcode_needed', data.qrcode_needed.toString());
      }
      
      // Add category data maintaining exact object structure
      Object.keys(data).forEach(key => {
        if (key !== 'building_id' && key !== 'floor_id' && key !== 'attachment' && key !== 'qrcode_needed') {
          const categoryData = data[key] as CategoryParkingData;
          if (categoryData && typeof categoryData === 'object' && 'no_of_parkings' in categoryData) {
            // Add the category as nested parameters to maintain object structure
            formData.append(`${key}[no_of_parkings]`, categoryData.no_of_parkings.toString());
            formData.append(`${key}[reserved_parkings]`, categoryData.reserved_parkings.toString());
            
            // Add parking array using Rails array parameter syntax
            if (categoryData.parking && Array.isArray(categoryData.parking)) {
              categoryData.parking.forEach((parking: ParkingSlotData, index: number) => {
                formData.append(`${key}[parking][][parking_name]`, parking.parking_name);
                formData.append(`${key}[parking][][reserved]`, parking.reserved.toString());
                if (parking.stacked !== undefined) {
                  formData.append(`${key}[parking][][stacked]`, parking.stacked.toString());
                }
              });
            }
          }
        }
      });
      
      options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          // Don't set Content-Type header for FormData, browser will set it automatically
        },
        body: formData
      };
    } else {
      // Use regular JSON for non-file requests
      // Remove attachment field if it's not a file to avoid sending strings to Rails Paperclip
      const cleanData = { ...data };
      if (cleanData.attachment && typeof cleanData.attachment === 'string') {
        delete cleanData.attachment;
      }
      options = getAuthenticatedFetchOptions('POST', cleanData);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error creating parking configuration:', error);
    throw error;
  }
};

export const fetchBuildings = async (): Promise<Building[]> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.BUILDINGS);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching buildings from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Buildings API response:', data);
    
    // The API returns { buildings: [...] } based on locationSlice
    return data.buildings || data || [];
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
};

export const fetchFloors = async (buildingId?: string): Promise<Floor[]> => {
  try {
    // Based on locationSlice, floors require area_id, not building_id
    // For now, let's get all floors and filter if needed
    const url = getFullUrl(API_CONFIG.ENDPOINTS.FLOORS);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching floors from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Floors API response:', data);
    
    // The API returns { floors: [...] } based on locationSlice
    const floors = data.floors || data || [];
    
    // Filter by building_id if provided
    if (buildingId) {
      return floors.filter((floor: Floor) => floor.building_id === buildingId);
    }
    
    return floors;
  } catch (error) {
    console.error('Error fetching floors:', error);
    throw error;
  }
};
