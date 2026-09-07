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
  type Site,
  type SiteGroup,
  type Tier,
} from '@/features/posthog-dashboard/data/constants';
import {
  buildAdopt,
  buildFlows,
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
import type { OsType } from '../api/adoptionApi';
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
  useSubModuleTree,
  useTrafficSession,
  useUsageAndDistribution,
  useWorkflowUsage,
  type QueryFilters,
} from '../api/queries';
import { paletteFor, type ChartPalette, type ViTheme } from '../data/palette';
import type { PageKey } from '../data/pages';
import { VI_WORKFLOWS, findWorkflow } from '../data/workflows';
import { VI_BM_DEFAULTS } from '../data/viMetricIds';
import {
  ViDashboardContext,
  type SectionStatus,
  type ViDashboardValue,
  type ViewModel,
  type ViPlatform,
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

/** `all` sends no `os` at all; the API is case-sensitive on the other two. */
function osParam(platform: ViPlatform): OsType[] {
  return platform === 'all' ? [] : [platform];
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
  // Unused: the shared state shape requires it, but this dashboard never sends device_type.
  dev: 'all',
  // Layer 3 is navigated by workflow (see data/workflows.ts), and the selected workflow
  // is what sets `module` — so this starts on the first workflow's module rather than on
  // whatever the `$pathname` tree happens to return first.
  module: VI_WORKFLOWS[0].apiModule,
  subModule: VI_WORKFLOWS[0].apiSubModule,
  sessTab: 'sessions',
  prev: true,
  // Required by the shared DashboardState shape, and deliberately left at null forever:
  // there is no seat input on this dashboard and the value is never sent, so A1 is whatever
  // the API resolves server-side.
  licensedSeats: null,
  activePage: 'pgTraffic',
  theme: 'light',
  navCollapsed: false,
};

export function ViDashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(DEFAULT_STATE);
  const [page, setPage] = useState<PageKey>('pgTraffic');
  const [workflow, setWorkflowKey] = useState<string>(VI_WORKFLOWS[0].key);
  const [theme, setTheme] = useState<ViTheme>(initialTheme);
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === 'collapsed');
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>({});
  // An explicit window overrides the rolling presets. dateRangeFor() always anchors to
  // today, so a custom start date has to bypass it entirely rather than be converted
  // into a day-count.
  const [customRange, setCustomRange] = useState<{ from: string; to: string } | null>(null);
  // Platform lives outside DashboardState: the shared state's `dev` is Desktop/Mobile
  // (`device_type`), and this dashboard filters by `os` instead — see ViPlatform.
  const [platform, setPlatform] = useState<ViPlatform>('all');

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

  // Hold the analytics calls until the site list has settled, so the header's scope label
  // and the metrics under it appear together rather than one render apart.
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

  const filters = useMemo<QueryFilters>(
    () => ({
      enabled: sitesSettled,
      from,
      to,
      os: osParam(platform),
      module: state.module,
      subModule: state.subModule,
    }),
    [
      sitesSettled, from, to, platform,
      state.module, state.subModule,
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

  const modules = useMemo(() => toModuleOptions(moduleTreeQ.data?.tree), [moduleTreeQ.data]);
  const subModules = useMemo(
    () => toModuleOptions(subModuleTreeQ.data?.tree),
    [subModuleTreeQ.data],
  );

  // No module/sub-module auto-defaulting here on purpose: `module` is derived from the
  // selected workflow below, and an effect that reset it to modules[0] on every tree
  // response would fight that and snap the funnel back to an unrelated module.

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
      // Circle-wise breakdown is hidden (see AdoptionSection) and `site_id` is never sent,
      // so there is nothing to build a per-site league from.
      siteHealth: null,
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
        siteHealth: { loading: false, error: null },
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
    queryFilters: filters,
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
    platform,
    setPlatform,
    setModule: (module) => setState((s) => ({ ...s, module, subModule: null })),
    setSubModule: (subModule) => setState((s) => ({ ...s, subModule })),
    workflow,
    setWorkflow: (key) => {
      const wf = findWorkflow(key);
      setWorkflowKey(wf.key);
      // The endpoint filters by module / sub_module, not by event-step list, so the route
      // segments the workflow lives under are what actually change the data. Both move
      // together — a sub_module from the previous module's tree would filter the new one
      // down to nothing. Both are null for mobile-only workflows, and WorkflowSection
      // renders those as awaiting data rather than querying and mislabelling the default.
      setState((s) => ({ ...s, module: wf.apiModule, subModule: wf.apiSubModule }));
    },
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

