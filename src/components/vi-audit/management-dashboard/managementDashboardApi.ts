import { getAuthHeader } from "@/config/apiConfig";

const AUDIT_DASHBOARD_BASE = "https://vi-uat-api.gophygital.work";

/** Vi audit rows live on company 145. The FM session company returns an empty dashboard. */
const VI_AUDIT_COMPANY_ID = "145";

export const managementCompanyId = () => VI_AUDIT_COMPANY_ID;

/** Date input is yyyy-mm-dd. The dashboard API expects dd-mm-yyyy. */
export const toApiDate = (iso: string) => {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}-${month}-${year}`;
};

export interface DashboardQuery {
  clusterId: string;
  zoneId: string;
  functionIds: string[];
  auditType: string;
  dateFrom: string;
  dateTo: string;
}

export interface NamedOption {
  id: string;
  name: string;
}

export interface DashboardFilterOptions {
  clusters: NamedOption[];
  functions: NamedOption[];
  zones: NamedOption[];
  auditTypes: NamedOption[];
}

export interface DashboardKpis {
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

export interface ClosureRow {
  circle: string;
  values: number[];
}

const num = (value: unknown) => (typeof value === "number" ? value : Number(value) || 0);

const getJson = async (path: string, params: Record<string, string | string[]>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => search.append(key, item));
      return;
    }
    if (value) search.set(key, value);
  });
  const query = search.toString();
  // Localhost logins are issued by the FM host. vi-uat rejects that JWT with 401.
  // On localhost, the Vite proxy attaches VI_AUDIT_DASHBOARD_BEARER and calls vi-uat.
  const useDevProxy =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const url = useDevProxy
    ? `/vi-audit-dashboard/audit_dashboard/${path}?${query}`
    : `${AUDIT_DASHBOARD_BASE}/audit_dashboard/${path}?${query}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (!useDevProxy) headers.Authorization = getAuthHeader();
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};

const queryParams = (query: DashboardQuery, companyId: string) => ({
  company_id: companyId,
  cluster_id: query.clusterId,
  zone_id: query.zoneId,
  function_id: query.functionIds,
  audit_type: query.auditType,
  from_date: toApiDate(query.dateFrom),
  to_date: toApiDate(query.dateTo),
});

const asOptions = (rows: unknown, idKey: string, nameKey: string): NamedOption[] => {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => {
      const item = row as Record<string, unknown>;
      const id = item[idKey];
      const name = item[nameKey];
      if (id == null || name == null) return null;
      return { id: String(id), name: String(name) };
    })
    .filter((item): item is NamedOption => Boolean(item));
};

export const fetchDashboardFilters = async (): Promise<DashboardFilterOptions> => {
  const companyId = managementCompanyId();
  if (!companyId) throw new Error("Company is not selected");
  const company = { company_id: companyId };
  const [clusters, functions, zones, types] = await Promise.all([
    getJson("cluster_level_filter.json", company),
    getJson("function_level_filter.json", company),
    getJson("zone_level_filter.json", company),
    getJson("audit_type_filter.json", company),
  ]);
  return {
    clusters: asOptions(clusters?.clusters, "id", "cluster_name"),
    functions: asOptions(functions?.functions, "id", "function_name"),
    zones: asOptions(zones?.zones, "id", "zone_name"),
    auditTypes: asOptions(types?.audit_types, "id", "name"),
  };
};

export const fetchDashboardKpis = async (query: DashboardQuery): Promise<DashboardKpis> => {
  const companyId = managementCompanyId();
  if (!companyId) throw new Error("Company is not selected");
  const json = await getJson("kpi.json", queryParams(query, companyId));
  const data = json?.data ?? json ?? {};
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

/** Keep API precision (e.g. 83.33) instead of rounding to whole percents. */
export const formatClosurePct = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
};

export const fetchClosureProgress = async (query: DashboardQuery): Promise<ClosureRow[]> => {
  const companyId = managementCompanyId();
  if (!companyId) throw new Error("Company is not selected");
  const json = await getJson("closure_progress_by_circle.json", queryParams(query, companyId));
  const rows = Array.isArray(json?.data) ? json.data : [];
  // Column order matches the heatmap headers: Closed → Plan → Taken → On-time → Extended → Delayed
  return rows.map((row: Record<string, unknown>) => ({
    circle: String(row.circle ?? ""),
    values: [
      num(row.audit_closed),
      num(row.action_plan_created),
      num(row.action_taken),
      num(row.ontime_capa),
      num(row.extended_capa),
      num(row.delayed_capa),
    ],
  }));
};

