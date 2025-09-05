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

export interface ParkingBookingSummary {
  total_slots: number;
  vacant_two_wheeler: number;
  vacant_four_wheeler: number;
  alloted_slots: number;
  vacant_slots: number;
  two_wheeler_allotted: number;
  four_wheeler_allotted: number;
}

export interface ParkingBookingClient {
  id: number;
  name: string;
  two_wheeler_count: number;
  four_wheeler_count: number;
  free_parking: number;
  paid_parking: number;
  available_parking_slots: number;
}

export interface ParkingBookingsResponse {
  summary: ParkingBookingSummary;
  clients: ParkingBookingClient[];
}

export interface ParkingEntity {
  id: number;
  name: string;
  color_code: string;
}

export interface ParkingSummary {
  two_wheeler_count: number;
  four_wheeler_count: number;
}

export interface LeasePeriod {
  start_date: string;
  end_date: string;
  expired: boolean;
}

export interface ParkingLease {
  id: number;
  lease_period: LeasePeriod;
  parking_bookings: unknown[]; // Can be expanded based on actual booking structure
}

export interface ParkingDetailsResponse {
  entity: ParkingEntity;
  parking_summary: ParkingSummary;
  leases: ParkingLease[];
}

// Types for parking slots with status API
export interface ParkingBookingDetails {
  id: number;
  entity_name: string;
  entity_color: string;
  booking_date: string | null;
  status: string;
}

export interface ParkingSlot {
  id: number;
  name: string;
  stacked: boolean;
  reserved: boolean;
  parking_type: number;
  status: string;
  booking_details?: ParkingBookingDetails;
}

export interface ParkingCategory {
  parking_category: string;
  floor_name: string;
  total_slots: number;
  booked_slots: number;
  vacant_slots: number;
  reserved_slots: number;
  parking_slots: ParkingSlot[];
}

export interface ParkingSlotsWithStatusResponse {
  filters: {
    building_id: string;
    floor_id: string;
    slot_type_id: string;
  };
  parking_categories: ParkingCategory[];
}

// Types for entities API (Client Name dropdown)
export interface CustomerLease {
  id: number;
  lease_start_date: string;
  lease_end_date: string;
  free_parking: number;
  paid_parking: number;
}

export interface Entity {
  id: number;
  name: string;
  mobile: string;
  email: string;
  ext_project_code: string | null;
  company_code: string | null;
  ext_customer_code: string | null;
  color_code: string;
  created_at: string | null;
  updated_at: string | null;
  customer_leases: CustomerLease[];
}

export interface EntitiesResponse {
  entities: Entity[];
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

export const fetchParkingBookings = async (): Promise<ParkingBookingsResponse> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.PARKING_BOOKINGS);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching parking bookings from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Parking bookings API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching parking bookings:', error);
    throw error;
  }
};

export const fetchParkingDetails = async (clientId: string): Promise<ParkingDetailsResponse> => {
  try {
    const url = getFullUrl(`${API_CONFIG.ENDPOINTS.PARKING_BOOKING_DETAILS}/${clientId}/customer_booking_show.json`);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching parking details from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Parking details API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching parking details:', error);
    throw error;
  }
};

export const fetchParkingSlotsWithStatus = async (
  buildingId: string, 
  floorId: string, 
  slotTypeId: string
): Promise<ParkingSlotsWithStatusResponse> => {
  try {
    const url = getFullUrl(`/pms/admin/parking_bookings/parking_slots_with_status?building_id=${buildingId}&floor_id=${floorId}&slot_type_id=${slotTypeId}`);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching parking slots with status from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Parking slots with status API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching parking slots with status:', error);
    throw error;
  }
};

export const fetchEntities = async (): Promise<Entity[]> => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.ENTITIES);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching entities from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Entities API response:', data);
    
    // The API returns { entities: [...] } 
    return data.entities || [];
  } catch (error) {
    console.error('Error fetching entities:', error);
    throw error;
  }
};

export const fetchCustomerLeases = async (entityId: number): Promise<CustomerLease[]> => {
  try {
    const url = getFullUrl(`/entities/${entityId}/customer_leases.json`);
    const options = getAuthenticatedFetchOptions('GET');

    console.log('Fetching customer leases from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Customer leases API response:', data);
    
    // The API returns an array directly
    return data || [];
  } catch (error) {
    console.error('Error fetching customer leases:', error);
    throw error;
  }
};

// Types for updating parking bookings
export interface UpdateParkingBookingsPayload {
  lease_id: number;
  building_id: number;
  floor_id: number;
  entity_id: number;
  selected_parking_slots: number[];
}

export interface UpdatedParkingBooking {
  id: number | null;
  parking_number_id: number;
  parking_configuration_id: number;
  status: string;
}

export interface UpdateParkingBookingsResponse {
  status: string;
  message: string;
  lease_id: number;
  entity_id: number;
  building_id: number;
  floor_id: number;
  updated_parking_bookings: UpdatedParkingBooking[];
}

// API function to update parking bookings
export const updateParkingBookings = async (payload: UpdateParkingBookingsPayload): Promise<UpdateParkingBookingsResponse> => {
  try {
    const url = getFullUrl('/parking_bookings/update_bookings.json');
    
    console.log('Updating parking bookings to:', url);
    console.log('Update payload:', payload);
    
    const options = getAuthenticatedFetchOptions('POST', payload);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Update parking bookings API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error updating parking bookings:', error);
    throw error;
  }
};
