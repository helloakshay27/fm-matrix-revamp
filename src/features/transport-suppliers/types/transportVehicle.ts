// GET /transport/suppliers/:supplierId/vehicles(.json) — assumed to be a flat array
// like drivers. The record shape mirrors the create payload; `driver` and
// `attachments` are read defensively since no sample response was provided yet.
export interface TransportVehicleAttachment {
  id?: number;
  url?: string | null;
  document_url?: string | null;
  file_name?: string | null;
}

export interface TransportVehicle {
  id: number;
  driver_id: number | null;
  car_model_name: string | null;
  registration_number: string | null;
  colour: string | null;
  seats: number | null;
  fuel_type: string | null;
  active: boolean;
  driver?: {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
  } | null;
  attachments?: TransportVehicleAttachment[];
}

// GET .../vehicles supports ?active=true and ?driver_id=5.
export interface SupplierVehicleFilters {
  active?: boolean;
  driverId?: number;
}

// POST .../vehicles — multipart: `vehicle[...]` fields plus `attachments[]` images.
export interface CreateTransportVehiclePayload {
  driver_id: number;
  car_model_name: string;
  registration_number: string;
  colour: string;
  seats: number;
  fuel_type: string;
}

// PATCH .../vehicles/:id — JSON `{ vehicle: {...} }`. No driver_id and no attachments.
export type UpdateTransportVehiclePayload = Omit<CreateTransportVehiclePayload, "driver_id">;
