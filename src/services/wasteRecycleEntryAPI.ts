import { getFullUrl, getAuthHeader, getAuthenticatedFetchOptions } from '../config/apiConfig';

export interface CreateWasteRecycleEntryPayload {
  waste_dispatch_id: number;
  pms_waste_recycle_entry: {
    recycled_quantity_kg?: number | null;
    recycled_quantity_ltr?: number | null;
    recycling_method_kg?: string | null;
    recycling_method_ltr?: string | null;
    recycling_confirmation_date: string;
    recycling_status: string;
    recycling_certificate_no?: string | null;
    confirmed_by_vendor_contact?: string | null;
    comments?: string | null;
  };
  attachments?: File[];
}

export interface CreateWasteRecycleEntryResponse {
  success?: boolean;
  id?: number;
  message?: string;
  status?: string;
  error?: string;
  errors?: string[] | Record<string, string[]>;
}

const extractErrorMessage = (data: CreateWasteRecycleEntryResponse | null, fallback: string): string => {
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

// API function to create a waste recycle entry against a dispatch.
// When attachments are present this switches to multipart/form-data (bracket-
// notation keys, files under `attachments[]`) — the same convention used by
// AddPermitPage.tsx / AddAssetPage.tsx elsewhere in this app — since a plain
// JSON body can't carry binary file content.
export const createWasteRecycleEntry = async (
  payload: CreateWasteRecycleEntryPayload
): Promise<CreateWasteRecycleEntryResponse> => {
  const url = getFullUrl('/pms/waste_recycle_entries.json');
  const { waste_dispatch_id, pms_waste_recycle_entry, attachments } = payload;

  console.log('Creating waste recycle entry at:', url);
  console.log('Create waste recycle entry payload:', payload);

  let response: Response;

  if (attachments && attachments.length > 0) {
    const formData = new FormData();
    formData.append('waste_dispatch_id', String(waste_dispatch_id));
    Object.entries(pms_waste_recycle_entry).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      formData.append(`pms_waste_recycle_entry[${key}]`, String(value));
    });
    attachments.forEach((file) => formData.append('attachments[]', file));

    response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: getAuthHeader() },
      body: formData,
    });
  } else {
    const options = getAuthenticatedFetchOptions('POST', {
      waste_dispatch_id,
      pms_waste_recycle_entry,
      attachments: [],
    });
    response = await fetch(url, options);
  }

  let data: CreateWasteRecycleEntryResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log('Create waste recycle entry API response:', data);

  if (!response.ok || data?.success === false) {
    throw new Error(extractErrorMessage(data, `HTTP error! status: ${response.status}`));
  }

  return data ?? {};
};
