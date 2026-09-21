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
  Site,
  SiteGroup,
  Tier,
} from '@/features/posthog-dashboard/data/constants';
import type { QueryFilters } from '../api/queries';
import type { ChartPalette, ViTheme } from '../data/palette';
import type { PageKey } from '../data/pages';

/**
 * Context object, its types, and the consumer hook.
 *
 * Deliberately separate from the provider component: a module that exports a component
 * alongside other values can't be state-preserved by React Fast Refresh, and re-executing
 * it mints a brand-new context object that live consumers no longer match.
 */

/**
 * Platform filter. Vi my Workspace ships as a mobile app only, so the choice is iOS vs
 * Android (the API's `os` property) — not the FM dashboard's Desktop / Mobile `device_type`.
 */
export type ViPlatform = 'all' | 'iOS' | 'Android';

export interface SectionStatus {
  loading: boolean;
  error: Error | null;
}

export interface ViewModel {
  state: DashboardState;
  scopeLabel: string;
  traffic: TrafficData;
  adopt: AdoptData;
  /**
   * Hover text for the two weekly charts, one entry per point. Their axes read "W1 … W8" —
   * short enough that every week fits — and these carry the week each number actually is.
   */
  weekTips: { trend: string[]; growth: string[] };
  /** Hover text for each retention cohort row, carrying the cohort size the label drops. */
  retentionRowTitles: string[];
  siteHealth: SiteHealthData | null;
  flows: FlowsData;
  sites: Site[];
  /** The sites the current tier + scope covers. */
  scopedSites: Site[];
  /** Companies the site list groups into — the Regional tier's options. */
  groups: SiteGroup[];
  sitesLoading: boolean;
  /**
   * Layer-3 module tree. Under the app scope these are the Vi app's own event groups
   * (`msafe_home`, `tickets_create`, `home_post_possession`, …) and the list is flat —
   * there is no sub-module tier below it.
   */
  modules: ModuleOption[];
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
  /** The filter set every analytics query is keyed on — for sections that fire their own. */
  queryFilters: QueryFilters;

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
  /** iOS / Android / All — sent as `os` on every analytics call. */
  platform: ViPlatform;
  setPlatform: (platform: ViPlatform) => void;
  /**
   * Select the Layer-3 module — one name from the tree above, sent as `module` on the
   * workflow_usage call. No sub-module counterpart: the app-scoped tree is flat.
   */
  setModule: (module: string) => void;
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
