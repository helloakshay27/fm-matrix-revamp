import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import {
  groupSites,
  type DateRange,
  type Device,
  type Site,
  type SiteGroup,
  type Tier,
} from '@/features/posthog-dashboard/data/constants';
import {
  buildAdopt,
  buildFlows,
  buildSiteHealth,
  buildTraffic,
  normalizeScope,
  scopeLabel as computeScopeLabel,
  scopeSites,
  toModuleOptions,
  type AdoptData,
  type DashboardState,
  type FlowsData,
  type ModuleOption,
  type SiteHealthData,
  type TrafficData,
} from '@/features/posthog-dashboard/data/metrics';
import type { DeviceType } from '../api/adoptionApi';
import {
  dateRangeFor,
  useAdoptionEngagement,
  useAdoptionTrend,
  useAllSites,
  useCompanyNames,
  useGrowth,
  useModuleTree,
  useRetention,
  useRoles,
  useSiteLeague,
  useSubModuleTree,
  useTrafficSession,
  useUsageAndDistribution,
  useWorkflowUsage,
  type QueryFilters,
} from '../api/queries';
import { paletteFor, type ChartPalette, type ViTheme } from '../data/palette';
import type { PageKey } from '../data/pages';
import { VI_BM_DEFAULTS } from '../data/viMetricIds';
import {
  ViDashboardContext,
  type SectionStatus,
  type ViDashboardValue,
  type ViewModel,
} from './viDashboardStore';

const THEME_KEY = 'vimyworkspace-theme';
const NAV_KEY = 'vimyworkspace-nav';

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

