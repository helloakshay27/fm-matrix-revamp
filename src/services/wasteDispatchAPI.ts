import { getFullUrl, getAuthHeader, getAuthenticatedFetchOptions } from '../config/apiConfig';

export interface WasteDispatchVendor {
  id: number;
  full_name?: string;
  company_name?: string;
}

export interface WasteDispatchDepartment {
  id: number;
  department_name?: string;
  name?: string;
}

export interface WasteDispatchSite {
  id: number;
  name: string;
}

export interface WasteDispatchUserRef {
  id: number;
  full_name: string;
}

// Per-category breakdown of a waste generation record folded into a dispatch
// (see WasteGenerationCategoryEntry in wasteGenerationAPI.ts for the create-side
// equivalent).
export interface WasteDispatchGenerationCategory {
  category_name: string;
  commodity_name: string;
  uom: string;
  waste_unit: number;
}

export interface WasteDispatchGeneration {
  id: number;
  reference_number?: number;
  wg_date?: string;
  waste_unit?: number;
  categories?: WasteDispatchGenerationCategory[];
}

// Mirrors CreateWasteRecycleEntryPayload['pms_waste_recycle_entry'] in
// wasteRecycleEntryAPI.ts — this is what comes back once a recycle entry has
// been recorded against the dispatch.
export interface WasteDispatchRecycleEntry {
  recycled_quantity_kg?: number | null;
  recycled_quantity_ltr?: number | null;
  recycling_method_kg?: string | null;
  recycling_method_ltr?: string | null;
  recycling_confirmation_date?: string | null;
  recycling_status?: string | null;
  recycling_certificate_no?: string | null;
  confirmed_by_vendor_contact?: string | null;
  comments?: string | null;
}

// A single waste dispatch record, as returned by GET /pms/waste_dispatches.json.
// Field names mirror the pms_waste_dispatch create payload below.
export interface WasteDispatch {
  id: number;
  waste_generation_ids?: number[];
  destination_type: string;
  vendor_id: number;
  vendor?: WasteDispatchVendor;
  source_site_id: number;
  source_site?: WasteDispatchSite;
  source_building_id: number | null;
  source_building?: { id: number; name: string };
  vehicle_number: string;
  driver_name: string | null;
  driver_contact: string | null;
  dispatch_date: string;
  dispatch_weight_kg: number | null;
  disposal_method_kg: string | null;
  dispatch_weight_ltr: number | null;
  disposal_method_ltr: string | null;
  waste_transfer_note: string | null;
  authorized_by_type: string;
  department_id: number | null;
  department?: WasteDispatchDepartment;
  approved_by_id: number | null;
  approved_by?: WasteDispatchUserRef;
  approval_status: string;
  created_by?: WasteDispatchUserRef;
  created_at?: string;
  updated_at?: string;
  resource_id?: number;
  resource_type?: string;
  // Comma-joined category/commodity names and the aggregate waste type across
  // every waste_generation folded into this dispatch.
  total_waste_captured_kg?: number | null;
  total_waste_captured_ltr?: number | null;
  waste_type?: string | null;
  category_names?: string | null;
  commodity_names?: string | null;
  waste_generations?: WasteDispatchGeneration[];
  attachments?: unknown[];
  recycle_entry?: WasteDispatchRecycleEntry | null;
}

export interface WasteDispatchKpis {
  total_dispatch_requests: number;
  hazardous_dispatched: number;
  e_waste_dispatched: number;
  recyclable_dispatched: number;
  general_dispatched: number;
  dry_dispatched: number;
  wet_dispatched: number;
}

export interface WasteDispatchListResponse {
  waste_dispatches: WasteDispatch[];
  pagination?: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
  kpis?: WasteDispatchKpis;
}

