import { createContext, useContext } from 'react';
import type { ChartPalette, DashboardTheme } from '@/features/analytics-dashboard-shared/palette';
import type { DateRange, Device } from '../data/constants';
import type { PageKey } from '../data/pages';
import type { AdoptionSample, TrafficSample, WorkflowSample } from '../data/sampleData';

/**
 * Context object, its types, and the consumer hook.
 *
 * Deliberately separate from the provider component: a module that exports a component
 * alongside other values can't be state-preserved by React Fast Refresh, and re-executing it
 * mints a brand-new context object that live consumers no longer match.
 */

/** Which measure the "Usage over time" tabs are showing. */
export type SessTab = 'visitors' | 'views' | 'sessions';

export interface ViewModel {
  traffic: TrafficSample;
  adopt: AdoptionSample;
  flows: WorkflowSample;
  sessTab: SessTab;
  /** Platform filter — every count is scaled by it. */
  dev: Device;
  /** Whether the previous-period overlay is on. */
  prev: boolean;
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
  setSessTab: (tab: SessTab) => void;
  /** Selected workflow key from the Calendar catalogue (see data/sampleData.ts). */
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
