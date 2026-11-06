import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

// Inspection management dashboard APIs (GET /vi_inspection_dashboard/*). Base URL and token come from
// the logged-in session (getFullUrl / getAuthHeader), company id from localStorage — as on the
// M-Safe dashboard.

export interface FilterOption {
  id: string;
  name: string;
}

/** Filter values sent with every data request once the user clicks Apply. */
export interface InspectionDashboardFilters {
  clusterIds: string[];
  functionIds: string[];
  zoneIds: string[];
  workLocationIds: string[];
  inspectionTypeIds: string[];
  /** YYYY-MM-DD (date input value); sent as DD-MM-YYYY. */
  dateFrom: string;
  dateTo: string;
}

export interface InspectionKpi {
  total_inspections: number;
  total_observations: number;
  capa_planned: number;
  capa_closed: number;
}

export interface SpocPendingPlans {
  total_pending: number;
  spocs: {
    spoc_id: number;
    spoc_name: string;
    total_no_count: number;
    pending_plan_count: number;
    pending_inspection_count: number;
    pending_percentage: number;
  }[];
}

export interface ActionOwnerOpenPlans {
  total_open: number;
  action_owners: {
    action_owner_id: number;
    action_owner_name: string;
    total_action_count: number;
    open_action_count: number;
    overdue_action_count: number;
    open_inspection_count: number;
    circles?: { id: number; name: string }[];
  }[];
}

export interface ClosureCounts {
  sites_mapped: number;
  inspections_completed: number;
  observations: number;
  capa_planned: number;
  capa_closed: number;
}

export interface ClosureProgress {
  group_by: string;
  checksheets: {
    checksheet: string;
    inspection_type_id: number;
    rows: (ClosureCounts & { id: number; name: string })[];
    totals: ClosureCounts;
  }[];
}

const companyId = () => localStorage.getItem("selectedCompanyId") || localStorage.getItem("company_id") || "";

const toApiDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : "";
};

const filterParams = (f: InspectionDashboardFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  // Multiple selections go as comma-separated ids, e.g. cluster_id=35,29.
  if (f.clusterIds.length) params.cluster_id = f.clusterIds.join(",");
  if (f.functionIds.length) params.function_id = f.functionIds.join(",");
  if (f.zoneIds.length) params.zone_id = f.zoneIds.join(",");
  if (f.workLocationIds.length) params.work_location_id = f.workLocationIds.join(",");
  if (f.inspectionTypeIds.length) params.inspection_type_id = f.inspectionTypeIds.join(",");
  if (f.dateFrom) params.from_date = toApiDate(f.dateFrom);
  if (f.dateTo) params.to_date = toApiDate(f.dateTo);
  return params;
};

async function fetchDashboard<T>(endpoint: string, extra: Record<string, string>, signal: AbortSignal): Promise<T> {
  const params = new URLSearchParams(extra);
  const company = companyId();
  if (company) params.set("company_id", company);
  const response = await fetch(getFullUrl(`/vi_inspection_dashboard/${endpoint}?${params.toString()}`), {
    headers: { Authorization: getAuthHeader() },
    signal,
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

const toOptions = (items: unknown, idKey: string, label: (item: Record<string, unknown>) => string): FilterOption[] =>
  (Array.isArray(items) ? (items as Record<string, unknown>[]) : [])
    .map((item) => ({ id: String(item[idKey] ?? ""), name: label(item) }))
    .filter((option) => option.id && option.name);

export interface InspectionFilterOptions {
  circles: FilterOption[];
  functions: FilterOption[];
  zones: FilterOption[];
  workLocations: FilterOption[];
  inspectionTypes: FilterOption[];
  /** Option lists whose request has finished (successfully or not). */
  loaded: Partial<Record<FilterOptionKey, boolean>>;
}

export type FilterOptionKey = "circles" | "functions" | "zones" | "workLocations" | "inspectionTypes";

const EMPTY_OPTIONS: InspectionFilterOptions = { circles: [], functions: [], zones: [], workLocations: [], inspectionTypes: [], loaded: {} };

/** Dropdown options for the filter bar (loaded once). */
export const useInspectionFilterOptions = () => {
  const [options, setOptions] = useState<InspectionFilterOptions>(EMPTY_OPTIONS);

  useEffect(() => {
    const controller = new AbortController();
    const load = async (key: FilterOptionKey, endpoint: string, map: (json: Record<string, unknown>) => FilterOption[]) => {
      let list: FilterOption[] = [];
      try {
        list = map(await fetchDashboard<Record<string, unknown>>(endpoint, {}, controller.signal));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(`Failed to load ${endpoint}:`, error);
      }
      setOptions((current) => ({ ...current, [key]: list, loaded: { ...current.loaded, [key]: true } }));
    };
    load("circles", "cluster_filter", (json) => toOptions(json.clusters, "id", (item) => String(item.cluster_name ?? "")));
    load("functions", "function_filter", (json) => toOptions(json.functions, "id", (item) => String(item.function_name ?? "")));
    load("zones", "zone_filter", (json) => toOptions(json.zones, "id", (item) => String(item.zone_name ?? "")));
    // Several work locations share a name, so the code is shown with it.
    load("workLocations", "work_location_filter", (json) =>
      toOptions(json.work_locations, "id", (item) =>
        item.work_location_code ? `${item.work_location_name ?? ""} (${item.work_location_code})` : String(item.work_location_name ?? ""),
      ),
    );
    load("inspectionTypes", "inspection_type_filter", (json) => toOptions(json.inspection_types, "id", (item) => String(item.inspection_type_name ?? "")));
    return () => controller.abort();
  }, []);

  return options;
};

export interface InspectionDashboardData {
  kpi: InspectionKpi | null;
  spoc: SpocPendingPlans | null;
  owners: ActionOwnerOpenPlans | null;
  closure: ClosureProgress | null;
}

/** KPI, leaderboard and closure-progress data for the applied filters. */
export const useInspectionDashboardData = (filters: InspectionDashboardFilters) => {
  const [data, setData] = useState<InspectionDashboardData>({ kpi: null, spoc: null, owners: null, closure: null });
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(filters);

  useEffect(() => {
    const controller = new AbortController();
    const params = filterParams(JSON.parse(key) as InspectionDashboardFilters);
    const get = <T,>(endpoint: string) => fetchDashboard<T>(endpoint, params, controller.signal).catch((error) => {
      if (!controller.signal.aborted) console.error(`Failed to load ${endpoint}:`, error);
      return null;
    });
    setLoading(true);
    Promise.all([
      get<{ kpi: InspectionKpi }>("kpi"),
      get<SpocPendingPlans>("spoc_pending_plans"),
      get<ActionOwnerOpenPlans>("action_owner_open_plans"),
      get<ClosureProgress>("closure_progress_by_circle"),
    ]).then(([kpi, spoc, owners, closure]) => {
      if (controller.signal.aborted) return;
      if (!kpi && !spoc && !owners && !closure) toast.error("Failed to load inspection dashboard");
      setData({ kpi: kpi?.kpi ?? null, spoc, owners, closure });
      setLoading(false);
    });
    return () => controller.abort();
  }, [key]);

  return { ...data, loading };
};
