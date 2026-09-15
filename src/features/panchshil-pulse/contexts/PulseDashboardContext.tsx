import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { BM_DEFAULTS } from "../data/sampleData";
import {
  DEFAULT_STATE,
  buildTraffic,
  buildAdopt,
  buildFlows,
  buildModuleHealth,
  toModuleOptions,
  type DashboardState,
  type TrafficData,
  type AdoptData,
  type FlowsData,
  type ModuleHealthData,
  type ModuleOption,
} from "../../posthog-dashboard/data/metrics";
import {
  groupSites,
  type Device,
  type Site,
  type SiteGroup,
} from "../../posthog-dashboard/data/constants";
import type { DeviceType } from "../../posthog-dashboard/api/adoptionApi";
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
  useSubModuleTree,
  useTrafficSession,
  useUsageAndDistribution,
  useWorkflowUsage,
  type QueryFilters,
} from "../../posthog-dashboard/api/queries";

/**
 * Pulse reuses the posthog-dashboard's API/query/transform layer wholesale — the
 * endpoint paths, query params, response contracts, caching, refresh and UI
 * mappings are identical. The only differences here are the visible labels and
 * the fact that Pulse always passes the org-scoped site list (or, once the site
 * metadata resolves, the site selected in the FilterBar).
 */
export type Dev = Device; // 'all' | 'desktop' | 'mobile'
export type SessTab = DashboardState["sessTab"];
type AnalyticsSection = "traffic" | "adopt" | "flows";

function sectionForPath(pathname: string): AnalyticsSection {
  if (pathname.endsWith("/adoption-engagement")) return "adopt";
  if (pathname.endsWith("/workflow-usage")) return "flows";
  return "traffic";
}

function deviceParam(dev: Dev): DeviceType[] {
  if (dev === "desktop") return ["Desktop"];
  if (dev === "mobile") return ["Mobile"];
  return [];
}

/* Pulse's platform selector maps onto the Connect-style platform values used to
   build the single `os`/`device_type` API param (see getDeviceInfo): the iOS
   button sends "ios" → `os=ios`, the Mobile/Android button sends "android" →
   `os=Android`, and "all" sends `device_type=Desktop,Mobile` so every platform's
   usage is included. No `dev` value is ever sent — only the resulting
   os/device_type param. */
function pulseDev(dev: Dev): string {
  if (dev === "desktop") return "ios";
  if (dev === "mobile") return "android";
  return "all";
}

export interface SectionStatus {
  loading: boolean;
  error: Error | null;
}

export interface PulseViewModel {
  scopeLabel: string;
  traffic: TrafficData;
  adopt: AdoptData;
  siteHealth: ModuleHealthData | null;
  flows: FlowsData;
  sites: Site[];
  /** The sites covered by the current FilterBar scope ("All Sites" = every org site). */
  scopedSites: Site[];
  groups: SiteGroup[];
  /** Layer-3 module tree — drives the Workflow Usage nav. */
  modules: ModuleOption[];
  subModules: ModuleOption[];
  status: {
    traffic: SectionStatus;
    adopt: SectionStatus;
    flows: SectionStatus;
    siteHealth: SectionStatus;
  };
  /** `generated_at` of the Layer-1 response — the freshness stamp shown in the header. */
  generatedAt: string | null;
  range: { from: string; to: string };
}

export interface PulseDashboardContextProps {
  dev: Dev;
  setDev: (dev: Dev) => void;
  prev: boolean;
  setPrev: (prev: boolean) => void;
  project: string;
  setProject: (project: string) => void;
  range: number;
  setRange: (range: number) => void;
  rangeLabel: string;
  setRangeLabel: (label: string) => void;
  rangeFrom: string;
  setRangeFrom: (date: string) => void;
  rangeTo: string;
  setRangeTo: (date: string) => void;
  sessTab: SessTab;
  setSessTab: (tab: SessTab) => void;
  module: string | null;
  setModule: (module: string) => void;
  subModule: string | null;
  setSubModule: (subModule: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  benchmarks: Record<string, number | null>;
  updateBenchmark: (id: string, value: number | null) => void;
  vm: PulseViewModel;
  refreshAll: () => void;
  isRefreshing: boolean;
}

const PulseDashboardContext = createContext<
  PulseDashboardContextProps | undefined
>(undefined);

export const PulseDashboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const init = useMemo(() => dateRangeFor(30), []);

