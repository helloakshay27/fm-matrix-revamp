import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import type {
  CreateSupplierPayload,
  CreateSupplierResponse,
  Supplier,
  SuppliersQueryParams,
  SuppliersResponse,
  UpdateSupplierPayload,
  UpdateSupplierResponse,
} from "../types/supplier";

const PULSE_BASE_URL = `https://${localStorage.getItem("baseUrl")}`;

const suppliersClient = axios.create({ baseURL: PULSE_BASE_URL });

// Mirrors the token injection pattern used in customNotificationsApi.ts.
suppliersClient.interceptors.request.use((config) => {
  const token = API_CONFIG.TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Confirmed via curl (2026-08-28).
export const fetchSuppliers = async (
  params: SuppliersQueryParams
): Promise<SuppliersResponse> => {
  const { data } = await suppliersClient.get<SuppliersResponse>("/pms/suppliers.json", {
    params,
  });
  return data;
};

// Confirmed via curl (2026-08-28) — returns the supplier object directly,
// no wrapper key (unlike the list endpoint's `pms_suppliers` array).
export const fetchSupplierDetail = async (id: number): Promise<Supplier> => {
  const { data } = await suppliersClient.get<Supplier>(`/pms/suppliers/${id}.json`);
  return data;
};

// Confirmed via actual response (2026-08-28) — returns the created supplier
// flat, with no `pms_supplier` wrapper.
export const createSupplier = async (
  payload: CreateSupplierPayload
): Promise<CreateSupplierResponse> => {
  const { data } = await suppliersClient.post<CreateSupplierResponse>(
    "/pms/suppliers.json",
    payload
  );
  return data;
};

// Unconfirmed — mirrors the update pattern used for custom_notifications
// (same body shape as create, PUT to the member route).
export const updateSupplier = async (
  id: number,
  payload: UpdateSupplierPayload
): Promise<UpdateSupplierResponse> => {
  const { data } = await suppliersClient.put<UpdateSupplierResponse>(
    `/pms/suppliers/${id}.json`,
    payload
  );
  return data;
};
