// Where the user is in the Lock Account Bills list (page, page size, search and
// filters) is kept in the URL query string, e.g. ?page=3&status=Paid&q=INV-12.
// The browser Back button then returns to the same page after opening a bill,
// instead of the list starting over on page 1 with no filters.

export interface LockAccountBillsListUrlState {
  page: number;
  perPage: number;
  search: string;
  resourceType: string; // "all" or a resource type
  status: string; // "all" or a bill status
  fromDate: string; // yyyy-MM-dd, or ""
  toDate: string; // yyyy-MM-dd, or ""
  facilityBookingStatus: string; // "all" or a facility booking status
  nonZeroOnly: boolean;
}

// Values the page's controls can produce. Anything else in the URL is ignored,
// so a stale or hand-edited link cannot leave a Select showing a blank value.
export interface LockAccountBillsUrlOptions {
  resourceTypes: readonly string[];
  statuses: readonly string[];
  facilityBookingStatuses: readonly string[];
  perPageOptions: readonly number[];
}

export const DEFAULT_PER_PAGE = 10;

const PARAM = {
  page: "page",
  perPage: "per_page",
  search: "q",
  resourceType: "resource_type",
  status: "status",
  fromDate: "from",
  toDate: "to",
  facilityBookingStatus: "fb_status",
  nonZeroOnly: "non_zero",
} as const;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const dateParam = (params: URLSearchParams, key: string) => {
  const value = params.get(key) ?? "";
  const match = DATE_ONLY.exec(value);
  if (!match) return "";
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  const isReal =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isReal ? value : "";
};

const oneOf = (params: URLSearchParams, key: string, allowed: readonly string[]) => {
  const value = params.get(key);
  return value && allowed.includes(value) ? value : "all";
};

export function readLockBillsUrlState(
  params: URLSearchParams,
  options: LockAccountBillsUrlOptions
): LockAccountBillsListUrlState {
  const page = parseInt(params.get(PARAM.page) ?? "", 10);
  const perPage = parseInt(params.get(PARAM.perPage) ?? "", 10);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    perPage: options.perPageOptions.includes(perPage) ? perPage : DEFAULT_PER_PAGE,
    search: params.get(PARAM.search) ?? "",
    resourceType: oneOf(params, PARAM.resourceType, options.resourceTypes),
    status: oneOf(params, PARAM.status, options.statuses),
    fromDate: dateParam(params, PARAM.fromDate),
    toDate: dateParam(params, PARAM.toDate),
    facilityBookingStatus: oneOf(params, PARAM.facilityBookingStatus, options.facilityBookingStatuses),
    nonZeroOnly: params.get(PARAM.nonZeroOnly) === "1",
  };
}

// Returns a copy of `params` with the list state written in. Default values are
// removed so the URL stays clean; other params are kept.
export function writeLockBillsUrlState(
  params: URLSearchParams,
  state: LockAccountBillsListUrlState
): URLSearchParams {
  const next = new URLSearchParams(params);
  const put = (key: string, value: string) => (value ? next.set(key, value) : next.delete(key));
  const unlessAll = (value: string) => (value === "all" ? "" : value);

  put(PARAM.page, state.page > 1 ? String(state.page) : "");
  put(PARAM.perPage, state.perPage !== DEFAULT_PER_PAGE ? String(state.perPage) : "");
  put(PARAM.search, state.search);
  put(PARAM.resourceType, unlessAll(state.resourceType));
  put(PARAM.status, unlessAll(state.status));
  put(PARAM.fromDate, state.fromDate);
  put(PARAM.toDate, state.toDate);
  put(PARAM.facilityBookingStatus, unlessAll(state.facilityBookingStatus));
  put(PARAM.nonZeroOnly, state.nonZeroOnly ? "1" : "");
  return next;
}
