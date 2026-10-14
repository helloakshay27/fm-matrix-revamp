import { transportClient } from "./transportClient";
import type {
  CreateTransportDriverPayload,
  TransportDriver,
  UpdateTransportDriverPayload,
} from "../types/transportDriver";

// Confirmed via curl: returns the supplier's drivers as a flat array.
export const fetchSupplierDrivers = async (supplierId: number): Promise<TransportDriver[]> => {
  const { data } = await transportClient.get<TransportDriver[]>(
    `/transport/suppliers/${supplierId}/drivers.json`
  );
  return Array.isArray(data) ? data : [];
};

// Confirmed via curl: POST with { driver: {...} }.
export const createSupplierDriver = async ({
  supplierId,
  payload,
}: {
  supplierId: number;
  payload: CreateTransportDriverPayload;
}): Promise<TransportDriver> => {
  const { data } = await transportClient.post<TransportDriver>(
    `/transport/suppliers/${supplierId}/drivers.json`,
    { driver: payload }
  );
  return data;
};

// No curl was provided for the route — assumes the standard Rails nested
// member route (PUT .../drivers/:id.json) with the same { driver: {...} }
// body as create. Verify against the live API.
export const updateSupplierDriver = async ({
  supplierId,
  driverId,
  payload,
}: {
  supplierId: number;
  driverId: number;
  payload: UpdateTransportDriverPayload;
}): Promise<TransportDriver> => {
  const { data } = await transportClient.put<TransportDriver>(
    `/transport/suppliers/${supplierId}/drivers/${driverId}.json`,
    { driver: payload }
  );
  return data;
};
