import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import {
  buildAdopt,
  buildFlows,
  buildTraffic,
  toModuleOptions,
  DEFAULT_STATE,
  type DashboardState,
} from '@/features/posthog-dashboard/data/metrics';
import { dateRangeFor } from '@/features/analytics-dashboard-shared/dateRange';
import { paletteFor, type DashboardTheme } from '@/features/analytics-dashboard-shared/palette';
import {
  ROOT,
  useAdoptionEngagement,
  useAdoptionTrend,
  useGrowth,
  useCalendarModule,
  useModuleTree,
  useRetention,
  useRoles,
  useTrafficSession,
  useUsageAndDistribution,
  useWorkflowUsage,
  type QueryFilters,
} from '../api/queries';
import type { DeviceType } from '../api/adoptionApi';
import { BM_DEFAULTS, findWorkflow, type DateRange, type Device } from '../data/constants';
import type { PageKey } from '../data/pages';
import {
  CalendarDashboardContext,
  type CalendarDashboardValue,
  type SectionStatus,
  type ViewModel,
} from './calendarDashboardStore';

const THEME_KEY = 'calendar-theme';
const NAV_KEY = 'calendar-nav';

/** Best-effort persistence — storage may be unavailable (private mode, embedded webview). */
function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function initialTheme(): DashboardTheme {
  const saved = readStored(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/** UI toggle → the API's case-sensitive `device_type` values. `all` sends no filter. */
function devicesFor(dev: Device): DeviceType[] {
  if (dev === 'desktop') return ['Desktop'];
  if (dev === 'mobile') return ['Mobile'];
  return [];
}

function statusOf(q: { isLoading: boolean; error: unknown }): SectionStatus {
  return { loading: q.isLoading, error: (q.error as Error) ?? null };
}

/** The worst state across several calls — a section is only "ready" once all of them are. */
function combine(...s: SectionStatus[]): SectionStatus {
  return {
    loading: s.some((x) => x.loading),
    error: s.find((x) => x.error)?.error ?? null,
  };
}

export function CalendarDashboardProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<DateRange>(30);
  const [customRange, setCustomRangeState] = useState<{ from: string; to: string } | null>(null);
  const [dev, setDevState] = useState<Device>('all');
  const [sessTab, setSessTabState] = useState<DashboardState['sessTab']>('visitors');
  const [prev, setPrev] = useState(true);
  const [workflow, setWorkflowState] = useState('eventCreate');
  const [page, setPage] = useState<PageKey>('pgTraffic');
  const [theme, setTheme] = useState<DashboardTheme>(initialTheme);
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === 'collapsed');
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>({});

  /* Follow the OS only while the viewer has made no explicit choice of their own. */
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onOS = (e: MediaQueryListEvent) => {
      if (!readStored(THEME_KEY)) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onOS);
    return () => mq.removeEventListener('change', onOS);
  }, []);

  const range = useMemo(() => customRange ?? dateRangeFor(date), [customRange, date]);
  const wf = findWorkflow(workflow);

  const filters: QueryFilters = useMemo(
    () => ({
      from: range.from,
      to: range.to,
      devices: devicesFor(dev),
      module: wf.apiModule,
      subModule: wf.apiSubModule,
    }),
    [range.from, range.to, dev, wf.apiModule, wf.apiSubModule],
  );

  /* ---- the nine endpoints ---- */
  const trafficQ = useTrafficSession(filters);
  const usageQ = useUsageAndDistribution(filters);
  const engQ = useAdoptionEngagement(filters);
  const trendQ = useAdoptionTrend(filters);
  const growthQ = useGrowth(filters);
  const retentionQ = useRetention(filters);
  const rolesQ = useRoles(filters);
  const modulesQ = useModuleTree(filters);
  const calendarScopeQ = useCalendarModule(filters);
  const workflowQ = useWorkflowUsage(filters);

  /**
   * The shared `metrics.ts` builders read their inputs off a `DashboardState`. Calendar has no
   * tier/scope/site dimension, so those keep the shared defaults and only the filters this
   * dashboard actually exposes are set.
   */
  const state: DashboardState = useMemo(
    () => ({
      ...DEFAULT_STATE,
      date,
      dev,
      sessTab,
      prev,
      module: wf.apiModule,
      subModule: wf.apiSubModule,
      activePage: page,
      theme,
      navCollapsed,
    }),
    [date, dev, sessTab, prev, wf.apiModule, wf.apiSubModule, page, theme, navCollapsed],
  );

  const vm: ViewModel = useMemo(() => {
    const trafficStatus = combine(statusOf(trafficQ), statusOf(usageQ));
    const adoptStatus = combine(
      statusOf(engQ), statusOf(trendQ), statusOf(growthQ),
      statusOf(retentionQ), statusOf(rolesQ),
    );
    // A workflow with no web route is never fetched, so it reads as ready-and-empty rather
    // than as a call stuck loading forever.
    const flowsStatus: SectionStatus = wf.apiModule
      ? statusOf(workflowQ)
      : { loading: false, error: null };

    return {
      state,
      traffic: buildTraffic(state, range.from, range.to, trafficQ.data, usageQ.data),
      adopt: buildAdopt(
        state, range.to, engQ.data, trendQ.data, growthQ.data, retentionQ.data, rolesQ.data,
      ),
      flows: buildFlows(state, wf.apiModule ? workflowQ.data : undefined),
      modules: toModuleOptions(modulesQ.data?.tree),
      calendarScope: calendarScopeQ.data ?? null,
      status: {
        traffic: trafficStatus,
        adopt: adoptStatus,
        flows: flowsStatus,
        modules: statusOf(modulesQ),
        calendarScope: statusOf(calendarScopeQ),
      },
      generatedAt: trafficQ.data?.meta?.generated_at ?? null,
      range,
      scopeLabel: dev === 'all' ? 'All users · all platforms' : `All users · ${dev}`,
    };
    /* Depend on each query's `data` / `isLoading` / `error` rather than on the query objects
       themselves: React Query hands back a new object identity on every render, so listing
       `trafficQ` would make this memo recompute every time and defeat the point. Every field
       the body reads is listed below, so the memo is still correct — the rule just can't see
       through the property access. Same approach as ViDashboardContext. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state, range, dev, wf.apiModule,
    trafficQ.data, trafficQ.isLoading, trafficQ.error,
    usageQ.data, usageQ.isLoading, usageQ.error,
    engQ.data, engQ.isLoading, engQ.error,
    trendQ.data, trendQ.isLoading, trendQ.error,
    growthQ.data, growthQ.isLoading, growthQ.error,
    retentionQ.data, retentionQ.isLoading, retentionQ.error,
    rolesQ.data, rolesQ.isLoading, rolesQ.error,
    modulesQ.data, modulesQ.isLoading, modulesQ.error,
    calendarScopeQ.data, calendarScopeQ.isLoading, calendarScopeQ.error,
    workflowQ.data, workflowQ.isLoading, workflowQ.error,
  ]);

  /* ---- actions ---- */

  const setPreset = useCallback((d: DateRange) => {
    setCustomRangeState(null);
    setDate(d);
  }, []);

  const setCustomRange = useCallback((from: string, to: string) => {
    if (!from || !to) return;
    setCustomRangeState({ from, to });
  }, []);

  const setDev = useCallback((d: Device) => setDevState(d), []);
  const setSessTab = useCallback((t: DashboardState['sessTab']) => setSessTabState(t), []);
  const setWorkflow = useCallback((key: string) => setWorkflowState(key), []);
  const togglePrev = useCallback(() => setPrev((p) => !p), []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      writeStored(THEME_KEY, next);
      return next;
    });
  }, []);

  const toggleNav = useCallback(() => {
    setNavCollapsed((c) => {
      writeStored(NAV_KEY, c ? 'open' : 'collapsed');
      return !c;
    });
  }, []);

  const queryClient = useQueryClient();
  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [...ROOT] });
  }, [queryClient]);
  const isRefreshing = useIsFetching({ queryKey: [...ROOT] }) > 0;

  const getBenchmark = useCallback(
    (id: string): number | null => {
      if (id in benchmarks) return benchmarks[id];
      if (id in BM_DEFAULTS) return BM_DEFAULTS[id];
      return null;
    },
    [benchmarks],
  );

  const setBenchmark = useCallback((id: string, value: number | null) => {
    setBenchmarks((b) => ({ ...b, [id]: value }));
  }, []);

  const value = useMemo<CalendarDashboardValue>(
    () => ({
      vm,
      setPreset, setCustomRange, customRange, setDev, setSessTab,
      workflow, setWorkflow, togglePrev,
      page, setPage, theme, toggleTheme, navCollapsed, toggleNav,
      palette: paletteFor(theme),
      refreshAll, isRefreshing,
      getBenchmark, setBenchmark,
    }),
    [
      vm, setPreset, setCustomRange, customRange, setDev, setSessTab,
      workflow, setWorkflow, togglePrev, page, theme, toggleTheme,
      navCollapsed, toggleNav, refreshAll, isRefreshing, getBenchmark, setBenchmark,
    ],
  );

  return <CalendarDashboardContext.Provider value={value}>{children}</CalendarDashboardContext.Provider>;
}
