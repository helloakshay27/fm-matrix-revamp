// Where the user is in the amenity booking list (page and applied filters) is
// kept in the URL query string, e.g. ?view=list&page=3&status=Confirmed.
// The browser Back button then returns to the same page after opening a
// booking, instead of the list starting over on page 1.

export interface AmenityBookingListUrlState {
  page: number;
  facilityName: string;
  status: string;
  // yyyy-MM-dd, the same format as the date inputs
  scheduledFrom: string;
  scheduledTo: string;
  createdFrom: string;
  createdTo: string;
}

const PARAM = {
  page: "page",
  facilityName: "facility",
  status: "status",
  scheduledFrom: "sched_from",
  scheduledTo: "sched_to",
  createdFrom: "created_from",
  createdTo: "created_to",
} as const;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

// Only real calendar dates are accepted: the page formats these with date-fns,
// which throws on an invalid date.
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

export function readListUrlState(params: URLSearchParams): AmenityBookingListUrlState {
  const page = parseInt(params.get(PARAM.page) ?? "", 10);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    facilityName: params.get(PARAM.facilityName) ?? "",
    status: params.get(PARAM.status) ?? "",
    scheduledFrom: dateParam(params, PARAM.scheduledFrom),
    scheduledTo: dateParam(params, PARAM.scheduledTo),
    createdFrom: dateParam(params, PARAM.createdFrom),
    createdTo: dateParam(params, PARAM.createdTo),
  };
}

// Returns a copy of `params` with the list state written in. Empty values (and
// page 1) are removed so the URL stays clean; other params (e.g. `view`) are kept.
export function writeListUrlState(
  params: URLSearchParams,
  state: AmenityBookingListUrlState
): URLSearchParams {
  const next = new URLSearchParams(params);
  const put = (key: string, value: string) => (value ? next.set(key, value) : next.delete(key));

  put(PARAM.page, state.page > 1 ? String(state.page) : "");
  put(PARAM.facilityName, state.facilityName);
  put(PARAM.status, state.status);
  put(PARAM.scheduledFrom, state.scheduledFrom);
  put(PARAM.scheduledTo, state.scheduledTo);
  put(PARAM.createdFrom, state.createdFrom);
  put(PARAM.createdTo, state.createdTo);
  return next;
}
