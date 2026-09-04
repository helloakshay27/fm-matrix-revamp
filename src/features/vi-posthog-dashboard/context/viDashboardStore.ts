import { createContext, useContext } from 'react';
import type {
  AdoptData,
  DashboardState,
  FlowsData,
  ModuleOption,
  SiteHealthData,
  TrafficData,
} from '@/features/posthog-dashboard/data/metrics';
import type {
  DateRange,
  Device,
  Site,
  SiteGroup,
  Tier,
} from '@/features/posthog-dashboard/data/constants';
import type { ChartPalette, ViTheme } from '../data/palette';
import type { PageKey } from '../data/pages';

/**
 * Context object, its types, and the consumer hook.
 *
 * Deliberately separate from the provider component: a module that exports a component
 * alongside other values can't be state-preserved by React Fast Refresh, and re-executing
 * it mints a brand-new context object that live consumers no longer match.
 */

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
  /** `generated_at` of the Layer-1 response — the freshness stamp in the header. */
  generatedAt: string | null;
  range: { from: string; to: string };
}

export interface ViDashboardValue {
  vm: ViewModel;

  /** filters */
  setTier: (tier: Tier) => void;
  setScope: (scope: string) => void;
  /** One-shot tier+scope change used by the Circle selector. */
  setCircle: (tier: Tier, scope: string) => void;
  setDate: (date: DateRange) => void;
  /** Explicit from/to, bypassing the rolling 7/30/90 presets. Both YYYY-MM-DD. */
  setCustomRange: (from: string, to: string) => void;
  /** The custom window currently applied, or null when a preset is active. */
  customRange: { from: string; to: string } | null;
  setDev: (dev: Device) => void;
  setModule: (module: string) => void;
  setSubModule: (subModule: string) => void;
  /**
   * Selected workflow key from the Vi catalogue (see data/workflows.ts). Layer 3 is
   * navigated by workflow rather than by raw `$pathname` module: the catalogue's bucket →
   * workflow grouping is the documented structure, and setting a workflow also sets the
   * `module` the workflow_usage endpoint is queried with.
   */
  workflow: string;
  setWorkflow: (key: string) => void;
  setSessTab: (tab: DashboardState['sessTab']) => void;
  togglePrev: () => void;

  /** navigation + chrome */
  page: PageKey;
  setPage: (page: PageKey) => void;
  theme: ViTheme;
  toggleTheme: () => void;
  navCollapsed: boolean;
  toggleNav: () => void;
  palette: ChartPalette;

  /** refresh */
  refreshAll: () => void;
  isRefreshing: boolean;

  /** user-defined KPI targets */
  getBenchmark: (id: string) => number | null;
  setBenchmark: (id: string, value: number | null) => void;
}

export const ViDashboardContext = createContext<ViDashboardValue | null>(null);

export function useViDashboard(): ViDashboardValue {
  const ctx = useContext(ViDashboardContext);
  if (!ctx) throw new Error('useViDashboard must be used inside <ViDashboardProvider>');
  return ctx;
}
