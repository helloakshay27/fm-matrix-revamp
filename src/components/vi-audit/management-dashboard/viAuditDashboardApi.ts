import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { OBS_JOURNEY_COLORS, type ChartSpec } from "./data";

// Audit management dashboard APIs (GET /audit_dashboard/*). Base URL and token come from the
// logged-in session (getFullUrl / getAuthHeader), company id from localStorage — same pattern as
// the VI inspection management dashboard.

export interface FilterOption {
  id: string;
  name: string;
}

/** Filter values sent with every data request once the user clicks Apply. */
export interface AuditDashboardFilters {
  clusterIds: string[];
  functionIds: string[];
  zoneIds: string[];
  workLocationIds: string[];
  /** "corporate" | "circle". Empty or both means no audit_type filter. */
  auditTypeIds: string[];
  /** YYYY-MM-DD (date input value); sent as DD-MM-YYYY. */
  dateFrom: string;
  dateTo: string;
}

export interface AuditKpi {
  total_audits: number;
  open_audits: number;
  closed_audits: number;
  total_observations: number;
  total_actions: number;
  pending_action_plan_by_spoc: number;
  capa_plan_started: number;
  action_pending_by_action_owner: number;
  action_taken_closed_by_action_owner: number;
}

export const KPI_FIELD: Record<string, keyof AuditKpi | undefined> = {
  "kpi-total": "total_audits",
  "kpi-open": "open_audits",
  "kpi-closed": "closed_audits",
  "kpi-obs": "total_observations",
  "kpi-spoc": "pending_action_plan_by_spoc",
  "kpi-started": "capa_plan_started",
  "kpi-actions": "total_actions",
  "kpi-ao": "action_pending_by_action_owner",
  "kpi-closedao": "action_taken_closed_by_action_owner",
};

export interface NamedMetrics {
  name: string;
  audits: number;
  observations: number;
  capa_assigned: number;
  capa_closed: number;
}

export interface RecentAudit {
  audit_id: string;
  audit_type: string;
  circle: string;
  function_name: string;
  auditor: string;
  email: string;
  mobile: string;
  submitted_on: string;
  observations: number;
  capa_count: number;
  capa_closed: number;
  capa_pending: number;
  status: string;
  audit_location: string;
}

export interface ClosureRow {
  circle: string;
  audit_closed: number;
  action_plan_created: number;
  action_taken: number;
  ontime_capa: number;
  delayed_capa: number;
  extended_capa: number;
}

export interface PlanCounts {
  not_started: number;
  pending_by_action_owner: number;
  closed_by_action_owner: number;
}

export interface PlanStatusRow {
  label: string;
  corrective: PlanCounts;
  preventive: PlanCounts;
}

export interface AgeBucket {
  name: string;
  count: number;
}

export interface Ageing {
  total: number;
  buckets: AgeBucket[];
}

export interface OpenActionOwner {
  action_owner: string;
  open: number;
  past_target: number;
}

export interface PastTargetPlan {
  plan: string;
  audit: string;
  observation: string;
  action_owner: string;
  target_date: string;
  days_over: number;
  status: string;
}

export interface JourneyCounts {
  observations: number;
  initiated: number;
  closed: number;
}

export interface JourneyNode extends JourneyCounts {
  name: string;
  children: JourneyNode[];
}

export interface JourneyGroup extends JourneyCounts {
  id: string;
  name: string;
  nodes: JourneyNode[];
}

const companyId = () => localStorage.getItem("selectedCompanyId") || localStorage.getItem("company_id") || "";

const toApiDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : "";
};

const num = (value: unknown) => (typeof value === "number" ? value : Number(value) || 0);

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asList = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

const filterParams = (f: AuditDashboardFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (f.clusterIds.length) params.cluster_id = f.clusterIds.join(",");
  if (f.functionIds.length) params.function_id = f.functionIds.join(",");
  if (f.zoneIds.length) params.zone_id = f.zoneIds.join(",");
  if (f.workLocationIds.length) params.work_location_id = f.workLocationIds.join(",");
  // The audit type filter is a single value. Both selected is the same as no filter.
  if (f.auditTypeIds.length === 1) params.audit_type = f.auditTypeIds[0];
  if (f.dateFrom) params.from_date = toApiDate(f.dateFrom);
  if (f.dateTo) params.to_date = toApiDate(f.dateTo);
  return params;
};

