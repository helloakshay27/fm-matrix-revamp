import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dateRangeFor } from '@/features/analytics-dashboard-shared/dateRange';
import { paletteFor, type DashboardTheme } from '@/features/analytics-dashboard-shared/palette';
import { BM_DEFAULTS, type DateRange, type Device } from '../data/constants';
import type { PageKey } from '../data/pages';
import {
  buildAdoption,
  buildTraffic,
  buildWorkflow,
  findWorkflow,
  fmtCount,
  type AdoptionSample,
  type TrafficSample,
  type WorkflowSample,
} from '../data/sampleData';
import {
  CalendarDashboardContext,
  type CalendarDashboardValue,
  type SessTab,
  type ViewModel,
} from './calendarDashboardStore';
import {
  useTrafficSession,
  useUsageAndDistribution,
  useAdoptionEngagement,
  useAdoptionTrend,
  useGrowth,
  useRetention,
  useRoles,
  useModules,
  useWorkflowUsage,
  type CalendarQueryFilters,
} from '../api/queries';
import type { CalendarOsType } from '../api/adoptionApi';
import type { CalendarTileSpec } from '../data/calendarMetricIds';
import type { GrowthWeek } from '../data/sampleData';

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

/** Day count each preset covers. */
const DAYS_IN: Record<DateRange, number> = { 7: 7, 30: 30, 90: 90 };

