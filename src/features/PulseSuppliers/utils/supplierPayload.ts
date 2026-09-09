import type { CreateSupplierPayload, Supplier } from "../types/supplier";

// Rebuilds a full pms_supplier payload from an existing record, so callers
// that only want to change one field (e.g. the Active toggle in the list
// page) don't have to re-collect the rest through the form.
export function buildSupplierPayloadFromRecord(
  supplier: Supplier,
  overrides: Partial<CreateSupplierPayload["pms_supplier"]> = {}
): CreateSupplierPayload["pms_supplier"] {
  return {
    first_name: supplier.first_name ?? "",
    last_name: supplier.last_name ?? "",
    email: supplier.email ?? "",
    company_name: supplier.company_name ?? "",
    mobile1: supplier.mobile1 ?? "",
    ...(supplier.mobile2 ? { mobile2: supplier.mobile2 } : {}),
    ...(supplier.gstin_number ? { gstin_number: supplier.gstin_number } : {}),
    ...(supplier.pan_number ? { pan_number: supplier.pan_number } : {}),
    ...(supplier.address ? { address: supplier.address } : {}),
    ...(supplier.address2 ? { address2: supplier.address2 } : {}),
    ...(supplier.country ? { country: supplier.country } : {}),
    ...(supplier.state ? { state: supplier.state } : {}),
    ...(supplier.city ? { city: supplier.city } : {}),
    ...(supplier.pincode ? { pincode: supplier.pincode } : {}),
    category: supplier.category ?? "",
    active: supplier.active,
    supplier_type: supplier.supplier_type ?? [],
    ...overrides,
  };
}