// API function to fetch waste dispatches
export const fetchWasteDispatches = async (page: number = 1): Promise<WasteDispatchListResponse> => {
  try {
    const url = getFullUrl(`/pms/waste_dispatches.json?page=${page}`);

    console.log('Fetching waste dispatches from:', url);

    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Waste dispatches API response:', data);

    // Defensively handle whichever shape the backend wraps the list in.
    if (Array.isArray(data)) {
      return { waste_dispatches: data };
    }
    if (Array.isArray(data?.waste_dispatches)) {
      return { waste_dispatches: data.waste_dispatches, pagination: data.pagination, kpis: data.kpis };
    }
    if (Array.isArray(data?.pms_waste_dispatches)) {
      return { waste_dispatches: data.pms_waste_dispatches, pagination: data.pagination, kpis: data.kpis };
    }

    return { waste_dispatches: [] };
  } catch (error) {
    console.error('Error fetching waste dispatches:', error);
    throw error;
  }
};

// API function to fetch a single waste dispatch by id, including its
// per-waste-generation / per-category breakdown and recycle entry (if any).
export const fetchWasteDispatchById = async (id: number): Promise<WasteDispatch> => {
  try {
    const url = getFullUrl(`/pms/waste_dispatches/${id}.json`);

    console.log('Fetching waste dispatch by id from:', url);

    const options = getAuthenticatedFetchOptions('GET');
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Waste dispatch by id API response:', data);

    return data;
  } catch (error) {
    console.error('Error fetching waste dispatch by id:', error);
    throw error;
  }
};

export interface CreateWasteDispatchPayload {
  waste_generation_ids: number[];
  pms_waste_dispatch: {
    destination_type: string;
    vendor_id: number;
    source_site_id: number;
    source_building_id?: number | null;
    vehicle_number: string;
    driver_name?: string;
    driver_contact?: string;
    dispatch_date: string;
    dispatch_weight_kg: number;
    disposal_method_kg: string;
    dispatch_weight_ltr?: number | null;
    disposal_method_ltr?: string | null;
    waste_transfer_note?: string;
    authorized_by_type: string;
    department_id?: number | null;
    approved_by_id?: number | null;
    approval_status: string;
  };
  attachments?: File[];
}

export interface CreateWasteDispatchResponse {
  success?: boolean;
  id?: number;
  message?: string;
  status?: string;
  error?: string;
  errors?: string[] | Record<string, string[]>;
}

const extractErrorMessage = (data: CreateWasteDispatchResponse | null, fallback: string): string => {
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

// API function to create a waste dispatch.
// When attachments are present this switches to multipart/form-data (bracket-
// notation keys, files under `attachments[]`) — the same convention used by
// wasteRecycleEntryAPI.ts / AddPermitPage.tsx elsewhere in this app — since a
// plain JSON body can't carry binary file content.
export const createWasteDispatch = async (
  payload: CreateWasteDispatchPayload
): Promise<CreateWasteDispatchResponse> => {
  const url = getFullUrl('/pms/waste_dispatches.json');
  const { waste_generation_ids, pms_waste_dispatch, attachments } = payload;

  console.log('Creating waste dispatch at:', url);
  console.log('Create waste dispatch payload:', payload);

  let response: Response;

  if (attachments && attachments.length > 0) {
    const formData = new FormData();
    waste_generation_ids.forEach((id) => formData.append('waste_generation_ids[]', String(id)));
    Object.entries(pms_waste_dispatch).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      formData.append(`pms_waste_dispatch[${key}]`, String(value));
    });
    attachments.forEach((file) => formData.append('attachments[]', file));

    response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
      body: formData,
    });
  } else {
    const options = getAuthenticatedFetchOptions('POST', {
      waste_generation_ids,
      pms_waste_dispatch,
      attachments: [],
    });
    response = await fetch(url, options);
  }

  let data: CreateWasteDispatchResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log('Create waste dispatch API response:', data);

  if (!response.ok || data?.success === false) {
    throw new Error(extractErrorMessage(data, `HTTP error! status: ${response.status}`));
  }

  return data ?? {};
};
