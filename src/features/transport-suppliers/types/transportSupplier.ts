// GET /transport/suppliers — response is a flat array, no wrapper key and
// no pagination metadata.
export interface TransportSupplier {
  id: number;
  company_name: string | null;
  email: string | null;
  mobile1: string | null;
  active: boolean;
  created_at: string;
}

// POST /transport/suppliers — body is wrapped in a `supplier` key.
export interface CreateTransportSupplierPayload {
  company_name: string;
  email: string;
  mobile1: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

// GET /transport/suppliers/:id.json — returned flat, no wrapper key.
export interface TransportSupplierDetail {
  id: number;
  company_name: string | null;
  email: string | null;
  mobile1: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  active: boolean;
  // Always null in the sample response — shape not known yet.
  current_transportation_slab: unknown | null;
}

// Partial so the list's status toggle can send just { active }.
export type UpdateTransportSupplierPayload = Partial<CreateTransportSupplierPayload> & {
  active?: boolean;
};