  // Which analytics section the current URL maps to. The section shown on first
  // entry (e.g. the Traffic page when opening from the app header) loads
  // automatically via the loadedSections initializer; the other sections load
  // when the user navigates to them.
  const activeSection = useMemo(
    () => sectionForPath(location.pathname),
    [location.pathname]
  );

  const [dev, setDev] = useState<Dev>("all");
  const [prev, setPrev] = useState<boolean>(true);
  const [project, setProject] = useState<string>("all");
  const [range, setRange] = useState<number>(30);
  const [rangeLabel, setRangeLabel] = useState<string>("Last 30 days");
  const [rangeFrom, setRangeFrom] = useState<string>(init.from);
  const [rangeTo, setRangeTo] = useState<string>(init.to);
  const [sessTab, setSessTab] = useState<SessTab>("sessions");
  const [module, setModuleState] = useState<string | null>(null);
  const [subModule, setSubModuleState] = useState<string | null>(null);
  const [loadedSections, setLoadedSections] = useState<Record<AnalyticsSection, boolean>>(() => ({
    traffic: activeSection === "traffic",
    adopt: activeSection === "adopt",
    flows: activeSection === "flows",
  }));
  const [requestId, setRequestId] = useState(0);
  const hasRequestedAnalytics = Object.values(loadedSections).some(Boolean);
  const initialLocationKey = useRef(location.key);

  // A click on a Layer link changes React Router's location key. Load that
  // destination once; the section entered on the initial page view is already
  // enabled by the loadedSections initializer above, and re-visiting a loaded
  // section reuses its cached data instead of bumping the request id again.
  useEffect(() => {
    if (location.key === initialLocationKey.current) return;
    if (loadedSections[activeSection]) return;
    setLoadedSections((sections) => ({ ...sections, [activeSection]: true }));
    setRequestId((id) => id + 1);
  }, [location.key, activeSection, loadedSections]);

