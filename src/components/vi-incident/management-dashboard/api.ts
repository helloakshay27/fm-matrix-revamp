import { useEffect, useMemo, useState } from "react";
import { getMsafeAuthHeader, getViApiUrl, getViCompanyId, msafeFetch } from "@/features/msafe-dashboard/freeLink/msafeApi";
import { CHARTS, PALETTE, BRAND, type ChartSpec } from "./data";

/** Live data for the Vi Incident dashboard — `/vi_incident_dashboard/*` endpoints. */

export interface FilterOption {
  id: string;
  name: string;
}

export interface FilterOptions {
  circles: FilterOption[];
  functions: FilterOption[];
  personalAreas: FilterOption[];
  classifications: FilterOption[];
  workLocations: FilterOption[];
  loading: boolean;
}

/** Applied filters — ids, "" meaning "all". */
export interface IncidentFilters {
  circleIds: string[];
  functionIds: string[];
  /** Personnel area (personal_area_filter). */
  personalAreaIds: string[];
  /** Zone of the selected circles (zone_filter?cluster_id=…); Circle Manager only. */
  zoneIds: string[];
  workLocationId: string;
  classificationId: string;
  dateFrom: string;
  dateTo: string;
}

export interface HeatmapRow {
  circle: string;
  /** One cell per heatmap stage (same order as the stage columns). */
  cells: { cls: string; value: string; title: string }[];
}

/** A heatmap column, from the API's `stages` list. */
export interface HeatmapStage {
  key: string;
  label: string;
}

export interface RecentIncident {
  id: number;
  incident_id: string;
  classification: string;
  location: string;
  reporter: string;
  incident_date: string;
  incident_time: string;
  injury: string;
  status: string;
  workflow_status: string;
  circle: string;
  personnel_area: string;
}

/** Same order as KPI_INFO; Draft is not returned by the API and its card is hidden. */
/** null = the API did not send that count (shown as "—", never a made-up number). */
export type KpiValues = readonly (number | null)[];

export interface IncidentDashboardData {
  loading: boolean;
  error: string | null;
  syncedAt: Date | null;
  kpis: KpiValues;
  charts: Record<string, ChartSpec>;
  heatmap: HeatmapRow[];
  /** Column headings for the heatmap, from the API. */
  heatmapStages: HeatmapStage[];
  recent: RecentIncident[];
}

interface CountItem {
  id?: number | string;
  key?: string;
  name: string;
  count: number;
  open_count?: number;
  closed_count?: number;
}

interface CountResponse {
  data: CountItem[];
}

