import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions, getAuthHeader } from '../config/apiConfig';

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

export interface WasteBagDetail {
  id: number;
  field_name: string;
  field_description: string;
  field_value: string;
}

// One category/commodity breakdown row on a multi-category waste generation
// record (created via the create_waste endpoint's `waste_entries`).
export interface WasteGenerationCategoryEntry {
  id: number;
  uom: string;
  waste_unit: number;
  commodity: Commodity | null;
  category: Category | null;
  bag_counts: number;
  waste_bag_details: WasteBagDetail[];
  attachments: unknown[];
  signature: string | null;
}

export interface WasteGeneration {
  id: number;
  reference_number: number;
  waste_unit: number;
  recycled_unit: number;
  agency_name: string;
  remark?: string;
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
  entity_id: number | null;
  client_name: string | null;
  device_id: number | null;
  status: string | null;
  dispatch_id?: number | null;
  dispatch_status?: boolean;
  user_type: string;
  user_name: string;
  bag_counts: number;
  vendor: Vendor;
  // Present on legacy single-category records; null on newer multi-category
  // records, which instead carry the breakdown in `categories`.
  commodity: Commodity | null;
  category: Category | null;
  operational_landlord: OperationalLandlord;
  created_by: CreatedBy;
  url: string;
  attachments: unknown[];
  signature: string | null;
  waste_bag_details: WasteBagDetail[];
  // Per-category breakdown for records created with multiple waste entries.
  categories?: WasteGenerationCategoryEntry[];
  // Comma-joined category/commodity names and the total bag count across every
  // category entry — sent alongside (not inside) `categories`/`bag_counts`.
  category_names?: string | null;
  commodity_names?: string | null;
  total_bag_count?: number | null;
}

export interface WasteGenerationCounts {
  total_waste: number;
  total_recycled: number;
  recycling_percentage: number;
  dry_waste: number;
  hazardous_waste: number;
}

export interface WasteGenerationResponse {
  waste_generations: WasteGeneration[];
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
  counts?: WasteGenerationCounts;
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

export interface WasteEntryInput {
  category_id: number;
  commodity_id: number;
  uom: string;
  values: number[];
  attachments?: File[];
  signature?: string | null;
}

export interface CreateWasteGenerationPayload {
  pms_waste_generation: {
    wg_date: string;
    vendor_id: number | null;
    operational_landlord_id: number;
    building_id: number;
    wing_id?: number | null;
    area_id?: number | null;
    agency_name: string;
    recycled_unit: number;
    remark?: string;
    device_id?: string;
  };
  waste_entries: WasteEntryInput[];
}

export interface CreateWasteGenerationResponse {
  id?: number;
  message?: string;
  status?: string;
  success?: boolean;
  error?: string;
  errors?: string[] | Record<string, string[]>;
}

const extractCreateWasteGenerationErrorMessage = (
  data: CreateWasteGenerationResponse | null,
  fallback: string
): string => {
  if (!data) return fallback;
  if (typeof data.error === 'string' && data.error) return data.error;
  if (typeof data.message === 'string' && data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length > 0) return data.errors.join(', ');
  if (data.errors && typeof data.errors === 'object') {
    const flattened = Object.values(data.errors).flat();
    if (flattened.length > 0) return flattened.join(', ');
  }
  return fallback;
};

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
    remark?: string;
  };
}

export interface UpdateWasteGenerationResponse {
  id: number;
  message: string;
  status: string;
}

export interface WasteGenerationFilters {
  commodity_id_eq?: string;
  category_id_eq?: string;
  operational_landlord_id_in?: string;
  date_range?: string;
  created_by_firstname_or_lastname_cont?: string;
  entity_id_eq?: string;
  resource_type_eq?: string;
  status_eq?: string;
  devise_id_cont?: string;
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
      if (filters.created_by_firstname_or_lastname_cont) {
        queryParts.push(`q[created_by_firstname_or_lastname_cont]=${encodeURIComponent(filters.created_by_firstname_or_lastname_cont)}`);
      }
      if (filters.entity_id_eq) {
        queryParts.push(`q[entity_id_eq]=${encodeURIComponent(filters.entity_id_eq)}`);
      }
      if (filters.resource_type_eq) {
        queryParts.push(`q[resource_type_eq]=${encodeURIComponent(filters.resource_type_eq)}`);
      }
      if (filters.status_eq) {
        queryParts.push(`q[status_eq]=${encodeURIComponent(filters.status_eq)}`);
      }
      if (filters.devise_id_cont) {
        queryParts.push(`q[devise_id_cont]=${encodeURIComponent(filters.devise_id_cont)}`);
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

// API function to create a waste generation record with one or more waste
// entries (each entry is a category + commodity with its own list of bag
// weights). Switches to multipart/form-data (bracket-notation keys, files
// under `waste_entries[i][attachments][]`) when any entry carries attachments
// — the same convention used by wasteDispatchAPI.ts / wasteRecycleEntryAPI.ts
// — since a plain JSON body can't carry binary file content.
export const createWasteGeneration = async (
  payload: CreateWasteGenerationPayload
): Promise<CreateWasteGenerationResponse> => {
  const url = getFullUrl('/pms/waste_generations/create_waste');
  const { pms_waste_generation, waste_entries } = payload;

  console.log('Creating waste generation at:', url);
  console.log('Create payload:', payload);

  const hasAttachments = waste_entries.some((entry) => (entry.attachments?.length ?? 0) > 0);

  let response: Response;

  if (hasAttachments) {
    const formData = new FormData();
    Object.entries(pms_waste_generation).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      formData.append(`pms_waste_generation[${key}]`, String(value));
    });

    waste_entries.forEach((entry, index) => {
      formData.append(`waste_entries[${index}][category_id]`, String(entry.category_id));
      formData.append(`waste_entries[${index}][commodity_id]`, String(entry.commodity_id));
      formData.append(`waste_entries[${index}][uom]`, entry.uom);
      entry.values.forEach((value) => formData.append(`waste_entries[${index}][values][]`, String(value)));
      (entry.attachments ?? []).forEach((file) => formData.append(`waste_entries[${index}][attachments][]`, file));
      if (entry.signature) formData.append(`waste_entries[${index}][signature]`, entry.signature);
    });

    // FormData doesn't print its contents via console.log — log the actual
    // key/value pairs being sent so field-level issues (e.g. a param the
    // backend isn't receiving) can be confirmed from the browser console.
    console.log('Create waste generation (multipart) FormData entries:', Array.from(formData.entries()));

    response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
      body: formData,
    });
  } else {
    const options = getAuthenticatedFetchOptions('POST', {
      pms_waste_generation,
      waste_entries: waste_entries.map(({ category_id, commodity_id, uom, values, signature }) => ({
        category_id,
        commodity_id,
        uom,
        values,
        attachments: [],
        signature: signature ?? null,
      })),
    });
    response = await fetch(url, options);
  }

  let data: CreateWasteGenerationResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log('Create waste generation API response:', data);

  if (!response.ok || data?.success === false) {
    throw new Error(extractCreateWasteGenerationErrorMessage(data, `HTTP error! status: ${response.status}`));
  }

  return data ?? {};
};

