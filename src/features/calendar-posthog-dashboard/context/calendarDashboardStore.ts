import { createContext, useContext } from 'react';
import type {
  AdoptData,
  DashboardState,
  FlowsData,
  ModuleOption,
  TrafficData,
} from '@/features/posthog-dashboard/data/metrics';
import type { SectionStatus } from '@/features/analytics-dashboard-shared/components/Guard';
import type { ChartPalette, DashboardTheme } from '@/features/analytics-dashboard-shared/palette';
import type { DateRange, Device } from '../data/constants';
import type { PageKey } from '../data/pages';

/**
 * Context object, its types, and the consumer hook.
 *
 * Deliberately separate from the provider component: a module that exports a component
 * alongside other values can't be state-preserved by React Fast Refresh, and re-executing it
 * mints a brand-new context object that live consumers no longer match.
 */

export type { SectionStatus };

export interface ViewModel {
  /** Shared dashboard state the `metrics.ts` builders read. */
  state: DashboardState;
  traffic: TrafficData;
  adopt: AdoptData;
  flows: FlowsData;
  /** Module tree from the `modules` endpoint — drives the module league table. */
  modules: ModuleOption[];
  /**
   * The `/employee/calendar` row — the only genuinely calendar-scoped top-line numbers the
   * API can produce. Null while loading, or if the module saw no traffic in the window.
   *
   * Everything in `traffic` and `adopt` is TENANT-WIDE by contrast: the Layer-1/2 endpoints
   * have no `$pathname` dimension and silently ignore module/sub_module. See api/queries.ts.
   */
  calendarScope: ModuleOption | null;
  status: {
    traffic: SectionStatus;
    adopt: SectionStatus;
    flows: SectionStatus;
    modules: SectionStatus;
    calendarScope: SectionStatus;
  };
  /** `generated_at` of the Layer-1 response — the freshness stamp in the header. */
  generatedAt: string | null;
  range: { from: string; to: string };
  /** Label under the page title. */
  scopeLabel: string;
}

export interface CalendarDashboardValue {
  vm: ViewModel;

  /** filters */
  setPreset: (date: DateRange) => void;
  /** Explicit from/to, bypassing the 7/30/90 presets. Both YYYY-MM-DD. */
  setCustomRange: (from: string, to: string) => void;
  /** The custom window currently applied, or null when a preset is active. */
  customRange: { from: string; to: string } | null;
  setDev: (dev: Device) => void;
  setSessTab: (tab: DashboardState['sessTab']) => void;
  /** Selected workflow key from the Calendar catalogue (see data/constants.ts). */
  workflow: string;
  setWorkflow: (key: string) => void;
  togglePrev: () => void;

  /** navigation + chrome */
  page: PageKey;
  setPage: (page: PageKey) => void;
  theme: DashboardTheme;
  toggleTheme: () => void;
  navCollapsed: boolean;
  toggleNav: () => void;
  palette: ChartPalette;

  /** refresh */
  refreshAll: () => void;
  isRefreshing: boolean;

  /** user-defined KPI targets — local only, never sent anywhere */
  getBenchmark: (id: string) => number | null;
  setBenchmark: (id: string, value: number | null) => void;
}

export const CalendarDashboardContext = createContext<CalendarDashboardValue | null>(null);

export function useCalendarDashboard(): CalendarDashboardValue {
  const ctx = useContext(CalendarDashboardContext);
  if (!ctx) throw new Error('useCalendarDashboard must be used inside <CalendarDashboardProvider>');
  return ctx;
}
