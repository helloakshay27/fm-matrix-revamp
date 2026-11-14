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
import { type Device } from "../../posthog-dashboard/data/constants";
import { PULSE_ADOPTION_PATH, type DeviceType } from "../../posthog-dashboard/api/adoptionApi";
import {
  dateRangeFor,
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
 * Pulse reuses the posthog-dashboard's query/transform layer — response
 * contracts, caching, refresh and UI mappings are identical — but reads its own
 * analytics API (PULSE_ADOPTION_PATH). That API fixes Pulse's scope on the
 * server (project code TEP-01, the Pulse web portal and the Pulse app), so a
 * request carries only the filters: dates, the platform and the module. There
 * is no site filter: Pulse is counted across all of its sites.
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

/* Pulse's platform buttons → the API's `os` param (see getDeviceInfo): "iOS"
   sends os=ios, "Android" sends os=android, "All" sends nothing, so every
   platform (web portal and app) is counted. Note the `dev` enum value behind
   the button labelled "iOS" is "desktop" and behind "Android" is "mobile";
   `pulseDev` below gives them their meaning. */
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
  queryFilters: QueryFilters;
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

  const filters = useMemo<QueryFilters>(
    () => ({
      api: PULSE_ADOPTION_PATH,
      // Each section enables its own calls below (loadedSections), so nothing waits on anything else.
      enabled: true,
      from: rangeFrom,
      to: rangeTo,
      siteIds: [],
      allowEmptySites: true,
      devices: deviceParam(dev),
      dev: pulseDev(dev),
      licensedSeats: null,
      module,
      subModule,
      requestId,
      token: "",
    }),
    [rangeFrom, rangeTo, dev, module, subModule, requestId]
  );

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
  // Pulse's Workflow Usage always shows one module (the busiest by default, picked below from the tree),
  // so it waits for the module instead of first loading the whole app.
  const workflowQ = useWorkflowUsage(workflowFilters, { requireModule: true });

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

  // What every number on the page counts (the Pulse API's scope).
  const scopeLabel = "Web portal + mobile app · signed-in users";

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
      // The selected module's own funnel; "–" where the API has none.
      flows: buildFlows(dashState, workflowQ.data),
      modules,
      subModules,
      status: {
        traffic: {
          loading: trafficQ.isLoading || usageQ.isLoading,
          error: (trafficQ.error ?? usageQ.error) as Error | null,
        },
        adopt: {
          loading:
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
          // `!module && modules.length` is the one render between the tree arriving
          // and the effect below picking a default module.
          loading:
            moduleTreeQ.isLoading ||
            workflowQ.isLoading ||
            (!module && modules.length > 0),
          error: (moduleTreeQ.error ?? workflowQ.error) as Error | null,
        },
        siteHealth: {
          loading: moduleTreeQ.isLoading,
          error: moduleTreeQ.error as Error | null,
        },
      },
      generatedAt: trafficQ.data?.meta.generated_at ?? null,
      range: { from: rangeFrom, to: rangeTo },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      scopeLabel,
      rangeFrom,
      rangeTo,
      dashState,
      modules,
      subModules,
      module,
      subModule,
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
        queryFilters: filters,
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
