import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BM_DEFAULTS } from '../data/constants';
import { buildTraffic, buildAdoption, buildFlows, type TrafficData, type AdoptData, type FlowsData } from '../data/metrics';
import type { ActivePage, DashboardState, Device, DateRangeDays } from '../data/types';

const DEFAULT_STATE: DashboardState = {
  dev: 'all',
  prev: true,
  wf: 'devApproval',
  page: 'pgTraffic',
  range: 30,
  rangeLabel: 'Last 30 days',
  rangeFrom: '2026-06-22',
  rangeTo: '2026-07-22',
  society: 'All Societies',
  theme: 'light',
  navCollapsed: false,
};

interface InfoPopoverState {
  key: string;
  rect: DOMRect;
}

interface DashboardContextValue {
  state: DashboardState;
  traffic: TrafficData;
  adopt: AdoptData;
  flows: FlowsData;
  setDev: (dev: Device) => void;
  togglePrev: () => void;
  setWorkflow: (key: string) => void;
  setPage: (page: ActivePage) => void;
  setRange: (days: DateRangeDays, label: string) => void;
  setCustomRange: (from: string, to: string, label: string) => void;
  setSociety: (society: string) => void;
  setTheme: (theme: DashboardState['theme']) => void;
  setNavCollapsed: (collapsed: boolean) => void;
  benchmarks: Record<string, number | null>;
  getBenchmark: (id: string) => number | null;
  setBenchmark: (id: string, value: number | null) => void;
  infoPopover: InfoPopoverState | null;
  openInfoPopover: (key: string, rect: DOMRect) => void;
  closeInfoPopover: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(DEFAULT_STATE);
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>({});
  const [infoPopover, setInfoPopover] = useState<InfoPopoverState | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-ss-theme', state.theme);
  }, [state.theme]);

  // Resolve OS theme once on mount, mirroring the wireframe's own pre-paint theme resolution.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('smartsecure-theme');
    } catch {
      // storage unavailable (private mode, file://) — fall through to OS preference
    }
    if (saved === 'dark' || saved === 'light') {
      setState((s) => ({ ...s, theme: saved as DashboardState['theme'] }));
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setState((s) => ({ ...s, theme: 'dark' }));
    }
  }, []);

  const traffic = useMemo(() => buildTraffic(state), [state]);
  const adopt = useMemo(() => buildAdoption(state), [state]);
  const flows = useMemo(() => buildFlows(state), [state]);

  const value: DashboardContextValue = {
    state,
    traffic,
    adopt,
    flows,
    setDev: (dev) => setState((s) => ({ ...s, dev })),
    togglePrev: () => setState((s) => ({ ...s, prev: !s.prev })),
    setWorkflow: (wf) => setState((s) => ({ ...s, wf })),
    setPage: (page) => setState((s) => ({ ...s, page })),
    setRange: (range, rangeLabel) => setState((s) => ({ ...s, range, rangeLabel })),
    setCustomRange: (rangeFrom, rangeTo, rangeLabel) => {
      const days = Math.max(1, Math.round((new Date(rangeTo).getTime() - new Date(rangeFrom).getTime()) / 86400000) + 1);
      setState((s) => ({ ...s, range: days as DateRangeDays, rangeLabel, rangeFrom, rangeTo }));
    },
    setSociety: (society) => setState((s) => ({ ...s, society })),
    setTheme: (theme) => {
      setState((s) => ({ ...s, theme }));
      try {
        localStorage.setItem('smartsecure-theme', theme);
      } catch {
        // storage unavailable — theme still applies for this session
      }
    },
    setNavCollapsed: (navCollapsed) => setState((s) => ({ ...s, navCollapsed })),
    benchmarks,
    getBenchmark: (id) => (id in benchmarks ? benchmarks[id] : id in BM_DEFAULTS ? BM_DEFAULTS[id] : null),
    setBenchmark: (id, val) => setBenchmarks((b) => ({ ...b, [id]: val })),
    infoPopover,
    openInfoPopover: (key, rect) => setInfoPopover({ key, rect }),
    closeInfoPopover: () => setInfoPopover(null),
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useSmartSecureDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useSmartSecureDashboard must be used within a DashboardProvider');
  return ctx;
}