// Base URL and token come from the logged-in session — no hardcoded server or company fallback.
async function fetchJson<T>(endpoint: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams();
  const companyId = getViCompanyId();
  if (companyId) query.set("company_id", companyId);
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const res = await msafeFetch(getViApiUrl(`/vi_incident_dashboard/${endpoint}?${query.toString()}`), {
    signal,
    headers: { Authorization: getMsafeAuthHeader() },
  });
  if (!res.ok) throw new Error(`${endpoint}: HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function filterParams(filters: IncidentFilters): Record<string, string> {
  return {
    cluster_id: filters.circleIds.join(","),
    function_id: filters.functionIds.join(","),
    personal_area_ids: filters.personalAreaIds.join(","),
    zone_ids: filters.zoneIds.join(","),
    work_location_id: filters.workLocationId,
    classification_id: filters.classificationId,
    from_date: filters.dateFrom,
    to_date: filters.dateTo,
  };
}

const toIsoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** The 12-month trend always covers the last year up to today, whatever Incident Date range is applied. */
function lastYearRange(): Record<string, string> {
  const today = new Date();
  const from = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  return { from_date: toIsoDate(from), to_date: toIsoDate(today) };
}

/* ── Spec builders ─────────────────────────────────────────────── */

const pieColors = (count: number) => Array.from({ length: count }, (_, index) => PALETTE[index % PALETTE.length]);

function countSpec(base: ChartSpec, items: CountItem[], label = "Incidents"): ChartSpec {
  return {
    ...base,
    labels: items.map((item) => item.name),
    datasets: [{ label, data: items.map((item) => item.count), pieColors: pieColors(items.length), barColor: base.datasets[0]?.barColor ?? BRAND.aubergine }],
  };
}

function openClosedSpec(base: ChartSpec, items: CountItem[]): ChartSpec {
  return {
    ...base,
    labels: items.map((item) => item.name),
    datasets: [
      { label: "Open", data: items.map((item) => item.open_count ?? 0), barColor: BRAND.crimson },
      { label: "Closed", data: items.map((item) => item.closed_count ?? 0), barColor: BRAND.aubergine },
    ],
  };
}

const BAND_CLASS: Record<string, string> = { red: "c1", amber: "c2", teal: "c3", green: "c4" };

interface HeatmapResponse {
  stages?: HeatmapStage[];
  data: {
    circle_name: string;
    stages: { key?: string; label?: string; count?: number | null; percentage: number | null; band: string | null; numerator?: number | null; denominator?: number | null }[];
  }[];
}

/* ── Hooks ─────────────────────────────────────────────────────── */

const EMPTY_OPTIONS: FilterOptions = { circles: [], functions: [], personalAreas: [], classifications: [], workLocations: [], loading: true };

function toOptions<T>(rows: T[] | undefined, name: (row: T) => string, id: (row: T) => number): FilterOption[] {
  return (rows ?? []).map((row) => ({ id: String(id(row)), name: name(row) }));
}

// Options from a filter response whose exact shape isn't fixed: the list under one of `keys`
// (else the first array in the response), named by the first of `nameKeys` that is set.
function listOptions(json: Record<string, unknown> | null, keys: string[], nameKeys: string[]): FilterOption[] {
  if (!json) return [];
  const rows = (keys.map((key) => json[key]).find(Array.isArray) ?? Object.values(json).find(Array.isArray) ?? []) as Record<string, unknown>[];
  return rows
    .map((row) => ({ id: String(row.id ?? ""), name: String(nameKeys.map((key) => row[key]).find((value) => value) ?? "") }))
    .filter((option) => option.id && option.name);
}

/**
 * Zone options for the selected circles: GET zone_filter?cluster_id=<ids>. Nothing is loaded
 * (and the dropdown asks for a circle) until at least one circle is selected.
 */
export function useIncidentZoneOptions(circleIds: string[]) {
  const [zones, setZones] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const key = circleIds.join(",");

  useEffect(() => {
    setZones([]);
    if (!key) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetchJson<Record<string, unknown>>("zone_filter", { cluster_id: key }, controller.signal)
      .catch(() => null)
      .then((json) => {
        if (controller.signal.aborted) return;
        setZones(listOptions(json, ["zones"], ["zone_name", "name"]));
        setLoading(false);
      });
    return () => controller.abort();
  }, [key]);

  return { zones, loading };
}

export function useIncidentFilterOptions(): FilterOptions {
  const [options, setOptions] = useState<FilterOptions>(EMPTY_OPTIONS);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const load = <T,>(endpoint: string) => fetchJson<T>(endpoint, {}, signal).catch(() => null);
    Promise.all([
      load<{ clusters: { id: number; cluster_name: string }[] }>("cluster_filter"),
      load<{ functions: { id: number; function_name: string }[] }>("function_filter"),
      load<Record<string, unknown>>("personal_area_filter"),
      load<{ incident_classifications: { id: number; classification_name: string }[] }>("incident_classification_filter"),
      load<{ work_locations: { id: number; work_location_code: string; work_location_name: string }[] }>("work_location_filter"),
    ]).then(([clusters, functions, personalAreas, classifications, workLocations]) => {
      if (signal.aborted) return;
      setOptions({
        circles: toOptions(clusters?.clusters, (row) => row.cluster_name, (row) => row.id),
        functions: toOptions(functions?.functions, (row) => row.function_name, (row) => row.id),
        personalAreas: listOptions(personalAreas, ["personal_areas", "personnel_areas"], ["personal_area_name", "personnel_area_name", "name"]),
        classifications: toOptions(classifications?.incident_classifications, (row) => row.classification_name, (row) => row.id),
        // Several locations share a name, so the code keeps each option distinguishable.
        workLocations: toOptions(workLocations?.work_locations, (row) => `${row.work_location_name} (${row.work_location_code})`, (row) => row.id),
        loading: false,
      });
    });
    return () => controller.abort();
  }, []);

  return options;
}

const EMPTY_KPIS: KpiValues = Array.from({ length: 13 }, () => null);

const API_CHART_KEYS = ["incStatus", "incStage", "incInjury", "incClass", "incCircle", "incFunc", "incCategory", "incFacility", "incPerson", "incInjType", "incTrend", "incTime", "incLost", "invReq", "invConc", "invFactors"];

// Live charts start (and stay, if their request fails) empty rather than showing the sample numbers.
const EMPTY_API_CHARTS: Record<string, ChartSpec> = Object.fromEntries(
  API_CHART_KEYS.map((key) => {
    const spec = CHARTS[key];
    const keepLabels = key === "incStatus" || key === "incStage";
    return [key, { ...spec, labels: keepLabels ? spec.labels : [], datasets: spec.datasets.map((series) => ({ ...series, data: keepLabels ? series.data.map(() => 0) : [] })) }];
  }),
);

export function useIncidentDashboard(filters: IncidentFilters): IncidentDashboardData {
  const [state, setState] = useState<Omit<IncidentDashboardData, "charts"> & { overrides: Record<string, ChartSpec> }>({
    loading: true,
    error: null,
    syncedAt: null,
    kpis: EMPTY_KPIS,
    overrides: EMPTY_API_CHARTS,
    heatmap: [],
    heatmapStages: [],
    recent: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const params = filterParams(filters);
    const get = <T,>(endpoint: string, extra: Record<string, string> = {}) => fetchJson<T>(endpoint, { ...params, ...extra }, signal);

    setState((current) => ({ ...current, loading: true, error: null }));

    Promise.allSettled([
      get<{ kpi: Record<string, number> }>("kpi"),
      get<CountResponse>("injury_classification_chart", { type: "injury" }),
      get<CountResponse>("injury_classification_chart", { type: "classification" }),
      get<CountResponse>("circle_function_chart", { type: "circle" }),
      get<CountResponse>("circle_function_chart", { type: "function" }),
      get<CountResponse>("category_facility_chart", { type: "category" }),
      get<CountResponse>("category_facility_chart", { type: "facility" }),
      get<CountResponse>("person_injury_chart", { type: "person" }),
      get<CountResponse>("person_injury_chart", { type: "injury" }),
      get<{ data: { label: string; open_count: number; closed_count: number; total: number }[] }>("monthly_open_closed_trend", lastYearRange()),
      get<{ data: { band: string; count: number }[] }>("time_of_day_chart"),
      get<CountResponse>("investigation_chart", { type: "required" }),
      get<CountResponse>("investigation_chart", { type: "conclusion" }),
      get<{ data: { label: string; days_away_from_work: number; restricted_work_days: number }[] }>("days_away_restricted_trend"),
      get<CountResponse>("contributing_factor_groups"),
      get<HeatmapResponse>("closure_progress_heatmap"),
      get<{ recent_incidents: RecentIncident[] }>("recent_incidents"),
    ]).then((results) => {
      if (signal.aborted) return;
      const value = <T,>(index: number): T | null => (results[index].status === "fulfilled" ? (results[index] as PromiseFulfilledResult<T>).value : null);
      const failed = results.filter((result) => result.status === "rejected").length;

      const kpi = value<{ kpi: Record<string, number> }>(0)?.kpi;
      const kpis: KpiValues = kpi
        ? [
            kpi.total_incidents, 0, kpi.open_incidents, kpi.closed_incidents, kpi.incidents_with_injury, kpi.pending_spoc_review, kpi.pending_by_action_owner, kpi.pending_capa, kpi.capa_closed,
            // CAPA / investigation cards (same order as the extra KPI_INFO entries).
            kpi.capa_planned, kpi.capa_open, kpi.closed_investigation, kpi.awaiting_investigation,
          ].map((n) => (typeof n === "number" ? n : null))
        : EMPTY_KPIS;

      const overrides: Record<string, ChartSpec> = { ...EMPTY_API_CHARTS };
      const counts = (index: number) => value<CountResponse>(index)?.data;
      const setCount = (key: string, index: number, label?: string) => {
        const items = counts(index);
        if (items) overrides[key] = countSpec(CHARTS[key], items, label);
      };

      if (kpi) {
        overrides.incStatus = { ...CHARTS.incStatus, datasets: [{ ...CHARTS.incStatus.datasets[0], data: [0, kpis[2] ?? 0, kpis[3] ?? 0] }] };
        overrides.incStage = { ...CHARTS.incStage, datasets: [{ ...CHARTS.incStage.datasets[0], data: [kpis[5] ?? 0, kpis[6] ?? 0] }] };
      }
      setCount("incInjury", 1);
      setCount("incClass", 2);
      const circles = counts(3);
      if (circles) overrides.incCircle = openClosedSpec(CHARTS.incCircle, circles);
      setCount("incFunc", 4);
      setCount("incCategory", 5);
      setCount("incFacility", 6);
      setCount("incPerson", 7, "Injured persons");
      setCount("incInjType", 8, "Injuries");

      const trend = value<{ data: { label: string; closed_count: number; total: number }[] }>(9)?.data;
      if (trend) {
        overrides.incTrend = {
          ...CHARTS.incTrend,
          labels: trend.map((row) => row.label),
          datasets: [
            { ...CHARTS.incTrend.datasets[0], data: trend.map((row) => row.total) },
            { ...CHARTS.incTrend.datasets[1], data: trend.map((row) => row.closed_count) },
          ],
        };
      }

      const time = value<{ data: { band: string; count: number }[] }>(10)?.data;
      if (time) {
        overrides.incTime = { ...CHARTS.incTime, labels: time.map((row) => row.band.replace("-", "–")), datasets: [{ ...CHARTS.incTime.datasets[0], data: time.map((row) => row.count), pieColors: pieColors(time.length) }] };
      }

      setCount("invReq", 11);
      setCount("invConc", 12);

      const lost = value<{ data: { label: string; days_away_from_work: number; restricted_work_days: number }[] }>(13)?.data;
      if (lost) {
        overrides.incLost = {
          ...CHARTS.incLost,
          labels: lost.map((row) => row.label),
          datasets: [
            { ...CHARTS.incLost.datasets[0], data: lost.map((row) => row.days_away_from_work) },
            { ...CHARTS.incLost.datasets[1], data: lost.map((row) => row.restricted_work_days) },
          ],
        };
      }

      setCount("invFactors", 14);

      const heatmapResponse = value<HeatmapResponse>(15);
      const heatmapRows = heatmapResponse?.data ?? [];
      // Columns come from the API's stage list (key + label); older responses without it fall back
      // to the first circle's stages.
      const heatmapStages: HeatmapStage[] = (heatmapResponse?.stages?.length ? heatmapResponse.stages : heatmapRows[0]?.stages ?? [])
        .map((stage, index) => ({ key: stage.key ?? String(index), label: stage.label ?? "" }));
      const heatmap = heatmapRows.map((row) => ({
        circle: row.circle_name,
        // Each column's cell is matched by stage key; it shows the count, coloured by the API's band.
        cells: heatmapStages.map((column, index) => {
          const stage = row.stages.find((item) => item.key === column.key) ?? (row.stages[index]?.key ? undefined : row.stages[index]);
          if (!stage) return { cls: "", value: "—", title: `${column.label}: no data` };
          const count = stage.count ?? stage.numerator ?? 0;
          const share =
            stage.denominator != null && stage.percentage != null
              ? ` · ${stage.numerator ?? count} of ${stage.denominator} (${Math.round(stage.percentage)}%)`
              : "";
          return {
            // No band (plain counts) or "no_data" gets no colour.
            cls: (stage.band && BAND_CLASS[stage.band]) || "",
            value: String(count),
            title: `${column.label}: ${count}${share}`,
          };
        }),
      }));
      const recent = value<{ recent_incidents: RecentIncident[] }>(16)?.recent_incidents ?? [];

      setState({
        loading: false,
        error: failed ? `${failed} of ${results.length} dashboard requests failed` : null,
        syncedAt: new Date(),
        kpis,
        overrides,
        heatmap,
        heatmapStages,
        recent,
      });
    });

    return () => controller.abort();
  }, [filters]);

  const charts = useMemo(() => ({ ...CHARTS, ...state.overrides }), [state.overrides]);
  return { loading: state.loading, error: state.error, syncedAt: state.syncedAt, kpis: state.kpis, charts, heatmap: state.heatmap, heatmapStages: state.heatmapStages, recent: state.recent };
}
