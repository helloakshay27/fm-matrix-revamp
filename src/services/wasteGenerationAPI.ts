import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '../config/apiConfig';

// Types for waste generation API
export interface Vendor {
  id: number;
  full_name: string;
  company_name: string;
}

export interface Commodity {
  id: number;
  category_name: string;
  tag_type: string;
}

export interface Category {
  id: number;
  category_name: string;
  category_type: string;
  tag_type: string;
}

export interface OperationalLandlord {
  id: number;
  category_name: string;
  tag_type: string;
}

export interface CreatedBy {
  id: number;
  full_name: string;
  email: string;
}

export interface WasteGeneration {
  id: number;
  reference_number: number;
  waste_unit: number;
  recycled_unit: number;
  agency_name: string;
  wg_date: string;
  created_at: string;
  updated_at: string;
  resource_id: number;
  resource_type: string;
  location_details: string;
  building_id: number;
  building_name: string;
  wing_id: number | null;
  wing_name: string | null;
  area_id: number | null;
  area_name: string | null;
  vendor: Vendor;
  commodity: Commodity;
  category: Category;
  operational_landlord: OperationalLandlord;
  created_by: CreatedBy;
  url: string;
}

export interface WasteGenerationResponse {
  waste_generations: WasteGeneration[];
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface Building {
  id: number;
  name: string;
}

export interface Wing {
  id: number;
  name: string;
}

export interface Area {
  id: number;
  name: string;
}

export interface CreateWasteGenerationPayload {
  pms_waste_generation: {
    vendor_id: number;
    commodity_id: number;
    category_id: number;
    waste_unit: number;
    operational_landlord_id: number;
    wg_date: string;
    agency_name: string;
    recycled_unit: number;
    building_id: number;
    wing_id?: number;
    area_id?: number;
  };
}

export interface CreateWasteGenerationResponse {
  id: number;
  message: string;
  status: string;
}

export interface UpdateWasteGenerationPayload {
  pms_waste_generation: {
    vendor_id?: number | null;
    commodity_id: number;
    category_id: number;
    waste_unit: number;
    operational_landlord_id: number;
    wg_date: string;
    agency_name: string;
    recycled_unit: number;
    building_id: number;
    wing_id?: number | null;
    area_id?: number | null;
    uom?: string;
    type_of_waste?: string;
  };
}

export interface UpdateWasteGenerationResponse {
  id: number;
  message: string;
  status: string;
}

// Filter interface for waste generation API
export interface WasteGenerationFilters {
  commodity_id_eq?: string;
  category_id_eq?: string;
  operational_landlord_id_in?: string;
  date_range?: string;
}

// API function to fetch waste generations with filters
export const fetchWasteGenerations = async (page: number = 1, filters?: WasteGenerationFilters): Promise<WasteGenerationResponse> => {
  try {
    // Build query parameters manually to preserve square brackets
    const queryParts: string[] = [`page=${page}`];
    
    // Add filter parameters if provided
    if (filters) {
      if (filters.commodity_id_eq) {
        queryParts.push(`q[commodity_id_eq]=${encodeURIComponent(filters.commodity_id_eq)}`);
      }
      if (filters.category_id_eq) {
        queryParts.push(`q[category_id_eq]=${encodeURIComponent(filters.category_id_eq)}`);
      }
      if (filters.operational_landlord_id_in) {
        queryParts.push(`q[operational_landlord_id_in]=${encodeURIComponent(filters.operational_landlord_id_in)}`);
      }
      if (filters.date_range) {
        queryParts.push(`q[date_range]=${encodeURIComponent(filters.date_range)}`);
      }
    }
    
    const queryString = queryParts.join('&');
    const url = getFullUrl(`/pms/waste_generations.json?${queryString}`);
    
    console.log('=== Waste Generation API Debug ===');
    console.log('Query string parts:', queryParts);
    console.log('Final query string:', queryString);
    console.log('Complete URL:', url);
    console.log('Applied filters:', filters);
    console.log('=================================');
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Waste generations API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching waste generations:', error);
    throw error;
  }
};

// API function to create waste generation
export const createWasteGeneration = async (payload: CreateWasteGenerationPayload): Promise<CreateWasteGenerationResponse> => {
  try {
    const url = getFullUrl('/pms/waste_generations.json');
    
    console.log('Creating waste generation at:', url);
    console.log('Create payload:', payload);
    
    const options = getAuthenticatedFetchOptions('POST', payload);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Create waste generation API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error creating waste generation:', error);
    throw error;
  }
};

// API function to fetch single waste generation by ID
export const fetchWasteGenerationById = async (id: number): Promise<WasteGeneration> => {
  try {
    const url = getFullUrl(`/pms/waste_generations/${id}.json`);
    
    console.log('Fetching waste generation by ID from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Waste generation by ID API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching waste generation by ID:', error);
    throw error;
  }
};

// API function to fetch buildings
export const fetchBuildings = async (): Promise<Building[]> => {
  try {
    const url = getFullUrl('/buildings.json');
    
    console.log('Fetching buildings from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Buildings API response:', data);
    
    return data.buildings || data;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
};

// API function to fetch wings based on building
export const fetchWings = async (buildingId: number): Promise<Wing[]> => {
  try {
    const url = getFullUrl(`/pms/wings.json?building_id=${buildingId}`);
    
    console.log('Fetching wings from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Wings API response:', data);
    
    return data.wings || data;
  } catch (error) {
    console.error('Error fetching wings:', error);
    throw error;
  }
};

// API function to fetch areas based on wing
export const fetchAreas = async (wingId: number): Promise<Area[]> => {
  try {
    const url = getFullUrl(`/pms/areas.json?wing_id=${wingId}`);
    
    console.log('Fetching areas from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Areas API response:', data);
    
    return data.areas || data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

// API function to fetch vendors
export const fetchVendors = async (): Promise<Vendor[]> => {
  try {
    const url = getFullUrl('/pms/suppliers/get_suppliers.json');
    
    console.log('Fetching vendors from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Vendors API response:', data);
    
    // The new API returns an array directly with id and name properties
    if (Array.isArray(data)) {
      // Map the response to match the expected Vendor interface
      const vendors = data.map(supplier => ({
        id: supplier.id,
        full_name: supplier.name, // Use name for full_name
        company_name: supplier.name // Use name for company_name as well
      }));
      
      console.log('Mapped vendors:', vendors);
      return vendors;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// API function to fetch commodities
export const fetchCommodities = async (): Promise<Commodity[]> => {
  try {
    const url = getFullUrl('/pms/generic_tags.json?q[tag_type_eq]=Commodity');
    
    console.log('Fetching commodities from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      // If endpoint doesn't exist, return empty array
      if (response.status === 404) {
        console.warn('Generic tags endpoint not found, returning empty array');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Generic tags API response (commodities):', data);
    
    if (Array.isArray(data)) {
      // Filter for active commodities with valid category names
      const commodities = data.filter(tag => {
        const hasName = tag.category_name && tag.category_name.trim() !== '';
        const isActive = tag.active === true;
        
        console.log('Commodity tag:', tag.category_name, 'Tag type:', tag.tag_type, 'Has Name:', hasName, 'Is Active:', isActive);
        return hasName && isActive;
      });
      
      console.log('Filtered commodities:', commodities);
      return commodities;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching commodities:', error);
    // Return empty array instead of throwing error for optional data
    return [];
  }
};

// API function to fetch categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const url = getFullUrl('/pms/generic_tags.json?q[tag_type_eq]=Category');
    
    console.log('Fetching categories from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      // If endpoint doesn't exist, return empty array
      if (response.status === 404) {
        console.warn('Generic tags endpoint not found, returning empty array');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Generic tags API response (categories):', data);
    
    if (Array.isArray(data)) {
      // Filter for active categories with valid category names
      const categories = data.filter(tag => {
        const hasName = tag.category_name && tag.category_name.trim() !== '';
        const isActive = tag.active === true;
        
        console.log('Category tag:', tag.category_name, 'Tag type:', tag.tag_type, 'Has Name:', hasName, 'Is Active:', isActive);
        return hasName && isActive;
      });
      
      console.log('Filtered categories:', categories);
      return categories;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array instead of throwing error for optional data
    return [];
  }
};

// API function to fetch operational landlords
export const fetchOperationalLandlords = async (): Promise<OperationalLandlord[]> => {
  try {
    const url = getFullUrl('/pms/generic_tags.json?q[tag_type_eq]=operational_name_of_landlord');
    
    console.log('Fetching operational landlords from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      // If endpoint doesn't exist, return empty array
      if (response.status === 404) {
        console.warn('Generic tags endpoint not found, returning empty array');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Generic tags API response (operational landlords):', data);
    
    if (Array.isArray(data)) {
      // Filter for active operational landlords with valid category names
      const operationalLandlords = data.filter(tag => {
        const hasName = tag.category_name && tag.category_name.trim() !== '';
        const isActive = tag.active === true;
        
        console.log('Operational landlord tag:', tag.category_name, 'Tag type:', tag.tag_type, 'Has Name:', hasName, 'Is Active:', isActive);
        return hasName && isActive;
      });
      
      console.log('Filtered operational landlords:', operationalLandlords);
      return operationalLandlords;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching operational landlords:', error);
    // Return empty array instead of throwing error for optional data
    return [];
  }
};

// API function to update waste generation
export const updateWasteGeneration = async (id: number, payload: UpdateWasteGenerationPayload): Promise<UpdateWasteGenerationResponse> => {
  try {
    const url = getFullUrl(`/pms/waste_generations/${id}.json`);
    
    console.log('Updating waste generation at:', url);
    console.log('Update payload:', payload);
    
    const options = getAuthenticatedFetchOptions('PUT', payload);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Update waste generation API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error updating waste generation:', error);
    throw error;
  }
};
