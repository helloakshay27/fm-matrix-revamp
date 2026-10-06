export const TRANSPORT_SUPPLIERS_PAGE_SIZE = 20;
export const TRANSPORT_SUPPLIERS_TABLE_STORAGE_KEY = "transport-suppliers-table";
export const TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX = "transport-suppliers";
export const TRANSPORT_SUPPLIERS_LIST_PATH = "/settings/transport/suppliers";
export const transportSupplierDetailsPath = (id: number | string) =>
  `${TRANSPORT_SUPPLIERS_LIST_PATH}/${id}`;
