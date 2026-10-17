import { transportClient } from "./transportClient";
import type {
  CreateTransportSlabPayload,
  TransportSlab,
  UpdateTransportSlabPayload,
} from "../types/transportSlab";

// Confirmed via curl: returns the supplier's slabs as a flat array.
export const fetchSupplierSlabs = async (supplierId: number): Promise<TransportSlab[]> => {
  const { data } = await transportClient.get<TransportSlab[]>(
    `/transport/suppliers/${supplierId}/transportation_slabs.json`
  );
  return Array.isArray(data) ? data : [];
};

// Confirmed via curl: POST with { transportation_slab: {...} }.
export const createSupplierSlab = async ({
  supplierId,
  payload,
}: {
  supplierId: number;
  payload: CreateTransportSlabPayload;
}): Promise<TransportSlab> => {
  const { data } = await transportClient.post<TransportSlab>(
    `/transport/suppliers/${supplierId}/transportation_slabs.json`,
    { transportation_slab: payload }
  );
  return data;
};

// No curl was provided for update — assumes the standard Rails nested
// member route (PUT .../transportation_slabs/:id.json) with the same
// { transportation_slab: {...} } body as create. Verify against the live API.
export const updateSupplierSlab = async ({
  supplierId,
  slabId,
  payload,
}: {
  supplierId: number;
  slabId: number;
  payload: UpdateTransportSlabPayload;
}): Promise<TransportSlab> => {
  const { data } = await transportClient.put<TransportSlab>(
    `/transport/suppliers/${supplierId}/transportation_slabs/${slabId}.json`,
    { transportation_slab: payload }
  );
  return data;
};
