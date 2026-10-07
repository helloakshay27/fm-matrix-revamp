import { transportClient } from "./transportClient";
import type {
  CreateTransportSupplierPayload,
  TransportSupplier,
  TransportSupplierDetail,
  UpdateTransportSupplierPayload,
} from "../types/transportSupplier";

// Confirmed via curl: GET /transport/suppliers returns the full list as a
// flat array (no pagination), so paging/search are done client-side.
export const fetchTransportSuppliers = async (): Promise<TransportSupplier[]> => {
  const { data } = await transportClient.get<TransportSupplier[]>(
    "/transport/suppliers.json"
  );
  return Array.isArray(data) ? data : [];
};

// Confirmed via sample response: returns the supplier flat, no wrapper key.
export const fetchTransportSupplierDetail = async (
  id: number
): Promise<TransportSupplierDetail> => {
  const { data } = await transportClient.get<TransportSupplierDetail>(
    `/transport/suppliers/${id}.json`
  );
  return data;
};

// Confirmed via curl: POST /transport/suppliers with { supplier: {...} }.
export const createTransportSupplier = async (
  payload: CreateTransportSupplierPayload
): Promise<TransportSupplier> => {
  const { data } = await transportClient.post<TransportSupplier>(
    "/transport/suppliers.json",
    { supplier: payload }
  );
  return data;
};

// No curl was provided for update — assumes the standard Rails convention
// (PUT to the member route, same { supplier: {...} } body as create).
// Verify against the live API.
export const updateTransportSupplier = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateTransportSupplierPayload;
}): Promise<TransportSupplierDetail> => {
  const { data } = await transportClient.put<TransportSupplierDetail>(
    `/transport/suppliers/${id}.json`,
    { supplier: payload }
  );
  return data;
};