async function fetchDashboard<T>(endpoint: string, extra: Record<string, string>, signal: AbortSignal): Promise<T> {
  const params = new URLSearchParams(extra);
  const company = companyId();
  if (company) params.set("company_id", company);
  const response = await fetch(getFullUrl(`/audit_dashboard/${endpoint}.json?${params.toString()}`), {
    headers: { Authorization: getAuthHeader(), Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

const toOptions = (items: unknown, idKey: string, label: (item: Record<string, unknown>) => string): FilterOption[] =>
  asList(items)
    .map((item) => ({ id: String(item[idKey] ?? ""), name: label(item) }))
    .filter((option) => option.id && option.name);

export interface AuditFilterOptions {
  circles: FilterOption[];
  functions: FilterOption[];
  zones: FilterOption[];
  workLocations: FilterOption[];
  auditTypes: FilterOption[];
  loaded: Partial<Record<FilterOptionKey, boolean>>;
}

export type FilterOptionKey = "circles" | "functions" | "zones" | "workLocations" | "auditTypes";

const EMPTY_OPTIONS: AuditFilterOptions = {
  circles: [],
  functions: [],
  zones: [],
  workLocations: [],
  auditTypes: [],
  loaded: {},
};

/** Dropdown options for the filter bar (loaded once). */
export const useAuditFilterOptions = () => {
  const [options, setOptions] = useState<AuditFilterOptions>(EMPTY_OPTIONS);

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
    load("circles", "cluster_level_filter", (json) => toOptions(json.clusters, "id", (item) => String(item.cluster_name ?? "")));
    load("functions", "function_level_filter", (json) => toOptions(json.functions, "id", (item) => String(item.function_name ?? "")));
    load("zones", "zone_level_filter", (json) => toOptions(json.zones, "id", (item) => String(item.zone_name ?? "")));
    load("workLocations", "work_location_level_filter", (json) =>
      toOptions(json.work_locations, "id", (item) => String(item.work_location_name ?? "")),
    );
    load("auditTypes", "audit_type_filter", (json) => toOptions(json.audit_types, "id", (item) => String(item.name ?? "")));
    return () => controller.abort();
  }, []);

  return options;
};

const metrics = (rows: unknown, nameKey: string, withAudits: boolean): NamedMetrics[] =>
  asList(rows).map((row) => ({
    name: String(row[nameKey] ?? row.name ?? ""),
    audits: withAudits ? num(row.audits) : 0,
    observations: num(row.observations),
    capa_assigned: num(row.capa_assigned),
    capa_closed: num(row.capa_closed),
  })).filter((row) => row.name);

const planCounts = (value: unknown): PlanCounts => {
  const row = asRecord(value);
  return {
    not_started: num(row.not_started),
    pending_by_action_owner: num(row.pending_by_action_owner),
    closed_by_action_owner: num(row.closed_by_action_owner),
  };
};

const planRows = (rows: unknown, labelKey: string): PlanStatusRow[] =>
  asList(rows).map((row) => ({
    label: String(row[labelKey] ?? ""),
    corrective: planCounts(row.corrective),
    preventive: planCounts(row.preventive),
  })).filter((row) => row.label);

const journeyNode = (value: unknown, childKey?: string): JourneyNode => {
  const row = asRecord(value);
  const children = childKey ? asList(row[childKey]).map((child) => journeyNode(child, childKey === "categories" ? "sub_categories" : undefined)) : [];
  return {
    name: String(row.name ?? ""),
    observations: num(row.observations),
    initiated: num(row.capa_plan_initiated),
    closed: num(row.capa_plan_closed),
    children,
  };
};

const journeyGroups = (rows: unknown, idKey: string, nameKey: string): JourneyGroup[] =>
  asList(rows).map((row) => ({
    id: String(row[idKey] ?? row[nameKey] ?? ""),
    name: String(row[nameKey] ?? ""),
    observations: num(row.observations),
    initiated: num(row.capa_plan_initiated),
    closed: num(row.capa_plan_closed),
    nodes: asList(row.classifications).map((item) => journeyNode(item, "categories")),
  })).filter((group) => group.name);

const kpiOf = (json: unknown): AuditKpi => {
  const data = asRecord(asRecord(json).data);
  return {
    total_audits: num(data.total_audits),
    open_audits: num(data.open_audits),
    closed_audits: num(data.closed_audits),
    total_observations: num(data.total_observations),
    total_actions: num(data.total_actions),
    pending_action_plan_by_spoc: num(data.pending_action_plan_by_spoc),
    capa_plan_started: num(data.capa_plan_started),
    action_pending_by_action_owner: num(data.action_pending_by_action_owner),
    action_taken_closed_by_action_owner: num(data.action_taken_closed_by_action_owner),
  };
};

const recentOf = (json: unknown): RecentAudit[] =>
  asList(asRecord(json).data).map((row) => ({
    audit_id: String(row.audit_id ?? ""),
    audit_type: String(row.audit_type ?? ""),
    circle: String(row.circle ?? ""),
    function_name: String(row.function_name ?? ""),
    auditor: String(row.auditor ?? ""),
    email: String(row.email ?? ""),
    mobile: String(row.mobile ?? ""),
    submitted_on: String(row.submitted_on ?? ""),
    observations: num(row.observations),
    capa_count: num(row.capa_count),
    capa_closed: num(row.capa_closed),
    capa_pending: num(row.capa_pending),
    status: String(row.status ?? ""),
    audit_location: String(row.audit_location ?? ""),
  }));

const closureOf = (json: unknown): ClosureRow[] =>
  asList(asRecord(json).data).map((row) => ({
    circle: String(row.circle ?? ""),
    audit_closed: num(row.audit_closed),
    action_plan_created: num(row.action_plan_created),
    action_taken: num(row.action_taken),
    ontime_capa: num(row.ontime_capa),
    delayed_capa: num(row.delayed_capa),
    extended_capa: num(row.extended_capa),
  })).filter((row) => row.circle);

const ageingOf = (json: unknown): Ageing => {
  const body = asRecord(json);
  return {
    total: num(body.total_waiting_observations),
    buckets: asList(body.data).map((row) => ({ name: String(row.name ?? ""), count: num(row.count) })).filter((row) => row.name),
  };
};

const ownersOf = (json: unknown): OpenActionOwner[] =>
  asList(asRecord(json).data).map((row) => ({
    action_owner: String(row.action_owner ?? ""),
    open: num(row.open),
    past_target: num(row.past_target),
  })).filter((row) => row.action_owner);

const pastTargetOf = (json: unknown): PastTargetPlan[] =>
  asList(asRecord(json).data).map((row) => ({
    plan: String(row.plan ?? ""),
    audit: String(row.audit ?? ""),
    observation: String(row.observation ?? ""),
    action_owner: String(row.action_owner ?? ""),
    target_date: String(row.target_date ?? ""),
    days_over: num(row.days_over),
    status: String(row.status ?? ""),
  }));

const totalCount = (json: unknown, fallback: number) => num(asRecord(asRecord(json).pagination).total_count) || fallback;

export interface AuditDashboardData {
  kpi: AuditKpi | null;
  auditsByFunction: NamedMetrics[] | null;
  auditsByCircle: NamedMetrics[] | null;
  recent: RecentAudit[] | null;
  recentTotal: number;
  closure: ClosureRow[] | null;
  actionPlans: PlanStatusRow[] | null;
  ageing: Ageing | null;
  owners: OpenActionOwner[] | null;
  pastTarget: PastTargetPlan[] | null;
  pastTargetTotal: number;
  observationsByFunction: NamedMetrics[] | null;
  observationsByCircle: NamedMetrics[] | null;
  journeyByCircle: JourneyGroup[] | null;
  journeyByFunction: JourneyGroup[] | null;
}

const EMPTY_DATA: AuditDashboardData = {
  kpi: null,
  auditsByFunction: null,
  auditsByCircle: null,
  recent: null,
  recentTotal: 0,
  closure: null,
  actionPlans: null,
  ageing: null,
  owners: null,
  pastTarget: null,
  pastTargetTotal: 0,
  observationsByFunction: null,
  observationsByCircle: null,
  journeyByCircle: null,
  journeyByFunction: null,
};

/** KPI, charts, closure progress and lists for the applied filters. */
export const useAuditDashboardData = (filters: AuditDashboardFilters) => {
  const [data, setData] = useState<AuditDashboardData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(filters);

  useEffect(() => {
    const controller = new AbortController();
    const params = filterParams(JSON.parse(key) as AuditDashboardFilters);
    const get = <T,>(endpoint: string) =>
      fetchDashboard<T>(endpoint, params, controller.signal).catch((error) => {
        if (!controller.signal.aborted) console.error(`Failed to load ${endpoint}:`, error);
        return null;
      });
    setLoading(true);
    Promise.all([
      get<unknown>("kpi"),
      get<unknown>("audit_by_function_type"),
      get<unknown>("audits_per_circle_data"),
      get<unknown>("recent_audits"),
      get<unknown>("closure_progress_by_circle"),
      get<unknown>("action_plan"),
      get<unknown>("waiting_for_spoc_action_plan_ageing"),
      get<unknown>("action_owners_with_most_open_actions"),
      get<unknown>("plans_past_target_date"),
      get<unknown>("observations_by_function"),
      get<unknown>("observation_by_circle"),
      get<unknown>("observation_by_classification_category_sub_category_by_circle"),
      get<unknown>("observation_by_classification_category_by_function"),
    ]).then(([kpi, byFunction, byCircle, recent, closure, plans, ageing, owners, pastTarget, obsFunction, obsCircle, journeyCircle, journeyFunction]) => {
      if (controller.signal.aborted) return;
      const loaded = [kpi, byFunction, byCircle, recent, closure, plans, ageing, owners, pastTarget, obsFunction, obsCircle, journeyCircle, journeyFunction];
      if (loaded.every((item) => item == null)) toast.error("Failed to load audit dashboard");
      const recentRows = recent ? recentOf(recent) : null;
      const pastRows = pastTarget ? pastTargetOf(pastTarget) : null;
      setData({
        kpi: kpi ? kpiOf(kpi) : null,
        auditsByFunction: byFunction ? metrics(asRecord(byFunction).data, "name", true) : null,
        auditsByCircle: byCircle ? metrics(asRecord(byCircle).data, "name", true) : null,
        recent: recentRows,
        recentTotal: recent ? totalCount(recent, recentRows?.length ?? 0) : 0,
        closure: closure ? closureOf(closure) : null,
        actionPlans: plans ? planRows(asRecord(plans).data, "circle") : null,
        ageing: ageing ? ageingOf(ageing) : null,
        owners: owners ? ownersOf(owners) : null,
        pastTarget: pastRows,
        pastTargetTotal: pastTarget ? totalCount(pastTarget, pastRows?.length ?? 0) : 0,
        observationsByFunction: obsFunction ? metrics(asRecord(obsFunction).data, "function", false) : null,
        observationsByCircle: obsCircle ? metrics(asRecord(obsCircle).data, "circle", false) : null,
        journeyByCircle: journeyCircle ? journeyGroups(asRecord(journeyCircle).data, "cluster_id", "circle") : null,
        journeyByFunction: journeyFunction ? journeyGroups(asRecord(journeyFunction).data, "function_id", "function") : null,
      });
      setLoading(false);
    });
    return () => controller.abort();
  }, [key]);

  return { ...data, loading };
};

const AUDIT_COLORS = {
  audits: "rgb(255, 143, 107)",
  observations: "rgb(47, 48, 67)",
  assigned: "rgb(255, 196, 0)",
  closed: "rgb(90, 8, 75)",
} as const;

const bar = (label: string, data: number[], color: string) => ({ label, data, barColor: color });

const metricChart = (id: string, rows: NamedMetrics[] | null, includeAudits: boolean): ChartSpec | null => {
  if (!rows) return null;
  const datasets = [
    ...(includeAudits ? [bar("Audits", rows.map((row) => row.audits), AUDIT_COLORS.audits)] : []),
    bar("Observations", rows.map((row) => row.observations), includeAudits ? AUDIT_COLORS.observations : OBS_JOURNEY_COLORS[0]),
    bar("CAPA Assigned", rows.map((row) => row.capa_assigned), includeAudits ? AUDIT_COLORS.assigned : OBS_JOURNEY_COLORS[1]),
    bar("CAPA Closed", rows.map((row) => row.capa_closed), includeAudits ? AUDIT_COLORS.closed : OBS_JOURNEY_COLORS[2]),
  ];
  return { id, labels: rows.map((row) => row.name), datasets, defaultType: "bar" };
};

const sumPlans = (rows: PlanStatusRow[], key: keyof PlanCounts) => [
  rows.reduce((sum, row) => sum + row.corrective[key], 0),
  rows.reduce((sum, row) => sum + row.preventive[key], 0),
];

/** Chart specs for the panels that share the audit / observation / CAPA charts. Null means that request failed. */
export const buildCharts = (data: AuditDashboardData): Record<string, ChartSpec | null> => {
  const plans = data.actionPlans;
  const ageing = data.ageing;
  const owners = data.owners;
  const closure = data.closure;
  const kpi = data.kpi;
  return {
    auditFunc: metricChart("auditFunc", data.auditsByFunction, true),
    auditCircle: metricChart("auditCircle", data.auditsByCircle, true),
    obsFunc: metricChart("obsFunc", data.observationsByFunction, false),
    obsCircle: metricChart("obsCircle", data.observationsByCircle, false),
    auditStatus: kpi
      ? {
          id: "auditStatus",
          labels: ["Open", "Closed"],
          datasets: [{ label: "Audits", data: [kpi.open_audits, kpi.closed_audits], pieColors: ["#EE2737", "#5A084B"], barColor: "#EE2737" }],
          defaultType: "donut",
        }
      : null,
    obsStatus: kpi
      ? {
          id: "obsStatus",
          labels: ["Pending By SPOC", "Pending By Action Owner", "Closed By Action Owner"],
          datasets: [{
            label: "Observations",
            data: [kpi.pending_action_plan_by_spoc, kpi.action_pending_by_action_owner, kpi.action_taken_closed_by_action_owner],
            pieColors: ["#FF8F6B", "#FFC400", "#5A084B"],
            barColor: "#5A084B",
          }],
          defaultType: "donut",
        }
      : null,
    capaStatus: plans
      ? {
          id: "capaStatus",
          labels: ["Corrective", "Preventive"],
          datasets: [
            bar("Not started", sumPlans(plans, "not_started"), OBS_JOURNEY_COLORS[0]),
            bar("Pending By Action Owner", sumPlans(plans, "pending_by_action_owner"), OBS_JOURNEY_COLORS[1]),
            bar("Closed By Action Owner", sumPlans(plans, "closed_by_action_owner"), OBS_JOURNEY_COLORS[2]),
          ],
          defaultType: "bar",
          stacked: true,
        }
      : null,
    capaAging: ageing
      ? {
          id: "capaAging",
          labels: ageing.buckets.map((bucket) => bucket.name),
          datasets: [{
            label: "Observations",
            data: ageing.buckets.map((bucket) => bucket.count),
            pieColors: ["#5A084B", "#2F3043", "#FFC400", "#FF8F6B", "#EE2737"],
            barColor: "#FF8F6B",
          }],
          defaultType: "bar",
        }
      : null,
    capaOverdue: owners
      ? {
          id: "capaOverdue",
          labels: owners.map((owner) => owner.action_owner),
          datasets: [bar("Past target date", owners.map((owner) => owner.past_target), "#EE2737")],
          defaultType: "bar",
        }
      : null,
    capaExt: closure
      ? {
          id: "capaExt",
          labels: closure.map((row) => row.circle),
          datasets: [bar("Extended CAPA %", closure.map((row) => Math.round(row.extended_capa)), "#2F3043")],
          defaultType: "bar",
        }
      : null,
  };
};

export const EMPTY_CHART: ChartSpec = { id: "empty", labels: [], datasets: [], defaultType: "bar" };
