import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_STATE, normalizeScope, scopeLabel as computeScopeLabel, scopeSites, seats,
  core, buildTraffic, buildAdopt, buildSiteHealth, buildRegion, buildFlows,
  type DashboardState, type TrafficData, type AdoptData, type SiteHealthData, type RegionData, type FlowsData, type Core,
} from '../data/metrics';
import { BM_DEFAULTS } from '../data/constants';
import type { Tier, Device, DateRange } from '../data/constants';

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
}

interface InfoPopoverState { key: string; rect: DOMRect }
interface AiPanelState { chartKey: string }

interface DashboardContextValue {
  vm: ViewModel;
  setTier: (tier: Tier) => void;
  setScope: (scope: string) => void;
  setDate: (date: DateRange) => void;
  setDev: (dev: Device) => void;
  setMod: (mod: string) => void;
  setSessTab: (tab: DashboardState['sessTab']) => void;
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
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>({});
  const [infoPopover, setInfoPopover] = useState<InfoPopoverState | null>(null);
  const [aiPanel, setAiPanel] = useState<AiPanelState | null>(null);

  const vm = useMemo<ViewModel>(() => {
    const sites = scopeSites(state);
    const c = core(state);
    return {
      state,
      scopeLabel: computeScopeLabel(state),
      core: c,
      traffic: buildTraffic(state, c),
      adopt: buildAdopt(state, c),
      siteHealth: buildSiteHealth(state),
      region: buildRegion(state),
      flows: buildFlows(state, c),
      totalSeats: seats(sites),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tier, state.scope, state.date, state.dev, state.mod, state.sessTab, state.prev]);

  const value: DashboardContextValue = {
    vm,
    setTier: (tier) => setState((s) => ({ ...s, tier, scope: normalizeScope(tier, s.scope) })),
    setScope: (scope) => setState((s) => ({ ...s, scope })),
    setDate: (date) => setState((s) => ({ ...s, date })),
    setDev: (dev) => setState((s) => ({ ...s, dev })),
    setMod: (mod) => setState((s) => ({ ...s, mod })),
    setSessTab: (sessTab) => setState((s) => ({ ...s, sessTab })),
    togglePrev: () => setState((s) => ({ ...s, prev: !s.prev })),
    benchmarks,
    getBenchmark: (id) => (id in benchmarks ? benchmarks[id] : id in BM_DEFAULTS ? BM_DEFAULTS[id] : null),
    setBenchmark: (id, val) => setBenchmarks((b) => ({ ...b, [id]: val })),
    infoPopover,
    openInfoPopover: (key, rect) => setInfoPopover({ key, rect }),
    closeInfoPopover: () => setInfoPopover(null),
    aiPanel,
    openAiPanel: (chartKey) => setAiPanel({ chartKey }),
    closeAiPanel: () => setAiPanel(null),
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
}
