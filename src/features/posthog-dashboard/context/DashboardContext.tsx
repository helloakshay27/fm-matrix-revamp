import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchAllowedSites } from "@/store/slices/siteSlice";
import {
  DEFAULT_STATE,
  normalizeScope,
  scopeLabel as computeScopeLabel,
  scopeSites,
  seats,
  core,
  buildTraffic,
  buildAdopt,
  buildSiteHealth,
  buildRegion,
  buildFlows,
  type DashboardState,
  type TrafficData,
  type AdoptData,
  type SiteHealthData,
  type RegionData,
  type FlowsData,
  type Core,
} from "../data/metrics";
import { rngFor } from "../data/rng";
import {
  SITES as MOCK_SITES,
  REGIONS as MOCK_REGIONS,
  BM_DEFAULTS,
  type Site,
} from "../data/constants";
import type { Tier, Device, DateRange } from "../data/constants";
import { getUser } from "@/utils/auth";

/** Maps the Redux site-slice shape (same one src/components/Header.tsx's site switcher uses)
 * onto the wireframe's Site model — region/seats are simulated since the real data has neither. */
function toDashboardSites(apiSites: { id: number; name: string }[]): Site[] {
  return apiSites.map((s, i) => {
    const r = rngFor(`allowed-site|${s.id}`);
    return {
      id: String(s.id),
      name: s.name,
      region: MOCK_REGIONS[i % MOCK_REGIONS.length],
      seats: Math.round(40 + r() * 100),
    };
  });
}

export interface ViewModel {
  state: DashboardState;
  scopeLabel: string;
  core: Core;
  traffic: TrafficData;
  adopt: AdoptData;
  siteHealth: SiteHealthData | null;
  region: RegionData | null;
  flows: FlowsData;
  totalSeats: number;
  sites: Site[];
  regions: string[];
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
  setMod: (mod: string) => void;
  setSessTab: (tab: DashboardState["sessTab"]) => void;
  togglePrev: () => void;
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

  // Same Redux site slice src/components/Header.tsx's site-switcher reads from. This route
  // renders outside <Layout>/<Header>, so Header never mounts here to populate it — fetch it directly.
  const dispatch = useDispatch<AppDispatch>();
  const { sites: reduxSites, selectedSite } = useSelector(
    (s: RootState) => s.site
  );
  const userId = getUser()?.id;

  useEffect(() => {
    if (userId) dispatch(fetchAllowedSites(userId));
  }, [userId, dispatch]);

  // Fall back to the wireframe's mock sites while the allowed-sites call is loading, errored, or empty.
  const sites = useMemo<Site[]>(
    () => (reduxSites?.length ? toDashboardSites(reduxSites) : MOCK_SITES),
    [reduxSites]
  );

  const regions = useMemo(
    () => Array.from(new Set(sites.map((s) => s.region))),
    [sites]
  );
  const preferredSiteId = selectedSite ? String(selectedSite.id) : undefined;

  // Keep the current scope valid whenever the allowed-sites list changes (e.g. once the fetch resolves),
  // preferring the API's selected_site so the dropdown opens on the user's actual current site.
  useEffect(() => {
    setState((s) => {
      const next = normalizeScope(
        s.tier,
        s.scope,
        sites,
        regions,
        preferredSiteId
      );
      return next === s.scope ? s : { ...s, scope: next };
    });
  }, [sites, regions, preferredSiteId]);

  const vm = useMemo<ViewModel>(() => {
    const scopedSites = scopeSites(state, sites);
    const c = core(state, sites);
    return {
      state,
      scopeLabel: computeScopeLabel(state, sites, regions),
      core: c,
      traffic: buildTraffic(state, c),
      adopt: buildAdopt(state, c),
      siteHealth: buildSiteHealth(state, sites),
      region: buildRegion(state, sites, regions),
      flows: buildFlows(state, c),
      totalSeats: seats(scopedSites),
      sites,
      regions,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.tier,
    state.scope,
    state.date,
    state.dev,
    state.mod,
    state.sessTab,
    state.prev,
    sites,
    regions,
  ]);

  const value: DashboardContextValue = {
    vm,
    setTier: (tier) =>
      setState((s) => ({
        ...s,
        tier,
        scope: normalizeScope(tier, s.scope, sites, regions, preferredSiteId),
      })),
    setScope: (scope) => setState((s) => ({ ...s, scope })),
    setDate: (date) => setState((s) => ({ ...s, date })),
    setDev: (dev) => setState((s) => ({ ...s, dev })),
    setMod: (mod) => setState((s) => ({ ...s, mod })),
    setSessTab: (sessTab) => setState((s) => ({ ...s, sessTab })),
    togglePrev: () => setState((s) => ({ ...s, prev: !s.prev })),
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