export interface VolumeRow {
  name: string;
  audits: number;
  observations: number;
  capaAssigned: number;
  capaClosed: number;
}

export interface RecentAudit {
  id: string;
  type: string;
  circle: string;
  functionName: string;
  auditor: string;
  email: string;
  mobile: string;
  submittedOn: string;
  observations: number;
  capa: number;
  capaClosed: number;
  capaPending: number;
  status: string;
  location: string;
}

export interface PlanStatus {
  notStarted: number;
  pending: number;
  closed: number;
}

export interface ActionPlanSlice {
  label: string;
  corrective: PlanStatus;
  preventive: PlanStatus;
}

export interface AgingBucket {
  name: string;
  count: number;
}

export interface ActionOwnerRow {
  name: string;
  open: number;
  pastTarget: number;
}

export interface OverduePlan {
  plan: string;
  audit: string;
  observation: string;
  owner: string;
  target: string;
  days: number;
  status: string;
}

export interface JourneyNode {
  name: string;
  observations: number;
  initiated: number;
  closed: number;
  children: JourneyNode[];
}

export interface JourneyGroup {
  name: string;
  observations: number;
  initiated: number;
  closed: number;
  classifications: JourneyNode[];
}

export interface DashboardSections {
  auditsByFunction: VolumeRow[];
  auditsByCircle: VolumeRow[];
  observationsByFunction: VolumeRow[];
  observationsByCircle: VolumeRow[];
  recentAudits: RecentAudit[];
  actionPlans: ActionPlanSlice[];
  spocAging: AgingBucket[];
  spocWaitingTotal: number;
  actionOwners: ActionOwnerRow[];
  overduePlans: OverduePlan[];
  overdueTotal: number;
  classificationByCircle: JourneyGroup[];
  classificationByFunction: JourneyGroup[];
}

const list = (json: { data?: unknown } | null) => (Array.isArray(json?.data) ? json.data : []);

const volumeRow = (row: Record<string, unknown>, nameKey: string): VolumeRow => ({
  name: String(row[nameKey] ?? ""),
  audits: num(row.audits),
  observations: num(row.observations),
  capaAssigned: num(row.capa_assigned),
  capaClosed: num(row.capa_closed),
});

const planStatus = (value: unknown): PlanStatus => {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    notStarted: num(row.not_started),
    pending: num(row.pending_by_action_owner),
    closed: num(row.closed_by_action_owner),
  };
};

const journeyNode = (row: Record<string, unknown>, childKey?: string): JourneyNode => {
  const children = childKey && Array.isArray(row[childKey]) ? (row[childKey] as Record<string, unknown>[]) : [];
  const nextKey = childKey === "categories" ? "sub_categories" : undefined;
  return {
    name: String(row.name ?? ""),
    observations: num(row.observations),
    initiated: num(row.capa_plan_initiated),
    closed: num(row.capa_plan_closed),
    children: children.map((child) => journeyNode(child, nextKey)),
  };
};

const journeyGroups = (json: { data?: unknown } | null, nameKey: string): JourneyGroup[] =>
  list(json).map((row) => {
    const item = row as Record<string, unknown>;
    const classifications = Array.isArray(item.classifications) ? (item.classifications as Record<string, unknown>[]) : [];
    return {
      name: String(item[nameKey] ?? ""),
      observations: num(item.observations),
      initiated: num(item.capa_plan_initiated),
      closed: num(item.capa_plan_closed),
      classifications: classifications.map((classification) => journeyNode(classification, "categories")),
    };
  });

const safeGet = async (path: string, params: Record<string, string | string[]>) => {
  try {
    return await getJson(path, params);
  } catch (error) {
    console.error(`Failed to load ${path}:`, error);
    return null;
  }
};