// Same shape as CreateWasteGenerationPayload — an existing entry carries its
// `id` so the backend can update it in place instead of creating a duplicate;
// entries without an `id` are new rows added during this edit.
export interface UpdateWasteGenerationEntriesPayload {
  pms_waste_generation: {
    wg_date: string;
    vendor_id: number | null;
    operational_landlord_id: number;
    building_id: number;
    wing_id?: number | null;
    area_id?: number | null;
    agency_name: string;
    recycled_unit?: number;
    remark?: string;
  };
  waste_entries: (WasteEntryInput & { id?: number })[];
}

// Updates a waste generation record that has one or more category entries,
// mirroring createWasteGeneration's payload shape and multipart/JSON
// branching (switches to FormData when any entry carries new attachments).
//
// NOTE: the `update_waste` member action is a best guess mirroring
// create_waste's naming convention — there is no confirmed backend contract
// for updating a multi-entry record (the sibling wasteDispatchAPI.ts /
// wasteRecycleEntryAPI.ts only implement create, no update-with-entries).
// If this 404s or silently drops entries, confirm the real endpoint/payload
// with backend and adjust this function accordingly.
export const updateWasteGenerationWithEntries = async (
  id: number,
  payload: UpdateWasteGenerationEntriesPayload
): Promise<CreateWasteGenerationResponse> => {
  const url = getFullUrl(`/pms/waste_generations/${id}/update_waste`);
  const { pms_waste_generation, waste_entries } = payload;

  console.log('Updating waste generation (with entries) at:', url);
  console.log('Update payload:', payload);

  const hasAttachments = waste_entries.some((entry) => (entry.attachments?.length ?? 0) > 0);

  let response: Response;

  if (hasAttachments) {
    const formData = new FormData();
    Object.entries(pms_waste_generation).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      formData.append(`pms_waste_generation[${key}]`, String(value));
    });

    waste_entries.forEach((entry, index) => {
      if (entry.id) formData.append(`waste_entries[${index}][id]`, String(entry.id));
      formData.append(`waste_entries[${index}][category_id]`, String(entry.category_id));
      formData.append(`waste_entries[${index}][commodity_id]`, String(entry.commodity_id));
      formData.append(`waste_entries[${index}][uom]`, entry.uom);
      entry.values.forEach((value) => formData.append(`waste_entries[${index}][values][]`, String(value)));
      (entry.attachments ?? []).forEach((file) => formData.append(`waste_entries[${index}][attachments][]`, file));
      if (entry.signature) formData.append(`waste_entries[${index}][signature]`, entry.signature);
    });

    // FormData doesn't print its contents via console.log — dump the actual
    // key/value pairs so the request can be verified from the browser console.
    console.log('Update waste generation (multipart) FormData entries:', Array.from(formData.entries()));

    response = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: getAuthHeader() },
      body: formData,
    });
  } else {
    const options = getAuthenticatedFetchOptions('PUT', {
      pms_waste_generation,
      waste_entries: waste_entries.map(({ id: entryId, category_id, commodity_id, uom, values, signature }) => ({
        id: entryId,
        category_id,
        commodity_id,
        uom,
        values,
        attachments: [],
        signature: signature ?? null,
      })),
    });
    response = await fetch(url, options);
  }

  let data: CreateWasteGenerationResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log('Update waste generation (with entries) API response:', data);

  if (!response.ok || data?.success === false) {
    throw new Error(extractCreateWasteGenerationErrorMessage(data, `HTTP error! status: ${response.status}`));
  }

  return data ?? {};
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
