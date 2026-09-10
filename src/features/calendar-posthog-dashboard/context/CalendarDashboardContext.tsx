import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dateRangeFor } from '@/features/analytics-dashboard-shared/dateRange';
import { paletteFor, type DashboardTheme } from '@/features/analytics-dashboard-shared/palette';
import { BM_DEFAULTS, type DateRange, type Device } from '../data/constants';
import type { PageKey } from '../data/pages';
import { buildAdoption, buildTraffic, buildWorkflow, findWorkflow } from '../data/sampleData';
import {
  CalendarDashboardContext,
  type CalendarDashboardValue,
  type SessTab,
  type ViewModel,
} from './calendarDashboardStore';

/**
 * Provider for the Calendar App dashboard.
 *
 * This dashboard is a wireframe: it holds filter state and recomputes the page from the
 * seeded sample-data engine in `data/sampleData.ts`. There is no API layer and no data
 * fetching — see that file's header for what is real (module, workflow and event names) and
 * what is illustrative (every number).
 */

const THEME_KEY = 'calendar-theme';
const NAV_KEY = 'calendar-nav';

/** Best-effort persistence — storage may be unavailable (private mode, embedded webview). */
function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function initialTheme(): DashboardTheme {
  const saved = readStored(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/** Day count each preset covers — the sample engine scales cumulative counts by it. */
const DAYS_IN: Record<DateRange, number> = { 7: 7, 30: 30, 90: 90 };

function daysBetween(from: string, to: string): number {
  const ms = new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

export function CalendarDashboardProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<DateRange>(30);
  const [customRange, setCustomRangeState] = useState<{ from: string; to: string } | null>(null);
  const [dev, setDevState] = useState<Device>('all');
  const [sessTab, setSessTabState] = useState<SessTab>('visitors');
  const [prev, setPrev] = useState(true);
  const [workflow, setWorkflowState] = useState('eventCreate');
  const [page, setPage] = useState<PageKey>('pgTraffic');
  const [theme, setTheme] = useState<DashboardTheme>(initialTheme);
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === 'collapsed');
  const [benchmarks, setBenchmarks] = useState<Record<string, number | null>>({});

  /* Follow the OS only while the viewer has made no explicit choice of their own. */
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onOS = (e: MediaQueryListEvent) => {
      if (!readStored(THEME_KEY)) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onOS);
    return () => mq.removeEventListener('change', onOS);
  }, []);

  const range = useMemo(() => customRange ?? dateRangeFor(date), [customRange, date]);
  const rangeDays = customRange ? daysBetween(customRange.from, customRange.to) : DAYS_IN[date];

  const vm = useMemo<ViewModel>(
    () => ({
      traffic: buildTraffic(dev, rangeDays),
      adopt: buildAdoption(dev, rangeDays),
      flows: buildWorkflow(workflow, dev),
      sessTab,
      dev,
      prev,
      range,
      scopeLabel: 'Calendar App · all users',
    }),
    [dev, rangeDays, workflow, sessTab, prev, range],
  );

  /* ---------------------------------------------------------------- setters */

  const setPreset = useCallback((d: DateRange) => {
    setCustomRangeState(null);
    setDate(d);
  }, []);

  const setCustomRange = useCallback((from: string, to: string) => {
    setCustomRangeState({ from, to });
  }, []);

  const setDev = useCallback((d: Device) => setDevState(d), []);
  const setSessTab = useCallback((t: SessTab) => setSessTabState(t), []);
  const togglePrev = useCallback(() => setPrev((p) => !p), []);
  const setWorkflow = useCallback((key: string) => setWorkflowState(findWorkflow(key).key), []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      writeStored(THEME_KEY, next);
      return next;
    });
  }, []);

  const toggleNav = useCallback(() => {
    setNavCollapsed((c) => {
      writeStored(NAV_KEY, c ? 'expanded' : 'collapsed');
      return !c;
    });
  }, []);

  const getBenchmark = useCallback(
    (id: string) => (id in benchmarks ? benchmarks[id] : (BM_DEFAULTS[id] ?? null)),
    [benchmarks],
  );
  const setBenchmark = useCallback((id: string, value: number | null) => {
    setBenchmarks((b) => ({ ...b, [id]: value }));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo<CalendarDashboardValue>(
    () => ({
      vm,
      setPreset, setCustomRange, customRange, setDev, setSessTab,
      workflow, setWorkflow, togglePrev,
      page, setPage, theme, toggleTheme, navCollapsed, toggleNav,
      palette: paletteFor(theme),
      getBenchmark, setBenchmark,
    }),
    [
      vm, setPreset, setCustomRange, customRange, setDev, setSessTab,
      workflow, setWorkflow, togglePrev, page, theme, toggleTheme,
      navCollapsed, toggleNav, getBenchmark, setBenchmark,
    ],
  );

  return <CalendarDashboardContext.Provider value={value}>{children}</CalendarDashboardContext.Provider>;
}