export const EMPTY_SECTIONS: DashboardSections = {
  auditsByFunction: [],
  auditsByCircle: [],
  observationsByFunction: [],
  observationsByCircle: [],
  recentAudits: [],
  actionPlans: [],
  spocAging: [],
  spocWaitingTotal: 0,
  actionOwners: [],
  overduePlans: [],
  overdueTotal: 0,
  classificationByCircle: [],
  classificationByFunction: [],
};

export const fetchDashboardSections = async (query: DashboardQuery): Promise<DashboardSections> => {
  const companyId = managementCompanyId();
  if (!companyId) throw new Error("Company is not selected");
  const params = queryParams(query, companyId);
  const [
    byFunction,
    byCircle,
    recent,
    observationsByFunction,
    observationsByCircle,
    actionPlans,
    aging,
    owners,
    overdue,
    byCircleClass,
    byFunctionClass,
  ] = await Promise.all([
    safeGet("audit_by_function_type.json", params),
    safeGet("audits_per_circle_data.json", params),
    safeGet("recent_audits.json", params),
    safeGet("observations_by_function.json", params),
    safeGet("observation_by_circle.json", params),
    safeGet("action_plan.json", params),
    safeGet("waiting_for_spoc_action_plan_ageing.json", params),
    safeGet("action_owners_with_most_open_actions.json", params),
    safeGet("plans_past_target_date.json", params),
    safeGet("observation_by_classification_category_sub_category_by_circle.json", params),
    safeGet("observation_by_classification_category_by_function.json", params),
  ]);

  return {
    auditsByFunction: list(byFunction).map((row) => volumeRow(row as Record<string, unknown>, "name")),
    auditsByCircle: list(byCircle).map((row) => volumeRow(row as Record<string, unknown>, "name")),
    observationsByFunction: list(observationsByFunction).map((row) => volumeRow(row as Record<string, unknown>, "function")),
    observationsByCircle: list(observationsByCircle).map((row) => volumeRow(row as Record<string, unknown>, "circle")),
    recentAudits: list(recent).map((row) => {
      const item = row as Record<string, unknown>;
      return {
        id: String(item.audit_id ?? ""),
        type: String(item.audit_type ?? ""),
        circle: String(item.circle ?? ""),
        functionName: String(item.function_name ?? ""),
        auditor: String(item.auditor ?? ""),
        email: String(item.email ?? ""),
        mobile: String(item.mobile ?? ""),
        submittedOn: String(item.submitted_on ?? ""),
        observations: num(item.observations),
        capa: num(item.capa_count),
        capaClosed: num(item.capa_closed),
        capaPending: num(item.capa_pending),
        status: String(item.status ?? ""),
        location: String(item.audit_location ?? ""),
      };
    }),
    actionPlans: list(actionPlans).map((row) => {
      const item = row as Record<string, unknown>;
      return {
        label: String(item.circle ?? item.function ?? ""),
        corrective: planStatus(item.corrective),
        preventive: planStatus(item.preventive),
      };
    }),
    spocAging: list(aging).map((row) => {
      const item = row as Record<string, unknown>;
      return { name: String(item.name ?? ""), count: num(item.count) };
    }),
    spocWaitingTotal: num(aging?.total_waiting_observations),
    actionOwners: list(owners).map((row) => {
      const item = row as Record<string, unknown>;
      return {
        name: String(item.action_owner ?? ""),
        open: num(item.open),
        pastTarget: num(item.past_target),
      };
    }),
    overduePlans: list(overdue).map((row) => {
      const item = row as Record<string, unknown>;
      return {
        plan: String(item.plan ?? ""),
        audit: String(item.audit ?? ""),
        observation: String(item.observation ?? ""),
        owner: String(item.action_owner ?? ""),
        target: String(item.target_date ?? ""),
        days: num(item.days_over),
        status: String(item.status ?? ""),
      };
    }),
    overdueTotal: num(overdue?.pagination?.total_count) || list(overdue).length,
    classificationByCircle: journeyGroups(byCircleClass, "circle"),
    classificationByFunction: journeyGroups(byFunctionClass, "function"),
  };
};

/** KPI card id → field on GET /audit_dashboard/kpi.json */
export const KPI_VALUE_KEY: Record<string, keyof DashboardKpis> = {
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
