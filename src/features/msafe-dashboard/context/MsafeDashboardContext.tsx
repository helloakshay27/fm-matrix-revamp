import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AccordionKey, ModuleView, Persona } from '../data/constants';

export type FilterOption = { id: string; name: string };

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

async function fetchMsafeTrainingJson(endpoint: string, signal?: AbortSignal): Promise<unknown> {
  const token = localStorage.getItem('token') || '';
  const companyId =
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '';
  const params = new URLSearchParams({ company_id: companyId });
  if (token) {
    params.set('access_token', token);
    params.set('token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_tranning_dashboard/${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function extractFilterOptions(
  data: unknown,
  arrayKeys: string[],
  nameKeys: string[],
  idKeys: string[],
): FilterOption[] {
  const record = data as Record<string, unknown> | null;
  let arr: unknown = undefined;
  for (const key of arrayKeys) {
    if (record && Array.isArray(record[key])) {
      arr = record[key];
      break;
    }
  }
  if (arr === undefined) arr = Array.isArray(data) ? data : [];

  const options = (arr as unknown[])
    .map((item) => {
      if (typeof item === 'string') return item.trim() ? { id: item.trim(), name: item.trim() } : null;
      const obj = item as Record<string, unknown>;
      let name: string | null = null;
      for (const key of nameKeys) {
        const v = obj?.[key];
        if (typeof v === 'string' && v.trim()) {
          name = v.trim();
          break;
        }
      }
      if (!name) return null;
      let id: string | null = null;
      for (const key of idKeys) {
        const v = obj?.[key];
        if (typeof v === 'number' && Number.isFinite(v)) {
          id = String(v);
          break;
        }
        if (typeof v === 'string' && v.trim()) {
          id = v.trim();
          break;
        }
      }
      return { id: id ?? name, name };
    })
    .filter((v): v is FilterOption => Boolean(v));

  const seen = new Set<string>();
  const deduped = options.filter((o) => {
    if (seen.has(o.name)) return false;
    seen.add(o.name);
    return true;
  });
  return deduped.sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchFilterOptions(
  endpoint: string,
  arrayKeys: string[],
  nameKeys: string[],
  idKeys: string[],
  signal: AbortSignal,
): Promise<FilterOption[]> {
  const data = await fetchMsafeTrainingJson(endpoint, signal);
  return extractFilterOptions(data, arrayKeys, nameKeys, idKeys);
}

export type DrillState = { id: string; title: string; crumb: string } | null;
export type ToastItem = { id: number; message: string };
export type AppliedFilters = {
  circles: string[];
  circleIds: string[];
  functions: string[];
  functionIds: string[];
  zone: string;
  zoneId: string;
  empType: string;
  empTypeId: string;
  startDate: string;
  endDate: string;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Local-date (not UTC) YYYY-MM-DD formatting, so "today" matches the user's clock. */
function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setDate(today.getDate() - 30);

// Circle Manager's defaults (Mumbai + last one month) — applied only when the
// user explicitly switches into the 'circle' persona (see setPersona below).
export const DEFAULT_FILTERS: AppliedFilters = {
  circles: ['Mumbai'],
  circleIds: [],
  functions: [],
  functionIds: [],
  zone: 'All Zones',
  zoneId: '',
  empType: 'Internal & External',
  empTypeId: '',
  // Last one month, by default: today and the 30 days before it.
  startDate: toISODate(oneMonthAgo),
  endDate: toISODate(today),
};

// The app's actual starting state (persona defaults to 'admin'/Pan India on
// load) — no preselected circle, but the same last-one-month date default as
// Circle Manager. setPersona('admin') only runs on an explicit persona switch,
// not on mount, so this mirrors that branch's dates directly.
const INITIAL_FILTERS: AppliedFilters = {
  circles: [],
  circleIds: [],
  functions: [],
  functionIds: [],
  zone: 'All Zones',
  zoneId: '',
  empType: 'Internal & External',
  empTypeId: '',
  startDate: toISODate(oneMonthAgo),
  endDate: toISODate(today),
};

type Ctx = {
  persona: Persona;
  setPersona: (p: Persona) => void;
  module: ModuleView;
  setModule: (m: ModuleView) => void;
  openAcc: AccordionKey;
  toggleAccordion: (key: AccordionKey) => void;
  pageTitle: string;
  setPageTitle: (t: string) => void;
  scopeText: string;
  setScopeText: (t: string) => void;
  kpiUsers: string;
  setKpiUsers: (v: string) => void;
  kpiLmc: string;
  setKpiLmc: (v: string) => void;
  kpiSmt: string;
  setKpiSmt: (v: string) => void;
  circles: string[];
  setCircles: (c: string[]) => void;
  circleIds: string[];
  setCircleIds: (ids: string[]) => void;
  functions: string[];
  setFunctions: (f: string[]) => void;
  functionIds: string[];
  setFunctionIds: (ids: string[]) => void;
  zone: string;
  setZone: (z: string) => void;
  zoneId: string;
  setZoneId: (id: string) => void;
  empType: string;
  setEmpType: (e: string) => void;
  empTypeId: string;
  setEmpTypeId: (id: string) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  /** Snapshots the live dropdown/date state into appliedFilters. `overrides` lets a caller
   *  (e.g. the circle-manager filter bar resolving a default circle's id after it loads)
   *  push a value in immediately without waiting on a stale render's closured state.
   *  `silent` skips the "Filter applied" toast — for automatic, not user-initiated, applies. */
  applyFilters: (overrides?: Partial<AppliedFilters>, opts?: { silent?: boolean }) => void;
  resetFilters: () => void;
  /** Snapshot of circle/functions/zone/empType/startDate/endDate taken at the last "Apply" click.
   *  API-fetching sections should key their fetches off this, not the live dropdown state, so
   *  data only refreshes once the user explicitly applies filters. */
  appliedFilters: AppliedFilters;
  drill: DrillState;
  openDrill: (id: string, title?: string) => void;
  closeDrill: () => void;
  toasts: ToastItem[];
  showToast: (message: string) => void;
  selectedAnalytics: string[];
  setSelectedAnalytics: (ids: string[]) => void;
  analyticsOpen: boolean;
  setAnalyticsOpen: (v: boolean) => void;
  /** Circle/function/employee-type dropdown options for the Circle Manager filter bar.
   *  Fetched once here (not in the filter bar) so switching to the 'circle' persona can
   *  resolve the default circle's real id synchronously, in the same state update, instead
   *  of a follow-up effect that would re-fire (and cancel) every section's in-flight fetch. */
  circleOptions: FilterOption[];
  functionOptions: FilterOption[];
  empTypeOptions: FilterOption[];
  loadingFilterOptions: boolean;
};

const MsafeDashboardContext = createContext<Ctx | null>(null);

export function MsafeDashboardProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>('admin');
  const [module, setModule] = useState<ModuleView>('msafe');
  const [openAcc, setOpenAcc] = useState<AccordionKey>(null);
  const [pageTitle, setPageTitle] = useState('M-Safe · All-India View');
  const [scopeText, setScopeText] = useState('27,438 registered users across 22 circles');
  const [kpiUsers, setKpiUsers] = useState('27,438');
  const [kpiLmc, setKpiLmc] = useState('1,284');
  const [kpiSmt, setKpiSmt] = useState('438');
  const [circles, setCircles] = useState<string[]>(INITIAL_FILTERS.circles);
  const [circleIds, setCircleIds] = useState<string[]>(INITIAL_FILTERS.circleIds);
  const [functions, setFunctions] = useState<string[]>(INITIAL_FILTERS.functions);
  const [functionIds, setFunctionIds] = useState<string[]>(INITIAL_FILTERS.functionIds);
  const [zone, setZone] = useState(INITIAL_FILTERS.zone);
  const [zoneId, setZoneId] = useState(INITIAL_FILTERS.zoneId);
  const [empType, setEmpType] = useState(INITIAL_FILTERS.empType);
  const [empTypeId, setEmpTypeId] = useState(INITIAL_FILTERS.empTypeId);
  const [startDate, setStartDate] = useState(INITIAL_FILTERS.startDate);
  const [endDate, setEndDate] = useState(INITIAL_FILTERS.endDate);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(INITIAL_FILTERS);
  const [drill, setDrill] = useState<DrillState>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([]);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [circleOptions, setCircleOptions] = useState<FilterOption[]>([]);
  const [functionOptions, setFunctionOptions] = useState<FilterOption[]>([]);
  const [empTypeOptions, setEmpTypeOptions] = useState<FilterOption[]>([
    { id: '', name: 'Internal & External' },
  ]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(true);

  // Fetched once here (rather than inside CircleManagerFilterBar) so the default circle's
  // real id can be resolved synchronously when switching personas — see setPersona/resetFilters.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const [circles, funcs, empTypes] = await Promise.all([
        fetchFilterOptions(
          'circle_level_filter.json',
          ['circles'],
          ['circle_name', 'name'],
          ['circle_id', 'id'],
          controller.signal,
        ).catch((err) => {
          if ((err as Error).name !== 'AbortError') console.error('Failed to load circle filter:', err);
          return [] as FilterOption[];
        }),
        fetchFilterOptions(
          'function_level_filter.json',
          ['functions'],
          ['function_name', 'name'],
          ['function_id', 'id'],
          controller.signal,
        ).catch((err) => {
          if ((err as Error).name !== 'AbortError') console.error('Failed to load function filter:', err);
          return [] as FilterOption[];
        }),
        fetchFilterOptions(
          'employee_type_filter.json',
          ['employee_types', 'types', 'data', 'result'],
          ['employee_type_name', 'employee_type', 'type_name', 'name'],
          ['employee_type', 'id'],
          controller.signal,
        ).catch((err) => {
          if ((err as Error).name !== 'AbortError') console.error('Failed to load employee type filter:', err);
          return [] as FilterOption[];
        }),
      ]);

      if (controller.signal.aborted) return;
      setCircleOptions(circles);
      setFunctionOptions(funcs);
      setEmpTypeOptions([{ id: '', name: 'Internal & External' }, ...empTypes]);
      setLoadingFilterOptions(false);
    })();
    return () => controller.abort();
  }, []);

  // Snapshot of circleOptions for callbacks below — avoids recreating setPersona/resetFilters
  // (and every context consumer memoized on them) on every options fetch tick.
  const circleOptionsRef = useRef(circleOptions);
  circleOptionsRef.current = circleOptions;

  const resolveDefaultCircles = useCallback((): { circles: string[]; circleIds: string[] } => {
    const defaultName = DEFAULT_FILTERS.circles[0];
    const match = circleOptionsRef.current.find((o) => o.name.toLowerCase().includes(defaultName.toLowerCase()));
    return {
      circles: [match?.name ?? defaultName],
      circleIds: match ? [match.id] : DEFAULT_FILTERS.circleIds,
    };
  }, []);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    if (p === 'admin') {
      // Pan India now shows the exact same filter bar as Circle Manager (Circle, Function,
      // Employee Type, Date range) — defaults to the same last-one-month date range as
      // Circle Manager each time this persona is entered, just without picking a circle.
      setCircles([]);
      setCircleIds([]);
      setFunctions(DEFAULT_FILTERS.functions);
      setFunctionIds(DEFAULT_FILTERS.functionIds);
      setZone(DEFAULT_FILTERS.zone);
      setZoneId(DEFAULT_FILTERS.zoneId);
      setEmpType(DEFAULT_FILTERS.empType);
      setEmpTypeId(DEFAULT_FILTERS.empTypeId);
      setStartDate(DEFAULT_FILTERS.startDate);
      setEndDate(DEFAULT_FILTERS.endDate);
      setAppliedFilters({
        ...DEFAULT_FILTERS,
        circles: [],
        circleIds: [],
      });
      setPageTitle('M-Safe · Pan India View');
      setScopeText('27,438 registered users across 22 circles');
      setKpiUsers('27,438');
      setKpiLmc('1,284');
      setKpiSmt('438');
    } else {
      // Circle Manager defaults to the Mumbai circle and the last one month of data — resolved
      // and applied in this single state update (not a follow-up effect) so every section's
      // fetch effect re-runs exactly once with the right circle_id, instead of once with an
      // empty circle_id and then again a moment later when the id gets resolved.
      const resolved = resolveDefaultCircles();
      setCircles(resolved.circles);
      setCircleIds(resolved.circleIds);
      setFunctions(DEFAULT_FILTERS.functions);
      setFunctionIds(DEFAULT_FILTERS.functionIds);
      setZone(DEFAULT_FILTERS.zone);
      setZoneId(DEFAULT_FILTERS.zoneId);
      setEmpType(DEFAULT_FILTERS.empType);
      setEmpTypeId(DEFAULT_FILTERS.empTypeId);
      setStartDate(DEFAULT_FILTERS.startDate);
      setEndDate(DEFAULT_FILTERS.endDate);
      setAppliedFilters({ ...DEFAULT_FILTERS, circles: resolved.circles, circleIds: resolved.circleIds });
      setPageTitle('M-Safe · Circle Manager');
      setScopeText('2,148 registered users · 12 clusters · 84 work locations');
      setKpiUsers('2,148');
      setKpiLmc('112');
      setKpiSmt('38');
    }
  }, [resolveDefaultCircles]);

  // HTML v6 behavior: sections stay mounted; KPI click highlights + smooth-scrolls
  const toggleAccordion = useCallback((key: AccordionKey) => {
    if (!key) return;
    setOpenAcc(key);
    const idMap: Record<Exclude<AccordionKey, null>, string> = {
      users: 'acc-users',
      krcc: 'acc-krcc',
      training: 'acc-training',
      lmc: 'acc-lmc',
      smt: 'acc-smt',
    };
    window.requestAnimationFrame(() => {
      document.getElementById(idMap[key])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    window.setTimeout(() => setOpenAcc(null), 1600);
  }, []);

  const openDrill = useCallback((id: string, title?: string) => {
    setDrill({
      id,
      title: title || '',
      crumb: 'M-Safe',
    });
  }, []);

  const closeDrill = useCallback(() => setDrill(null), []);

  const applyFilters = useCallback(
    (overrides?: Partial<AppliedFilters>, opts?: { silent?: boolean }) => {
      const next: AppliedFilters = {
        circles,
        circleIds,
        functions,
        functionIds,
        zone,
        zoneId,
        empType,
        empTypeId,
        startDate,
        endDate,
        ...overrides,
      };
      setAppliedFilters(next);
      setPageTitle(persona === 'circle' ? 'M-Safe · Circle Manager' : 'M-Safe · Pan India View');
      if (!opts?.silent) showToast('Filter applied');
    },
    [persona, circles, circleIds, functions, functionIds, zone, zoneId, empType, empTypeId, startDate, endDate, showToast],
  );

  // Rare-race fallback: covers the sliver of time where the user switches to Circle Manager
  // (or hits Reset) before circleOptions has finished its first load, so setPersona/resetFilters
  // resolved to the empty-id default. Once the options land, resolve and push the real id in.
  useEffect(() => {
    if (persona !== 'circle') return;
    const defaultName = DEFAULT_FILTERS.circles[0];
    if (circles.length !== 1 || circles[0] !== defaultName || circleIds.length > 0) return;
    const match = circleOptions.find((o) => o.name.toLowerCase().includes(defaultName.toLowerCase()));
    if (!match) return;
    setCircles([match.name]);
    setCircleIds([match.id]);
    applyFilters({ circles: [match.name], circleIds: [match.id] }, { silent: true });
  }, [persona, circles, circleIds, circleOptions, applyFilters]);

  // Reset clears the circle and date range entirely — unlike the persona-switch default
  // (Mumbai + last 30 days), "Reset" means no circle_id/from_date/to_date get sent at all,
  // and the Circle/date fields render empty. Function and employee type already default to
  // "no filter" (empty list / "Internal & External"), so those stay as-is.
  const resetFilters = useCallback(() => {
    setCircles([]);
    setCircleIds([]);
    setFunctions(DEFAULT_FILTERS.functions);
    setFunctionIds(DEFAULT_FILTERS.functionIds);
    setZone(DEFAULT_FILTERS.zone);
    setZoneId(DEFAULT_FILTERS.zoneId);
    setEmpType(DEFAULT_FILTERS.empType);
    setEmpTypeId(DEFAULT_FILTERS.empTypeId);
    setStartDate('');
    setEndDate('');
    setAppliedFilters({
      ...DEFAULT_FILTERS,
      circles: [],
      circleIds: [],
      startDate: '',
      endDate: '',
    });
    setPageTitle(persona === 'circle' ? 'M-Safe · Circle Manager' : 'M-Safe · Pan India View');
    showToast('Filter reset');
  }, [showToast, persona]);

  const value = useMemo(
    () => ({
      persona,
      setPersona,
      module,
      setModule,
      openAcc,
      toggleAccordion,
      pageTitle,
      setPageTitle,
      scopeText,
      setScopeText,
      kpiUsers,
      setKpiUsers,
      kpiLmc,
      setKpiLmc,
      kpiSmt,
      setKpiSmt,
      circles,
      setCircles,
      circleIds,
      setCircleIds,
      functions,
      setFunctions,
      functionIds,
      setFunctionIds,
      zone,
      setZone,
      zoneId,
      setZoneId,
      empType,
      setEmpType,
      empTypeId,
      setEmpTypeId,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      applyFilters,
      resetFilters,
      appliedFilters,
      drill,
      openDrill,
      closeDrill,
      toasts,
      showToast,
      selectedAnalytics,
      setSelectedAnalytics,
      analyticsOpen,
      setAnalyticsOpen,
      circleOptions,
      functionOptions,
      empTypeOptions,
      loadingFilterOptions,
    }),
    [
      persona,
      setPersona,
      module,
      openAcc,
      toggleAccordion,
      pageTitle,
      scopeText,
      kpiUsers,
      kpiLmc,
      kpiSmt,
      circles,
      circleIds,
      functions,
      functionIds,
      zone,
      zoneId,
      empType,
      empTypeId,
      startDate,
      endDate,
      applyFilters,
      appliedFilters,
      resetFilters,
      drill,
      openDrill,
      closeDrill,
      toasts,
      showToast,
      selectedAnalytics,
      analyticsOpen,
      circleOptions,
      functionOptions,
      empTypeOptions,
      loadingFilterOptions,
    ],
  );

  return <MsafeDashboardContext.Provider value={value}>{children}</MsafeDashboardContext.Provider>;
}

export function useMsafeDashboard() {
  const ctx = useContext(MsafeDashboardContext);
  if (!ctx) throw new Error('useMsafeDashboard must be used within MsafeDashboardProvider');
  return ctx;
}
