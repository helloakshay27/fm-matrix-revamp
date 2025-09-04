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

// API function to fetch waste generations
export const fetchWasteGenerations = async (page: number = 1): Promise<WasteGenerationResponse> => {
  try {
    const url = getFullUrl(`/pms/waste_generations.json?page=${page}`);
    
    console.log('Fetching waste generations from:', url);
    
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
    const url = getFullUrl('/pms/suppliers.json');
    
    console.log('Fetching vendors from:', url);
    
    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Vendors API response:', data);
    
    return data.suppliers || data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// API function to fetch commodities
export const fetchCommodities = async (): Promise<Commodity[]> => {
  try {
    const url = getFullUrl('/pms/generic_tags.json');
    
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
      // Log all unique tag types to debug
      const uniqueTagTypes = [...new Set(data.map(tag => tag.tag_type))];
      console.log('All available tag types for commodities:', uniqueTagTypes);
      
      // Filter for commodity type tags and exclude empty category names
      const commodities = data.filter(tag => {
        const isCommodity = tag.tag_type === 'Commodity' || 
                           tag.tag_type === 'commodity' || 
                           tag.tag_type === 'waste_commodity' ||
                           tag.tag_type === 'Waste Commodity';
        const hasName = tag.category_name && tag.category_name.trim() !== '';
        const isActive = tag.active === true;
        
        console.log('Commodity tag:', tag.category_name, 'Tag type:', tag.tag_type, 'Is Commodity:', isCommodity, 'Has Name:', hasName, 'Is Active:', isActive);
        return isCommodity && hasName && isActive;
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
    const url = getFullUrl('/pms/generic_tags.json');
    
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
    console.log('Generic tags API response (full data):', data);
    
    if (Array.isArray(data)) {
      // Log all unique tag types to debug
      const uniqueTagTypes = [...new Set(data.map(tag => tag.tag_type))];
      console.log('All available tag types:', uniqueTagTypes);
      
      // Filter for category type tags and exclude empty category names
      const categories = data.filter(tag => {
        const isCategory = tag.tag_type === 'Category' || 
                          tag.tag_type === 'category' || 
                          tag.tag_type === 'waste_category' ||
                          tag.tag_type === 'Waste Category';
        const hasName = tag.category_name && tag.category_name.trim() !== '';
        const isActive = tag.active === true;
        
        console.log('Tag:', tag.category_name, 'Tag type:', tag.tag_type, 'Is Category:', isCategory, 'Has Name:', hasName, 'Is Active:', isActive);
        return isCategory && hasName && isActive;
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
    const url = getFullUrl('/pms/generic_tags.json');
    
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
      // Log all unique tag types to debug
      const uniqueTagTypes = [...new Set(data.map(tag => tag.tag_type))];
      console.log('All available tag types for operational landlords:', uniqueTagTypes);
      
      // Filter for operational landlord type tags and exclude empty category names
      const operationalLandlords = data.filter(tag => {
        const isOperationalLandlord = tag.tag_type === 'operational_name_of_landlord';
        const hasName = tag.category_name && tag.category_name.trim() !== '';
        const isActive = tag.active === true;
        
        console.log('Operational landlord tag:', tag.category_name, 'Tag type:', tag.tag_type, 'Is Operational Landlord:', isOperationalLandlord, 'Has Name:', hasName, 'Is Active:', isActive);
        return isOperationalLandlord && hasName && isActive;
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
