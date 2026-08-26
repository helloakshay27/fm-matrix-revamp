import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import {
  DEFAULT_STATE,
  normalizeScope,
  scopeLabel as computeScopeLabel,
  buildTraffic,
  buildAdopt,
  buildSiteHealth,
  buildFlows,
  isWholeTenant,
  scopeSites,
  toModuleOptions,
  type DashboardState,
  type TrafficData,
  type AdoptData,
  type SiteHealthData,
  type FlowsData,
  type ModuleOption,
} from "../data/metrics";
import {
  BM_DEFAULTS,
  groupSites,
  type Site,
  type SiteGroup,
} from "../data/constants";
import type { DateRange, Device, Tier } from "../data/constants";
import type { DeviceType } from "../api/adoptionApi";
import {
  dateRangeFor,
  useAllSites,
  useCompanyNames,
  useAdoptionEngagement,
  useAdoptionTrend,
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
} from "../api/queries";

function deviceParam(dev: Device): DeviceType[] {
  if (dev === "desktop") return ["Desktop"];
  if (dev === "mobile") return ["Mobile"];
  return [];
}

export interface SectionStatus {
  loading: boolean;
  error: Error | null;
}

export interface ViewModel {
  state: DashboardState;
  scopeLabel: string;
  traffic: TrafficData;
  adopt: AdoptData;
  siteHealth: SiteHealthData | null;
  flows: FlowsData;
  sites: Site[];
  /** The sites the current tier + scope covers. */
  scopedSites: Site[];
  /** Companies the site list groups into — the Regional tier's options. */
  groups: SiteGroup[];
  /** True while the site-list fetch is still in flight. */
  sitesLoading: boolean;
  /** Layer-3 module tree, derived server-side from real `$pathname` segments. */
  modules: ModuleOption[];
  subModules: ModuleOption[];
  status: {
    traffic: SectionStatus;
    adopt: SectionStatus;
    flows: SectionStatus;
    siteHealth: SectionStatus;
  };
  /** Progress of the per-site `traffic_session` fan-out behind the site-wise table. */
  siteLeague: { loaded: number; failed: number; total: number; skipped: number };
  /** `generated_at` of the Layer-1 response — the freshness stamp shown in the header. */
  generatedAt: string | null;
  range: { from: string; to: string };
}

interface InfoPopoverState {
  key: string;
  rect: DOMRect;
}
interface AiPanelState {
  chartKey: string;
}

interface DashboardContextValue {
  vm: ViewModel;
  setTier: (tier: Tier) => void;
  setScope: (scope: string) => void;
  setDate: (date: DateRange) => void;
  setDev: (dev: Device) => void;
  setModule: (module: string) => void;
  setSubModule: (subModule: string) => void;
  setSessTab: (tab: DashboardState["sessTab"]) => void;
  setLicensedSeats: (seats: number | null) => void;
  setActivePage: (page: DashboardState["activePage"]) => void;
  setTheme: (theme: DashboardState["theme"]) => void;
  setNavCollapsed: (collapsed: boolean) => void;
  togglePrev: () => void;
  refreshAll: () => void;
  isRefreshing: boolean;
  benchmarks: Record<string, number | null>;
  getBenchmark: (id: string) => number | null;
  setBenchmark: (id: string, value: number | null) => void;
  infoPopover: InfoPopoverState | null;
  openInfoPopover: (key: string, rect: DOMRect) => void;
  closeInfoPopover: () => void;
  aiPanel: AiPanelState | null;
  openAiPanel: (chartKey: string) => void;
  closeAiPanel: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(DEFAULT_STATE);
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>(
    {}
  );
  const [infoPopover, setInfoPopover] = useState<InfoPopoverState | null>(null);
  const [aiPanel, setAiPanel] = useState<AiPanelState | null>(null);

  // Every site on the tenant (/pms/sites.json), deliberately NOT allowed_sites — the scope
  // dropdown lists all sites regardless of what the signed-in user is assigned to.
  const sitesQ = useAllSites();
  const companiesQ = useCompanyNames();
  const sites = useMemo<Site[]>(() => sitesQ.data ?? [], [sitesQ.data]);