function initialTheme(): ViTheme {
  const stored = readStored(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/** `all` sends no `device_type` at all; the API is case-sensitive on the other two. */
function deviceParam(dev: Device): DeviceType[] {
  if (dev === 'desktop') return ['Desktop'];
  if (dev === 'mobile') return ['Mobile'];
  return [];
}

/**
 * Vi my Workspace defaults. Management tier over the whole organisation, matching the
 * source dashboard's own default, and no licensed-seat count until the user supplies one
 * (A1 comes back null in the meantime, by design).
 */
const DEFAULT_STATE: DashboardState = {
  tier: 't3',
  scope: 'org',
  date: 30,
  dev: 'all',
  module: null,
  subModule: null,
  sessTab: 'sessions',
  prev: true,
  licensedSeats: null,
  activePage: 'pgTraffic',
  theme: 'light',
  navCollapsed: false,
};

export function ViDashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(DEFAULT_STATE);
  const [page, setPage] = useState<PageKey>('pgTraffic');
  const [theme, setTheme] = useState<ViTheme>(initialTheme);
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === 'collapsed');
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>({});
  // An explicit window overrides the rolling presets. dateRangeFor() always anchors to
  // today, so a custom start date has to bypass it entirely rather than be converted
  // into a day-count.
  const [customRange, setCustomRange] = useState<{ from: string; to: string } | null>(null);

  /* ------------------------------------------------------- tenant metadata */

  const sitesQ = useAllSites();
  const companiesQ = useCompanyNames();
  const sites = useMemo<Site[]>(() => sitesQ.data ?? [], [sitesQ.data]);

  // The Regional tier groups by company — the one real hierarchy above a site. Sites with
  // no company_id simply don't appear in a group, so the tier degrades instead of faking one.
  const groups = useMemo<SiteGroup[]>(
    () => groupSites(sites, companiesQ.data ?? {}),
    [sites, companiesQ.data],
  );

  // Hold the analytics calls until the site list has settled — otherwise every endpoint
  // fires once for the whole tenant and again with the real site_id list.
  const sitesSettled = !sitesQ.isLoading;

  // Keep the current scope valid for the tier once the site/company lists resolve.
  useEffect(() => {
    setState((s) => {
      const next = normalizeScope(s.tier, s.scope, sites, groups);
      return next === s.scope ? s : { ...s, scope: next };
    });
  }, [sites, groups]);

  const { from, to } = useMemo(
    () => customRange ?? dateRangeFor(state.date),
    [customRange, state.date],
  );

  const scopedSites = useMemo(() => scopeSites(state, sites, groups), [state, sites, groups]);
  const siteIds = useMemo(() => scopedSites.map((s) => s.id), [scopedSites]);

  const filters = useMemo<QueryFilters>(
    () => ({
      enabled: sitesSettled,
      from,
      to,
      siteIds,
      devices: deviceParam(state.dev),
      licensedSeats: state.licensedSeats,
      module: state.module,
      subModule: state.subModule,
    }),
    [
      sitesSettled, from, to, siteIds,
      state.dev, state.licensedSeats, state.module, state.subModule,
    ],
  );

  /** A disabled query reports isLoading=false, so treat "not started yet" as loading too. */
  const pending = !sitesSettled;

  /* --------------------------------------------------------- the 9 endpoints */

  const trafficQ = useTrafficSession(filters);
  const usageQ = useUsageAndDistribution(filters);
  const engagementQ = useAdoptionEngagement(filters);
  const trendQ = useAdoptionTrend(filters);
  const growthQ = useGrowth(filters);
  const retentionQ = useRetention(filters);
  const rolesQ = useRoles(filters);
  const moduleTreeQ = useModuleTree(filters);
  const subModuleTreeQ = useSubModuleTree(filters);
  const workflowQ = useWorkflowUsage(filters);
  const league = useSiteLeague(filters, siteIds, scopedSites.length > 1);

  const modules = useMemo(() => toModuleOptions(moduleTreeQ.data?.tree), [moduleTreeQ.data]);
  const subModules = useMemo(
    () => toModuleOptions(subModuleTreeQ.data?.tree),
    [subModuleTreeQ.data],
  );

  // The module list is dynamic, so the initial selection has to wait for the tree.
  useEffect(() => {
    if (!modules.length) return;
    setState((s) => {
      if (s.module && modules.some((m) => m.name === s.module)) return s;
      return { ...s, module: modules[0].name, subModule: null };
    });
  }, [modules]);

  // Same for the sub-module: default to the busiest one under the selected module.
  useEffect(() => {
    if (!state.module) return;
    setState((s) => {
      if (s.subModule && subModules.some((m) => m.name === s.subModule)) return s;
      const first = subModules[0]?.name ?? null;
      return s.subModule === first ? s : { ...s, subModule: first };
    });
  }, [subModules, state.module]);

  /* ---------------------------------------------------------- the view model */

  const vm = useMemo<ViewModel>(
    () => ({
      state,
      scopeLabel: computeScopeLabel(state, sites, groups),
      traffic: buildTraffic(state, from, to, trafficQ.data, usageQ.data),
      adopt: buildAdopt(
        state,
        to,
        engagementQ.data,
        trendQ.data,
        growthQ.data,
        retentionQ.data,
        rolesQ.data,
      ),
      siteHealth: buildSiteHealth(league.entries, sites),
      flows: buildFlows(state, workflowQ.data),
      sites,
      scopedSites,
      groups,
      sitesLoading: sitesQ.isLoading,
      modules,
      subModules,
      status: {
        traffic: {
          loading: pending || trafficQ.isLoading || usageQ.isLoading,
          error: (trafficQ.error ?? usageQ.error) as Error | null,
        },
        adopt: {
          loading:
            pending ||
            engagementQ.isLoading ||
            trendQ.isLoading ||
            growthQ.isLoading ||
            retentionQ.isLoading ||
            rolesQ.isLoading,
          error: (engagementQ.error ??
            trendQ.error ??
            growthQ.error ??
            retentionQ.error ??
            rolesQ.error) as Error | null,
        },
        flows: {
          // `!state.module && modules.length` is the one render between the tree arriving
          // and the effect above picking a default module.
          loading:
            pending ||
            moduleTreeQ.isLoading ||
            workflowQ.isLoading ||
            (!state.module && modules.length > 0),
          error: (moduleTreeQ.error ?? workflowQ.error) as Error | null,
        },
        siteHealth: { loading: pending || league.isLoading, error: null },
      },
      generatedAt: trafficQ.data?.meta.generated_at ?? null,
      range: { from, to },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state, sites, scopedSites, groups, pending, from, to, modules, subModules,
      sitesQ.isLoading,
      trafficQ.data, trafficQ.isLoading, trafficQ.error,
      usageQ.data, usageQ.isLoading, usageQ.error,
      engagementQ.data, engagementQ.isLoading, engagementQ.error,
      trendQ.data, trendQ.isLoading, trendQ.error,
      growthQ.data, growthQ.isLoading, growthQ.error,
      retentionQ.data, retentionQ.isLoading, retentionQ.error,
      rolesQ.data, rolesQ.isLoading, rolesQ.error,
      moduleTreeQ.data, moduleTreeQ.isLoading, moduleTreeQ.error,
      workflowQ.data, workflowQ.isLoading, workflowQ.error,
      league.entries, league.isLoading,
    ],
  );

  /* -------------------------------------------------------------- refreshing */

  const queryClient = useQueryClient();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const isFetchingAdoption = useIsFetching({ queryKey: ['fm-adoption'] }) > 0;
  const isRefreshing = isManualRefreshing || isFetchingAdoption;

  const refreshAll = useCallback(async () => {
    setIsManualRefreshing(true);
    // Keep the refreshing state visible long enough to register as feedback.
    const minDelay = new Promise((resolve) => setTimeout(resolve, 650));
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['fm-adoption'], refetchType: 'all' }),
        queryClient.refetchQueries({ queryKey: ['fm-adoption'], type: 'active' }),
        minDelay,
      ]);
    } catch {
      // fetch errors are surfaced by the individual query observers
    } finally {
      setIsManualRefreshing(false);
    }
  }, [queryClient]);

  /* ------------------------------------------------------------------ chrome */

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next: ViTheme = t === 'dark' ? 'light' : 'dark';
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

  const getBenchmark = useCallback(
    (id: string): number | null => {
      if (id in benchmarks) return benchmarks[id];
      if (id in VI_BM_DEFAULTS) return VI_BM_DEFAULTS[id];
      return null;
    },
    [benchmarks],
  );

  const setBenchmark = useCallback((id: string, value: number | null) => {
    setBenchmarks((b) => ({ ...b, [id]: value }));
  }, []);

  const value: ViDashboardValue = {
    vm,
    setTier: (tier) =>
      setState((s) => ({ ...s, tier, scope: normalizeScope(tier, s.scope, sites, groups) })),
    setScope: (scope) => setState((s) => ({ ...s, scope })),
    /** One-shot tier+scope change, so the Circle selector never lands on an intermediate scope. */
    setCircle: (tier, scope) => setState((s) => ({ ...s, tier, scope })),
    setDate: (date) => {
      setCustomRange(null); // a preset replaces any custom window
      setState((s) => ({ ...s, date }));
    },
    setCustomRange: (f, t) => {
      if (!f || !t || f > t) return;
      setCustomRange({ from: f, to: t });
    },
    customRange,
    setDev: (dev) => setState((s) => ({ ...s, dev })),
    setLicensedSeats: (licensedSeats) => setState((s) => ({ ...s, licensedSeats })),
    setModule: (module) => setState((s) => ({ ...s, module, subModule: null })),
    setSubModule: (subModule) => setState((s) => ({ ...s, subModule })),
    setSessTab: (sessTab) => setState((s) => ({ ...s, sessTab })),
    togglePrev: () => setState((s) => ({ ...s, prev: !s.prev })),
    page,
    setPage,
    theme,
    toggleTheme,
    navCollapsed,
    toggleNav,
    palette: paletteFor(theme),
    refreshAll,
    isRefreshing,
    getBenchmark,
    setBenchmark,
  };

  return <ViDashboardContext.Provider value={value}>{children}</ViDashboardContext.Provider>;
}