  // Theme state — always start the dashboard in the app's existing light theme.
  // Do NOT restore a persisted dark preference or auto-detect the user's system
  // color scheme, so entering the dashboard never forces dark mode on the app.
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  // Sidebar collapse state
  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("pulse-nav");
      return stored === "collapsed";
    } catch {
      // localStorage can throw in restrictive contexts — default to expanded
    }
    return false;
  });

  // Benchmarks targets state
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>(
    {}
  );

  const updateBenchmark = (id: string, value: number | null) => {
    setBenchmarks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const setModule = (m: string) => {
    setModuleState(m);
    setSubModuleState(null);
  };

  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
  };

  const setCollapsed = (c: boolean) => {
    setCollapsedState(c);
    try {
      localStorage.setItem("pulse-nav", c ? "collapsed" : "open");
    } catch {
      // non-fatal: nav persistence is best-effort
    }
  };

  // Sync theme attribute with html element.
  // This writes a global attribute on <html>, so capture the parent application's
  // prior state and restore it exactly when the dashboard unmounts — otherwise the
  // data-theme (and the dark CSS variables it enables) would leak into the rest of
  // the application after leaving the Pulse dashboard.
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", theme);
    return () => {
      if (previousTheme === null) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", previousTheme);
      }
    };
  }, [theme]);

  // Sync collapsed class with html element
  useEffect(() => {
    if (collapsed) {
      document.documentElement.classList.add("nav-collapsed");
    } else {
      document.documentElement.classList.remove("nav-collapsed");
    }
  }, [collapsed]);

  // Handle keydown event for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "[" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      const tag = t && t.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (t && t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setCollapsed(!collapsed);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [collapsed]);

  /* ------------------------------------------------------- data orchestration */

  // Every site on the tenant (/pms/sites.json) — drives the All Sites / per-site scope.
  // Site metadata is fetched once analytics have been requested, which now
  // includes the initial page view's section.
  const sitesQ = useAllSites(hasRequestedAnalytics);
  const companiesQ = useCompanyNames(hasRequestedAnalytics);
  const sites = useMemo<Site[]>(() => sitesQ.data ?? [], [sitesQ.data]);
  const groups = useMemo<SiteGroup[]>(
    () => groupSites(sites, companiesQ.data ?? {}),
    [sites, companiesQ.data]
  );

  // "All Sites" covers every org site; a selection covers just that one.
  const scopedSites = useMemo(() => {
    if (project === "all") return sites;
    return sites.filter((s) => s.id === project);
  }, [project, sites]);

  // If the selected site drops out of the org list, fall back to All Sites.
  useEffect(() => {
    if (project === "all" || sitesQ.isLoading) return;
    if (!sites.some((s) => s.id === project)) setProject("all");
  }, [project, sites, sitesQ.isLoading]);

  // Hold the analytics calls until the site list has settled — otherwise every
  // endpoint fires once for the whole tenant and again with the real site_id list.
  // Do not call analytics without an explicit site scope. An empty site list is
  // a valid no-access state; a failed lookup is surfaced to the dashboard.
  const sitesSettled = sitesQ.isSuccess && sites.length > 0;

  const filters = useMemo<QueryFilters>(
    () => ({
      enabled: sitesSettled,
      from: rangeFrom,
      to: rangeTo,
      // Panchshil Pulse must NOT send `site_id` to the analytics API — the
      // request carries only project_code/from/to plus the device param. Keep
      // the site list for the scope label/UI, but never forward it as a filter:
      // an empty array makes buildQuery drop the `site_id` param entirely.
      siteIds: [],
      devices: deviceParam(dev),
      dev: pulseDev(dev),
      licensedSeats: null,
      module,
      subModule,
      requestId,
    }),
    [sitesSettled, rangeFrom, rangeTo, dev, module, subModule, requestId]
  );

  /** A disabled query reports isLoading=false, so treat "not started yet" as loading too. */
  const pending = sitesQ.isLoading;

  /* --------------------------------------------------------- route-scoped API calls */

  // The section shown when the dashboard opens (e.g. Traffic & Session) loads
  // automatically on first entry. Navigating to another Layer tab enables that
  // section via the location-key effect; Refresh re-requests the active section.

  const trafficFilters = useMemo(
    () => ({
      ...filters,
      enabled: filters.enabled && activeSection === "traffic" && loadedSections.traffic,
    }),
    [filters, activeSection, loadedSections.traffic]
  );
  const adoptionFilters = useMemo(
    () => ({
      ...filters,
      enabled: filters.enabled && activeSection === "adopt" && loadedSections.adopt,
    }),
    [filters, activeSection, loadedSections.adopt]
  );
  const workflowFilters = useMemo(
    () => ({
      ...filters,
      enabled: filters.enabled && activeSection === "flows" && loadedSections.flows,
    }),
    [filters, activeSection, loadedSections.flows]
  );

  const trafficQ = useTrafficSession(trafficFilters);
  const usageQ = useUsageAndDistribution(trafficFilters);
  const engagementQ = useAdoptionEngagement(adoptionFilters);
  const trendQ = useAdoptionTrend(adoptionFilters);
  const growthQ = useGrowth(adoptionFilters);
  const retentionQ = useRetention(adoptionFilters);
  const rolesQ = useRoles(adoptionFilters);
  // The module tree powers BOTH the Workflow Usage nav and the adoption tab's
  // site-wise breakdown — exactly like Connect's `useModuleTree`. The adoption
  // layer therefore fetches the tree too, not just the workflow layer.
  const moduleTreeQ = useModuleTree(
    activeSection === "adopt" || activeSection === "flows"
      ? {
          ...filters,
          enabled:
            filters.enabled &&
            (activeSection === "adopt"
              ? loadedSections.adopt
              : loadedSections.flows),
        }
      : { ...filters, enabled: false }
  );
  const subModuleTreeQ = useSubModuleTree(workflowFilters);
  const workflowQ = useWorkflowUsage(workflowFilters, { requireModule: false });

  const modules = useMemo(
    () => toModuleOptions(moduleTreeQ.data?.tree),
    [moduleTreeQ.data]
  );
  const subModules = useMemo(
    () => toModuleOptions(subModuleTreeQ.data?.tree),
    [subModuleTreeQ.data]
  );

  // The module list is dynamic, so the initial selection has to wait for the tree.
  useEffect(() => {
    if (!modules.length) return;
    setModuleState((curr) => {
      if (curr && modules.some((m) => m.name === curr)) return curr;
      return modules[0].name;
    });
  }, [modules]);

  // Same for the sub-module: default to the busiest one under the selected module.
  useEffect(() => {
    if (!module) return;
    setSubModuleState((curr) => {
      if (curr && subModules.some((m) => m.name === curr)) return curr;
      return subModules[0]?.name ?? null;
    });
  }, [subModules, module]);

  // The posthog metric builders expect a DashboardState — reuse DEFAULT_STATE so the
  // shared sess-tab / module semantics (and any future behaviour) stay identical.
  const dashState = useMemo<DashboardState>(
    () => ({ ...DEFAULT_STATE, sessTab, module, subModule }),
    [sessTab, module, subModule]
  );

  const scopeLabel = useMemo(() => {
    if (!sites.length) return "Whole tenant · Registered residents";
    if (project === "all")
      return `All sites · ${sites.length} sites · Registered residents`;
    const s = sites.find((x) => x.id === project);
    return `${s?.name ?? "Unknown site"} · Registered residents`;
  }, [project, sites]);

  const vm = useMemo<PulseViewModel>(
    () => ({
      scopeLabel,
      traffic: buildTraffic(
        dashState,
        rangeFrom,
        rangeTo,
        trafficQ.data,
        usageQ.data
      ),
      adopt: buildAdopt(
        dashState,
        rangeTo,
        engagementQ.data,
        trendQ.data,
        growthQ.data,
        retentionQ.data,
        rolesQ.data
      ),
      siteHealth: buildModuleHealth(modules),
      flows: buildFlows(dashState, workflowQ.data),
      sites,
      scopedSites,
      groups,
      modules,
      subModules,
      status: {
        traffic: {
          loading: pending || trafficQ.isLoading || usageQ.isLoading,
          error: (sitesQ.error ?? trafficQ.error ?? usageQ.error) as Error | null,
        },
        adopt: {
          loading:
            pending ||
            engagementQ.isLoading ||
            trendQ.isLoading ||
            growthQ.isLoading ||
            retentionQ.isLoading ||
            rolesQ.isLoading,
          error: (sitesQ.error ??
            engagementQ.error ??
            trendQ.error ??
            growthQ.error ??
            retentionQ.error ??
            rolesQ.error) as Error | null,
        },
        flows: {
          // `!module && modules.length` is the one render between the tree arriving
          // and the effect below picking a default module.
          loading:
            pending ||
            moduleTreeQ.isLoading ||
            workflowQ.isLoading ||
            (!module && modules.length > 0),
          error: (sitesQ.error ?? moduleTreeQ.error ?? workflowQ.error) as Error | null,
        },
        siteHealth: {
          loading: pending || moduleTreeQ.isLoading,
          error: (sitesQ.error ?? moduleTreeQ.error) as Error | null,
        },
      },
      generatedAt: trafficQ.data?.meta.generated_at ?? null,
      range: { from: rangeFrom, to: rangeTo },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      scopeLabel,
      pending,
      sitesQ.error,
      rangeFrom,
      rangeTo,
      dashState,
      sites,
      scopedSites,
      modules,
      subModules,
      module,
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
    ]
  );

  const isFetchingAdoption = useIsFetching({ queryKey: ["fm-adoption"] }) > 0;
  const isRefreshing = isFetchingAdoption;

  const refreshAll = () => {
    setLoadedSections((sections) => ({ ...sections, [activeSection]: true }));
    // Changing the explicit request id triggers each enabled query exactly once.
    setRequestId((id) => id + 1);
  };

  return (
    <PulseDashboardContext.Provider
      value={{
        dev,
        setDev,
        prev,
        setPrev,
        project,
        setProject,
        range,
        setRange,
        rangeLabel,
        setRangeLabel,
        rangeFrom,
        setRangeFrom,
        rangeTo,
        setRangeTo,
        sessTab,
        setSessTab,
        module,
        setModule,
        subModule,
        setSubModule: setSubModuleState,
        theme,
        setTheme,
        collapsed,
        setCollapsed,
        benchmarks,
        updateBenchmark,
        vm,
        refreshAll,
        isRefreshing,
      }}
    >
      {children}
    </PulseDashboardContext.Provider>
  );
};

export const usePulseDashboard = () => {
  const context = useContext(PulseDashboardContext);
  if (context === undefined) {
    throw new Error(
      "usePulseDashboard must be used within a PulseDashboardProvider"
    );
  }
  return context;
};
