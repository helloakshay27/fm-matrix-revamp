// GET /transport/suppliers/:supplierId/drivers.json — flat array, no
// wrapper key and no pagination metadata.
export interface TransportDriver {
  id: number;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  mobile: string | null;
  // 0/0 is sent when the driver has no known location.
  latitude: number | null;
  longitude: number | null;
  active: boolean;
}

// POST /transport/suppliers/:supplierId/drivers.json — body wrapped in `driver`.
export interface CreateTransportDriverPayload {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
}

// Update sends the same fields as create plus the location, as strings
// (e.g. "18.5308"). Location keys are omitted when left blank.
export interface UpdateTransportDriverPayload extends CreateTransportDriverPayload {
  latitude?: string;
  longitude?: string;
}