  // The Regional tier groups by company — the one real hierarchy above a site. Sites with
  // no company_id simply don't appear in a group, so the tier degrades instead of faking one.
  const groups = useMemo<SiteGroup[]>(
    () => groupSites(sites, companiesQ.data ?? {}),
    [sites, companiesQ.data]
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

  const { from, to } = useMemo(() => dateRangeFor(state.date), [state.date]);

  // Sync theme and nav to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    if (state.navCollapsed) {
      document.documentElement.classList.add('nav-collapsed');
    } else {
      document.documentElement.classList.remove('nav-collapsed');
    }
    // Try to save to localStorage as well
    try {
      localStorage.setItem('fmx-theme', state.theme);
      localStorage.setItem('fmx-nav', state.navCollapsed ? 'collapsed' : 'expanded');
    } catch (e) {}
  }, [state.theme, state.navCollapsed]);

  // Read initial theme/nav state from local storage on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem('fmx-theme');
      const n = localStorage.getItem('fmx-nav');
      setState(s => {
        let updated = false;
        const nextState = { ...s };
        if (t === 'dark' || t === 'light') {
          nextState.theme = t;
          updated = true;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          nextState.theme = 'dark';
          updated = true;
        }
        if (n === 'collapsed' || n === 'expanded') {
          nextState.navCollapsed = n === 'collapsed';
          updated = true;
        }
        return updated ? nextState : s;
      });
    } catch (e) {}
  }, []);

  const scopedSites = useMemo(
    () => scopeSites(state, sites, groups),
    [state, sites, groups]
  );

  // Always pass the current user's site IDs so the API only returns data
  // for sites belonging to the user's selected organisation.
  const siteIds = useMemo(
    () => scopedSites.map((s) => s.id),
    [scopedSites]
  );

  /** All site IDs in scope — sent as a single comma-separated API call. */
  const leagueSiteIds = useMemo(
    () => scopedSites.map((s) => s.id),
    [scopedSites]
  );

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
    [sitesSettled, from, to, siteIds, state.dev, state.licensedSeats, state.module, state.subModule]
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

  const league = useSiteLeague(filters, leagueSiteIds, scopedSites.length > 1);

  const modules = useMemo(() => toModuleOptions(moduleTreeQ.data?.tree), [moduleTreeQ.data]);
  const subModules = useMemo(
    () => toModuleOptions(subModuleTreeQ.data?.tree),
    [subModuleTreeQ.data]
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
        rolesQ.data
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
          // and the effect below picking a default module.
          loading:
            pending ||
            moduleTreeQ.isLoading ||
            workflowQ.isLoading ||
            (!state.module && modules.length > 0),
          error: (moduleTreeQ.error ?? workflowQ.error) as Error | null,
        },
        siteHealth: { loading: pending || league.isLoading, error: null },
      },
      siteLeague: {
        loaded: league.loaded,
        failed: league.failed,
        total: league.total,
        skipped: Math.max(0, scopedSites.length - league.total),
      },
      generatedAt: trafficQ.data?.meta.generated_at ?? null,
      range: { from, to },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state,
      sites,
      scopedSites,
      groups,
      pending,
      from,
      to,
      modules,
      subModules,
      trafficQ.data,
      trafficQ.isLoading,
      trafficQ.error,
      usageQ.data,
      usageQ.isLoading,
      usageQ.error,
      engagementQ.data,
      engagementQ.isLoading,
      engagementQ.error,
      trendQ.data,
      trendQ.isLoading,
      trendQ.error,
      growthQ.data,
      growthQ.isLoading,
      growthQ.error,
      retentionQ.data,
      retentionQ.isLoading,
      retentionQ.error,
      rolesQ.data,
      rolesQ.isLoading,
      rolesQ.error,
      moduleTreeQ.data,
      moduleTreeQ.isLoading,
      moduleTreeQ.error,
      workflowQ.data,
      workflowQ.isLoading,
      workflowQ.error,
      league.entries,
      league.isLoading,
      league.loaded,
      league.failed,
      league.total,
    ]
  );

  const queryClient = useQueryClient();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const isFetchingAdoption = useIsFetching({ queryKey: ["fm-adoption"] }) > 0;
  const isRefreshing = isManualRefreshing || isFetchingAdoption;

  const refreshAll = async () => {
    setIsManualRefreshing(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 650));
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["fm-adoption"], refetchType: "all" }),
        queryClient.refetchQueries({ queryKey: ["fm-adoption"], type: "active" }),
        minDelay,
      ]);
    } catch {
      // ignore fetch errors handled by query observers
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const value: DashboardContextValue = {
    vm,
    setTier: (tier) =>
      setState((s) => ({ ...s, tier, scope: normalizeScope(tier, s.scope, sites, groups) })),
    setScope: (scope) => setState((s) => ({ ...s, scope })),
    setDate: (date) => setState((s) => ({ ...s, date })),
    setDev: (dev) => setState((s) => ({ ...s, dev })),
    setModule: (module) => setState((s) => ({ ...s, module, subModule: null })),
    setSubModule: (subModule) => setState((s) => ({ ...s, subModule })),
    setSessTab: (sessTab) => setState((s) => ({ ...s, sessTab })),
    setLicensedSeats: (licensedSeats) => setState((s) => ({ ...s, licensedSeats })),
    setActivePage: (activePage) => setState((s) => ({ ...s, activePage })),
    setTheme: (theme) => setState((s) => ({ ...s, theme })),
    setNavCollapsed: (navCollapsed) => setState((s) => ({ ...s, navCollapsed })),
    togglePrev: () => setState((s) => ({ ...s, prev: !s.prev })),
    refreshAll,
    isRefreshing,
    benchmarks,
    getBenchmark: (id) =>
      id in benchmarks
        ? benchmarks[id]
        : id in BM_DEFAULTS
          ? BM_DEFAULTS[id]
          : null,
    setBenchmark: (id, val) => setBenchmarks((b) => ({ ...b, [id]: val })),
    infoPopover,
    openInfoPopover: (key, rect) => setInfoPopover({ key, rect }),
    closeInfoPopover: () => setInfoPopover(null),
    aiPanel,
    openAiPanel: (chartKey) => setAiPanel({ chartKey }),
    closeAiPanel: () => setAiPanel(null),
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used within a DashboardProvider");
  return ctx;
}