function daysBetween(from: string, to: string): number {
  const ms = new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

export function CalendarDashboardProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<DateRange>(30);
  const [customRange, setCustomRangeState] = useState<{ from: string; to: string } | null>(null);
  const [dev, setDevState] = useState<Device>('all');
  const [provider, setProviderState] = useState<string>('All Providers');
  const [sessTab, setSessTabState] = useState<SessTab>('visitors');
  const [prev, setPrev] = useState(true);
  const [workflow, setWorkflowState] = useState('login');
  const [selectedModule, setSelectedModuleState] = useState<string | null>(null);
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

  const scopeLabel = useMemo(() => {
    return 'All users · calendar_app (app_id 29)';
  }, []);

  /* Live API query filters */
  const osFilter = useMemo<CalendarOsType[] | undefined>(() => {
    if (dev === 'ios') return ['iOS'];
    if (dev === 'android') return ['Android'];
    return undefined;
  }, [dev]);

  /* Live API query filters
   * Layer 1 & 2 use queryFilters (no module param).
   * Layer 3 (workflow_usage) uses workflowFilters which adds the selected module.
   */
  const queryFilters: CalendarQueryFilters = useMemo(
    () => ({
      from: range.from,
      to: range.to,
      os: osFilter,
      provider: provider !== 'All Providers' ? provider : undefined,
    }),
    [range.from, range.to, osFilter, provider],
  );

  const workflowFilters: CalendarQueryFilters = useMemo(
    () => ({
      from: range.from,
      to: range.to,
      os: osFilter,
      provider: provider !== 'All Providers' ? provider : undefined,
      module: selectedModule ?? undefined,
    }),
    [range.from, range.to, osFilter, provider, selectedModule],
  );

  /* Live API endpoints for Calendar App (app_id=29) */
  const trafficQuery = useTrafficSession(queryFilters);       // Layer 1
  const usageQuery = useUsageAndDistribution(queryFilters);   // Layer 1
  const adoptQuery = useAdoptionEngagement(queryFilters);     // Layer 2
  const trendQuery = useAdoptionTrend(queryFilters);          // Layer 2
  const growthQuery = useGrowth(queryFilters);                // Layer 2
  const retentionQuery = useRetention(queryFilters);          // Layer 2
  const rolesQuery = useRoles(queryFilters);                  // Layer 2
  const modulesQuery = useModules(queryFilters);              // Layer 3 — base (no module filter, gives pill list)
  const workflowQuery = useWorkflowUsage(workflowFilters);   // Layer 3 — filtered by selectedModule

  const trafficLoading = trafficQuery.isLoading || usageQuery.isLoading;
  const adoptLoading =
    adoptQuery.isLoading || trendQuery.isLoading || growthQuery.isLoading || retentionQuery.isLoading;
  const flowsLoading = workflowQuery.isLoading || modulesQuery.isLoading;
  const isLoading = trafficLoading || adoptLoading || flowsLoading;
  const isLive = Boolean(trafficQuery.data || adoptQuery.data || workflowQuery.data);

  /** Flat list of modules from the live API — drives the module pill nav. */
  const modulesList = useMemo(
    () => (modulesQuery.data?.tree ?? []).map((m) => ({ name: m.name, users: m.users })),
    [modulesQuery.data],
  );


  const refetch = useCallback(() => {
    trafficQuery.refetch();
    usageQuery.refetch();
    adoptQuery.refetch();
    trendQuery.refetch();
    growthQuery.refetch();
    retentionQuery.refetch();
    rolesQuery.refetch();
    modulesQuery.refetch();
    workflowQuery.refetch();
  }, [
    trafficQuery,
    usageQuery,
    adoptQuery,
    trendQuery,
    growthQuery,
    retentionQuery,
    rolesQuery,
    modulesQuery,
    workflowQuery,
  ]);

  /* Layer 1: Traffic & Session strictly from live API (no static mock fallbacks) */
  const traffic = useMemo<TrafficSample>(() => {
    const t = trafficQuery.data?.tiles;
    const d = trafficQuery.data?.delta_pct;
    const u = usageQuery.data;

    const currentDays = u?.usage_over_time?.current ?? [];
    const prevDays = u?.usage_over_time?.previous ?? [];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = currentDays.map((cd) => {
      const parts = cd.day.split('-');
      if (parts.length === 3) {
        return `${Number(parts[2])} ${monthNames[Number(parts[1]) - 1] ?? parts[1]}`;
      }
      return cd.day;
    });

    const usersCur = currentDays.map((cd) => cd.visitors);
    const usersPrev = prevDays.map((pd) => pd.visitors);

    const viewsCur = currentDays.map((cd) => cd.views);
    const viewsPrev = prevDays.map((pd) => pd.views);

    const sessionsCur = currentDays.map((cd) => cd.sessions);
    const sessionsPrev = prevDays.map((pd) => pd.sessions);

    const osBreakdown = u?.device_split?.devices?.[0]?.os_breakdown ?? [];
    const platformRows = osBreakdown.map((item) => ({
      label: item.os,
      share: (item.session_share ?? 0) / 100,
    }));

    const viewsPerSession =
      u?.views_per_session != null
        ? String(u.views_per_session)
        : t
          ? (t.screen_views / Math.max(1, t.sessions)).toFixed(1)
          : '0.0';

    const tiles: CalendarTileSpec[] = [
      {
        id: 'activeUsers',
        label: 'Active Users',
        disp: t ? t.active_users.toLocaleString() : '—',
        raw: t ? t.active_users : 0,
        delta: d?.active_users ?? null,
        deltaText:
          d?.active_users != null
            ? d.active_users >= 0
              ? `▲ ${d.active_users.toFixed(1)}% vs prev. period`
              : `▼ ${Math.abs(d.active_users).toFixed(1)}% vs prev. period`
            : undefined,
        sub: 'unique users this period',
        infoKey: 'activeUsers',
        infoLabel: 'Active Users',
        goodUp: true,
      },
      {
        id: 'screenViews',
        label: 'Screen Views',
        disp: t ? fmtCount(t.screen_views) : '—',
        raw: t ? t.screen_views : 0,
        delta: d?.screen_views ?? null,
        deltaText:
          d?.screen_views != null
            ? d.screen_views >= 0
              ? `▲ ${d.screen_views.toFixed(1)}%`
              : `▼ ${Math.abs(d.screen_views).toFixed(1)}%`
            : undefined,
        sub: 'total across modules',
        infoKey: 'screenViews',
        infoLabel: 'Screen Views',
        goodUp: true,
        noTarget: true,
      },
      {
        id: 'totalSessions',
        label: 'Sessions',
        disp: t ? t.sessions.toLocaleString() : '—',
        raw: t ? t.sessions : 0,
        delta: d?.sessions ?? null,
        deltaText:
          d?.sessions != null
            ? d.sessions >= 0
              ? `▲ ${d.sessions.toFixed(1)}%`
              : `▼ ${Math.abs(d.sessions).toFixed(1)}%`
            : undefined,
        sub: 'app sessions started',
        infoKey: 'totalSessions',
        infoLabel: 'Sessions',
        goodUp: true,
        noTarget: true,
      },
      {
        id: 'avgSessionDur',
        label: 'Session Duration',
        disp: t ? formatDuration(t.avg_session_seconds) : '—',
        raw: t ? t.avg_session_seconds / 60 : 0,
        sub: 'per session',
        infoKey: 'avgSessionDur',
        infoLabel: 'Session Duration',
        goodUp: true,
        noTarget: true,
      },
      {
        id: 'bounceRate',
        label: 'Bounce Rate',
        disp: t ? `${Math.round(t.bounce_rate)}%` : '—',
        raw: t ? t.bounce_rate : 0,
        delta: d?.bounce_rate ?? null,
        deltaText:
          d?.bounce_rate != null
            ? d.bounce_rate >= 0
              ? `▲ ${d.bounce_rate.toFixed(1)}%`
              : `▼ ${Math.abs(d.bounce_rate).toFixed(1)}%`
            : undefined,
        sub: 'lower is better',
        unit: '%',
        goodUp: false,
        infoKey: 'bounceRate',
        infoLabel: 'Bounce Rate',
      },
      {
        id: 'recentlyOnline',
        label: 'Recently Online',
        disp: t ? t.recently_online.toLocaleString() : '—',
        raw: t ? t.recently_online : 0,
        sub: 'active in last 30 min',
        infoKey: 'recentlyOnline',
        infoLabel: 'Recently Online',
        goodUp: true,
        noTarget: true,
      },
    ];

    return {
      tiles,
      users: { labels, cur: usersCur, prev: usersPrev },
      views: { labels, cur: viewsCur, prev: viewsPrev },
      sessions: { labels, cur: sessionsCur, prev: sessionsPrev },
      platformRows,
      viewsPerSession,
    };
  }, [trafficQuery.data, usageQuery.data]);

  /* Layer 2: Adoption & Engagement strictly from live API */
  const adopt = useMemo<AdoptionSample>(() => {
    const a = adoptQuery.data;

    const seatVal = a?.seat_utilisation?.value ?? 0;
    const stickVal = a?.stickiness?.value ?? 0;
    const trendVal = a?.adoption_trend?.value ?? 0;
    const actVal = a?.activation?.value ?? 0;
    const breadthInUse = a?.module_breadth?.in_use ?? 0;
    const breadthTotal = a?.module_breadth?.total ?? 0;

    const tiles: CalendarTileSpec[] = [
      {
        id: 'seatUtil',
        label: 'Seat Utilisation',
        disp: a ? `${Math.round(seatVal)}%` : '—',
        raw: seatVal,
        sub: 'active / registered accounts',
        unit: '%',
        goodUp: true,
        infoKey: 'seatUtil',
        infoLabel: 'Seat Utilisation',
      },
      {
        id: 'stickiness',
        label: 'Stickiness (DAU/MAU)',
        disp: a ? `${Math.round(stickVal)}%` : '—',
        raw: stickVal,
        sub: 'daily engagement depth',
        unit: '%',
        goodUp: true,
        infoKey: 'stickiness',
        infoLabel: 'Stickiness (DAU/MAU)',
      },
      {
        id: 'adoptionTrend',
        label: 'Adoption Trend',
        disp: a ? `${trendVal >= 0 ? '+' : ''}${Math.round(trendVal)}%` : '—',
        raw: trendVal,
        sub: 'vs prior 8 weeks',
        unit: '%',
        goodUp: true,
        infoKey: 'adoptionTrend',
        infoLabel: 'Adoption Trend',
      },
      {
        id: 'activation14',
        label: '14-Day Activation',
        disp: a ? `${Math.round(actVal)}%` : '—',
        raw: actVal,
        sub: 'new users active day 14',
        unit: '%',
        goodUp: true,
        infoKey: 'activation14',
        infoLabel: '14-Day Activation',
      },
      {
        id: 'moduleBreadth2',
        label: 'Module Breadth (≥2)',
        disp: a ? `${breadthInUse} / ${breadthTotal}` : '—',
        raw: breadthInUse,
        sub: 'modules in use',
        goodUp: true,
        noTarget: true,
        infoKey: 'moduleBreadth2',
        infoLabel: 'Module Breadth (≥2)',
      },
    ];

    const weeklyRaw = trendQuery.data?.weekly as unknown;
    const weeklyList: Array<{ week: string; wau: number }> = Array.isArray(weeklyRaw)
      ? weeklyRaw
      : weeklyRaw && typeof weeklyRaw === 'object' && Array.isArray((weeklyRaw as { current?: unknown[] }).current)
        ? ((weeklyRaw as { current: Array<{ week: string; wau: number }> }).current)
        : [];

    const trend = {
      labels: weeklyList.map((w) => String(w.week || '').slice(5)),
      values: weeklyList.map((w) => Number(w.wau || 0)),
    };

    const weeksRaw = growthQuery.data?.weeks as unknown;
    const weeksList: Array<{ week: string; new: number; returning: number; resurrected: number; dormant: number }> =
      Array.isArray(weeksRaw) ? weeksRaw : [];

    const growth: GrowthWeek[] = weeksList.map((w) => ({
      label: String(w.week || '').slice(5),
      nw: Number(w.new || 0),
      ret: Number(w.returning || 0),
      res: Number(w.resurrected || 0),
      dorm: Number(w.dormant || 0),
    }));

    const cohortsRaw = retentionQuery.data?.cohorts as unknown;
    const cohorts: Array<{
      cohort_week: string;
      week0: number | null;
      week1: number | null;
      week2: number | null;
      week3: number | null;
      week4: number | null;
      week5: number | null;
    }> = Array.isArray(cohortsRaw) ? cohortsRaw : [];

    const retention = {
      labels: cohorts.map((c) => String(c.cohort_week || '').slice(5)),
      weeks: 6,
      rows: cohorts.map((c) => [
        c.week0 ?? null,
        c.week1 ?? null,
        c.week2 ?? null,
        c.week3 ?? null,
        c.week4 ?? null,
        c.week5 ?? null,
      ]),
    };

    const tree = Array.isArray(modulesQuery.data?.tree) ? modulesQuery.data.tree : [];
    const totalEvents = tree.reduce((acc, t) => acc + (t.events || 0), 0);
    const itemTypes = tree.slice(0, 3).map((item) => ({
      label: String(item.name || '').replace(/_/g, ' '),
      share: totalEvents > 0 ? (item.events || 0) / totalEvents : 0,
    }));

    const secondaryFeatures = tree.slice(0, 8).map((m) => ({
      feature: String(m.name || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      event: `${m.name}_viewed`,
      note: `${m.sessions || 0} sessions · ${m.events || 0} events`,
      users: m.users || 0,
    }));

    const dormantUsers = a?.dormant_users?.value ?? 0;

    return {
      tiles,
      trend,
      growth,
      retention,
      itemTypes,
      secondaryFeatures,
      dormantUsers,
      providers: [],
    };
  }, [adoptQuery.data, trendQuery.data, growthQuery.data, retentionQuery.data, modulesQuery.data]);

  /* Layer 3: Workflow strictly from live API */
  const flows = useMemo<WorkflowSample>(() => {
    const wf = workflowQuery.data;
    const curWf = findWorkflow(workflow);
    const k = wf?.kpis;

    /* When a live module is selected, use its display name; otherwise fall back to static wf. */
    const displayName = selectedModule
      ? selectedModule.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : curWf.name;

    const tiles: CalendarTileSpec[] = [
      {
        id: 'wfAdoption',
        label: 'Module Adoption',
        disp: k?.f_adopt?.value != null ? `${Math.round(k.f_adopt.value)}%` : '—',
        raw: k?.f_adopt?.value ?? 0,
        sub: 'users entering workflow',
        unit: '%',
        goodUp: true,
        infoKey: 'wfAdoption',
        infoLabel: 'Module Adoption',
        noTarget: true,
      },
      {
        id: 'wfCompletion',
        label: 'Completion Rate',
        disp: k?.f_comp?.value != null ? `${Math.round(k.f_comp.value)}%` : '—',
        raw: k?.f_comp?.value ?? 0,
        sub: 'entrants completing flow',
        unit: '%',
        goodUp: true,
        infoKey: 'wfCompletion',
        infoLabel: 'Completion Rate',
        noTarget: true,
      },
      {
        id: 'wfDropoff',
        label: 'Biggest Step Drop',
        disp: k?.f_step?.value != null ? `${Math.round(k.f_step.value)}%` : '—',
        raw: k?.f_step?.value ?? 0,
        sub: 'highest single drop-off',
        unit: '%',
        goodUp: false,
        noTarget: true,
        infoKey: 'wfDropoff',
        infoLabel: 'Biggest Step Drop',
      },
      {
        id: 'wfVolume',
        label: 'Usage Volume',
        disp: k?.f_vol?.value != null ? k.f_vol.value.toLocaleString() : '—',
        raw: k?.f_vol?.value ?? 0,
        sub: 'workflow completions',
        goodUp: true,
        noTarget: true,
        infoKey: 'wfVolume',
        infoLabel: 'Usage Volume',
      },
    ];

    let funnel: { step: string; ofEntrants: number; dropPct?: number }[] = [];
    if (wf?.funnel && wf.funnel.length > 0) {
      funnel = wf.funnel.map((s) => ({
        step: s.step.replace(/_/g, ' '),
        ofEntrants: Math.round(s.reach ?? 100),
        dropPct: s.drop_pct != null ? Math.round(s.drop_pct) : undefined,
      }));
    } else if (wf?.workflows && wf.workflows.length > 0) {
      const activeWorkflow = wf.workflows.find((w) => w.flow_key === workflow) ?? wf.workflows[0];
      if (activeWorkflow?.steps?.length) {
        funnel = activeWorkflow.steps.map((s) => ({
          step: s.step.replace(/_/g, ' '),
          ofEntrants: s.reach != null ? Math.round(s.reach) : 100,
          dropPct: s.drop_pct != null ? Math.round(s.drop_pct) : undefined,
        }));
      }
    }

    let screens: { screen: string; users: number; events: number; sessions: number; completion: number | null }[] = [];
    if (wf?.flows && wf.flows.length > 0) {
      screens = wf.flows.map((f) => ({
        screen: f.path,
        users: f.users,
        events: f.events,
        sessions: f.sessions,
        completion: f.f_comp != null ? Math.round(f.f_comp) : null,
      }));
    } else if (modulesQuery.data?.tree?.length) {
      screens = modulesQuery.data.tree.slice(0, 8).map((m) => ({
        screen: m.name,
        users: m.users,
        events: m.events,
        sessions: m.sessions,
        completion: null,
      }));
    }

    let entryRows: { event: string; sessions: number; views: number; build: string }[] = [];
    if (wf?.entry_screens && wf.entry_screens.length > 0) {
      entryRows = wf.entry_screens.map((e) => ({
        event: e.path,
        sessions: e.visitors,
        views: e.views,
        build: 'All builds',
      }));
    }

    return {
      /* When selectedModule is active, suppress the static scope note (it belongs to the static wf). */
      workflow: { ...curWf, name: displayName, incompleteNote: selectedModule ? undefined : curWf.incompleteNote },
      tiles,
      funnel,
      entryRows,
      screens,
    };
  }, [workflow, selectedModule, workflowQuery.data, modulesQuery.data]);

  const vm = useMemo<ViewModel>(
    () => ({
      traffic,
      adopt,
      flows,
      sessTab,
      dev,
      provider,
      prev,
      range,
      scopeLabel,
      selectedModule,
    }),
    [traffic, adopt, flows, sessTab, dev, provider, prev, range, scopeLabel, selectedModule],
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
  const setProvider = useCallback((p: string) => setProviderState(p), []);
  const setSessTab = useCallback((t: SessTab) => setSessTabState(t), []);
  const togglePrev = useCallback(() => setPrev((p) => !p), []);
  const setWorkflow = useCallback((key: string) => setWorkflowState(findWorkflow(key).key), []);
  const setSelectedModule = useCallback((m: string | null) => setSelectedModuleState(m), []);

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
      provider, setProvider,
      setPreset, setCustomRange, customRange, setDev, setSessTab,
      workflow, setWorkflow, togglePrev,
      selectedModule, setSelectedModule, modulesList,
      page, setPage, theme, toggleTheme, navCollapsed, toggleNav,
      palette: paletteFor(theme),
      getBenchmark, setBenchmark,
      isLive,
      isLoading,
      trafficLoading,
      adoptLoading,
      flowsLoading,
      refetch,
    }),
    [
      vm, provider, setProvider, setPreset, setCustomRange, customRange, setDev, setSessTab,
      workflow, setWorkflow, togglePrev, selectedModule, setSelectedModule, modulesList,
      page, theme, toggleTheme, navCollapsed, toggleNav, getBenchmark, setBenchmark,
      isLive, isLoading, trafficLoading, adoptLoading, flowsLoading, refetch,
    ],
  );

  return <CalendarDashboardContext.Provider value={value}>{children}</CalendarDashboardContext.Provider>;
}
