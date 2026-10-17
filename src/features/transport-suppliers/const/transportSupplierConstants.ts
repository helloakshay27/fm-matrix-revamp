export const TRANSPORT_SUPPLIERS_PAGE_SIZE = 20;
export const TRANSPORT_SUPPLIERS_TABLE_STORAGE_KEY = "transport-suppliers-table";
export const TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX = "transport-suppliers";
export const SUPPLIER_DETAIL_TABS = ["details", "slab", "drivers", "vehicles"] as const;
export type SupplierDetailTab = (typeof SUPPLIER_DETAIL_TABS)[number];

export const TRANSPORT_SUPPLIERS_LIST_PATH = "/settings/transport/suppliers";
export const transportSupplierDetailsPath = (id: number | string) =>
  `${TRANSPORT_SUPPLIERS_LIST_PATH}/${id}`;

export const SUPPLIER_DRIVERS_PAGE_SIZE = 10;
export const SUPPLIER_DRIVERS_TABLE_STORAGE_KEY = "transport-supplier-drivers-table";

export const SUPPLIER_SLABS_PAGE_SIZE = 10;
export const SUPPLIER_SLABS_TABLE_STORAGE_KEY = "transport-supplier-slabs-table";

// Only "km" is confirmed by the API so far — add other bases here once known.
export const SLAB_RATE_BASIS_OPTIONS = [{ value: "km", label: "Per KM" }];

export const SUPPLIER_VEHICLES_PAGE_SIZE = 10;
export const SUPPLIER_VEHICLES_TABLE_STORAGE_KEY = "transport-supplier-vehicles-table";

// Only "diesel" is confirmed by the API so far — the rest are the usual values;
// verify them against the backend enum.
export const VEHICLE_FUEL_TYPE_OPTIONS = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "cng", label: "CNG" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];
