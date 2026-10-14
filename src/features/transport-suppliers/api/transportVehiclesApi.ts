import { transportClient } from "./transportClient";
import type {
  CreateTransportVehiclePayload,
  SupplierVehicleFilters,
  TransportVehicle,
  UpdateTransportVehiclePayload,
} from "../types/transportVehicle";

const vehiclesPath = (supplierId: number) => `/transport/suppliers/${supplierId}/vehicles`;

// Some endpoints may wrap the record (`{ vehicle: {...} }`) — accept either.
const unwrapVehicle = (data: unknown): TransportVehicle =>
  (data && typeof data === "object" && "vehicle" in data
    ? (data as { vehicle: TransportVehicle }).vehicle
    : data) as TransportVehicle;

// GET .../vehicles (?active=true, ?driver_id=5). Assumed flat array like drivers;
// a `{ vehicles: [...] }` wrapper is also accepted.
export const fetchSupplierVehicles = async (
  supplierId: number,
  filters: SupplierVehicleFilters = {}
): Promise<TransportVehicle[]> => {
  const params: Record<string, string | number | boolean> = {};
  if (filters.active) params.active = true;
  if (filters.driverId != null) params.driver_id = filters.driverId;

  const { data } = await transportClient.get<unknown>(`${vehiclesPath(supplierId)}.json`, { params });
  if (Array.isArray(data)) return data as TransportVehicle[];
  const wrapped = (data as { vehicles?: TransportVehicle[] } | null)?.vehicles;
  return Array.isArray(wrapped) ? wrapped : [];
};

// GET .../vehicles/:id
export const fetchSupplierVehicle = async (
  supplierId: number,
  vehicleId: number
): Promise<TransportVehicle> => {
  const { data } = await transportClient.get<unknown>(`${vehiclesPath(supplierId)}/${vehicleId}.json`);
  return unwrapVehicle(data);
};

// GET .../vehicles/check — query params not specified yet; assumed to check a
// registration number for duplicates. Returns the raw body for the caller to read.
export const checkSupplierVehicle = async (
  supplierId: number,
  registrationNumber: string
): Promise<Record<string, unknown>> => {
  const { data } = await transportClient.get<Record<string, unknown>>(
    `${vehiclesPath(supplierId)}/check.json`,
    { params: { registration_number: registrationNumber } }
  );
  return data ?? {};
};

// POST .../vehicles — multipart so the vehicle images can go up in the same request.
export const createSupplierVehicle = async ({
  supplierId,
  payload,
  attachments,
}: {
  supplierId: number;
  payload: CreateTransportVehiclePayload;
  attachments: File[];
}): Promise<TransportVehicle> => {
  const body = new FormData();
  Object.entries(payload).forEach(([key, value]) => body.append(`vehicle[${key}]`, String(value)));
  attachments.forEach((file) => body.append("attachments[]", file));

  const { data } = await transportClient.post<unknown>(`${vehiclesPath(supplierId)}.json`, body);
  return unwrapVehicle(data);
};

// PATCH .../vehicles/:id with { vehicle: {...} }.
export const updateSupplierVehicle = async ({
  supplierId,
  vehicleId,
  payload,
}: {
  supplierId: number;
  vehicleId: number;
  payload: UpdateTransportVehiclePayload;
}): Promise<TransportVehicle> => {
  const { data } = await transportClient.patch<unknown>(
    `${vehiclesPath(supplierId)}/${vehicleId}.json`,
    { vehicle: payload }
  );
  return unwrapVehicle(data);
};

// PATCH .../vehicles/:id/activate | /deactivate
export const setSupplierVehicleActive = async ({
  supplierId,
  vehicleId,
  active,
}: {
  supplierId: number;
  vehicleId: number;
  active: boolean;
}): Promise<void> => {
  await transportClient.patch(
    `${vehiclesPath(supplierId)}/${vehicleId}/${active ? "activate" : "deactivate"}.json`
  );
};
