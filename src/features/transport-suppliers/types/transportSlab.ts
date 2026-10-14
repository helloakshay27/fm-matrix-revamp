// GET /transport/suppliers/:supplierId/transportation_slabs.json — flat
// array, no wrapper key and no pagination metadata.
export interface TransportSlab {
  id: number;
  name: string | null;
  resource_type: string;
  resource_id: number;
  created_by_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  // Only "km" seen so far.
  rate_basis: string | null;
  // Decimals arrive as strings ("12.5", "800.0").
  rate_amount: string | null;
  max_rides_per_day: number | null;
  max_km_per_day: string | null;
  effective_from: string | null;
  effective_to: string | null;
  available_24_7: boolean;
  // Hours/minutes are only set when available_24_7 is false.
  availability_start_hour: number | null;
  availability_start_min: number | null;
  availability_end_hour: number | null;
  availability_end_min: number | null;
  organization_id: number | null;
}

// POST /transport/suppliers/:supplierId/transportation_slabs.json — body
// wrapped in `transportation_slab`; numbers are sent as numbers.
export interface CreateTransportSlabPayload {
  rate_basis: string;
  rate_amount: number;
  max_rides_per_day?: number;
  max_km_per_day?: number;
  effective_from: string;
  // Not in the sample curl, but present on the list response — sent only
  // when filled in.
  effective_to?: string;
  available_24_7: boolean;
  availability_start_hour?: number;
  availability_start_min?: number;
  availability_end_hour?: number;
  availability_end_min?: number;
}

// Same body as create, but optional fields are always sent — null clears a
// value that was removed in the form (e.g. switching back to 24/7).
export interface UpdateTransportSlabPayload {
  rate_basis: string;
  rate_amount: number;
  max_rides_per_day: number | null;
  max_km_per_day: number | null;
  effective_from: string;
  effective_to: string | null;
  available_24_7: boolean;
  availability_start_hour: number | null;
  availability_start_min: number | null;
  availability_end_hour: number | null;
  availability_end_min: number | null;
}
