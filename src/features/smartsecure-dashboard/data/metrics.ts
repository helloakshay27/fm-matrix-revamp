import { rngFor, devFactor, rangeFactor } from './rng';
import { ACTIVE_USERS_BASE, SESSIONS_BASE, MONTHS, PROJECTS, BOOKED_HOMEBUYERS, TOTAL_MODULES } from './constants';
import { WORKFLOWS, type Workflow } from './workflows';
import { fmtC, pct } from './format';
import type { DashboardState, TileSpec } from './types';

/* ================================================================
   1. TRAFFIC & SESSION — ported from the wireframe's renderTraffic()
   ================================================================ */

export interface UsageSeries {
  cur: number[];
  prev: number[];
  labels: string[];
  color: string;
  fillColor: string;
  legendLabel: string;
}

export interface TrafficData {
  tiles: TileSpec[];
  usage: Record<'visitors' | 'views' | 'sessions', UsageSeries>;
  deviceRows: { name: string; share: number; color: string }[];
  viewsPerSession: string;
}

function currentActiveUsers(state: DashboardState): number {
  const activeUsers = ACTIVE_USERS_BASE.map((v) => Math.round(v * devFactor(state.dev)));
  const rf = rangeFactor(state.range);
  return Math.min(
    Math.round(activeUsers[activeUsers.length - 1] * Math.min(rf, 1.6)),
    Math.round(BOOKED_HOMEBUYERS * 0.92)
  );
}

export function buildTraffic(state: DashboardState): TrafficData {
  const dev = state.dev;
  const activeUsers = ACTIVE_USERS_BASE.map((v) => Math.round(v * devFactor(dev)));
  const sessions = SESSIONS_BASE.map((v) => Math.round(v * devFactor(dev)));
  const rf = rangeFactor(state.range);

  const curActive = currentActiveUsers(state);
  const curSessions = Math.round(sessions[sessions.length - 1] * rf);
  const views = Math.round(curSessions * 4.07);
  const bounce = 22;
  const avgDur = '4m 02s';
  const recentlyOnline = Math.round(curActive * 0.021);

  const tiles: TileSpec[] = [
    { id: 'activeUsers', label: 'Active Users', val: curActive.toLocaleString(), dir: 'up', delta: '5.8% vs prev. period', sub: 'unique gate staff/admins this period', raw: curActive, unit: 'K', goodUp: true },
    { id: 'screenViews', label: 'Screen Views', val: fmtC(views), dir: 'up', delta: '4.6%', sub: 'total across modules', raw: views, noTarget: true },
    { id: 'totalSessions', label: 'Sessions', val: curSessions.toLocaleString(), dir: 'up', delta: '4.1%', sub: 'app sessions started', raw: curSessions, noTarget: true },
    { id: 'avgSessionDur', label: 'Session Duration', val: avgDur, dir: 'up', delta: '16s', sub: 'per session', raw: 4.03, noTarget: true },
    { id: 'bounceRate', label: 'Bounce Rate', val: '22%', dir: 'dn', delta: '1.3%', sub: 'lower is better', raw: bounce, unit: '%', goodUp: false },
    { id: 'recentlyOnline', label: 'Recently Online', val: recentlyOnline.toLocaleString(), dir: 'flat', delta: null, sub: 'active in last 30 min', noTarget: true },
  ];

  const prevSeries = (base: number[], shrink: number) => base.map((v) => Math.round(v * shrink * devFactor(dev)));

  const usage: TrafficData['usage'] = {
    visitors: { cur: activeUsers, prev: prevSeries(ACTIVE_USERS_BASE, 0.9), labels: MONTHS, color: 'var(--ss-chart-blue)', fillColor: 'var(--ss-chart-fill)', legendLabel: 'Visitors' },
    views: {
      cur: activeUsers.map((v) => Math.round(v * 4.07)),
      prev: prevSeries(ACTIVE_USERS_BASE.map((v) => v * 4.07), 0.9),
      labels: MONTHS,
      color: 'var(--ss-chart-violet)',
      fillColor: 'var(--ss-chart-violet-tint)',
      legendLabel: 'Views',
    },
    sessions: { cur: sessions, prev: prevSeries(SESSIONS_BASE, 0.92), labels: MONTHS, color: 'var(--ss-green)', fillColor: 'var(--ss-green-tint)', legendLabel: 'Sessions' },
  };

  const ds = 0.59;
  const iosShare = dev === 'android' ? 0 : dev === 'ios' ? 1 : ds;
  const androidShare = dev === 'ios' ? 0 : dev === 'android' ? 1 : 1 - ds;
  const deviceRows = [
    { name: 'iOS', share: iosShare, color: 'var(--ss-chart-violet)' },
    { name: 'Android', share: androidShare, color: 'var(--ss-green)' },
  ];

  return { tiles, usage, deviceRows, viewsPerSession: (views / curSessions).toFixed(1) };
}

/* ================================================================
   2. ADOPTION & ENGAGEMENT — ported from renderAdoption() +
      renderRetentionCohort() + renderDormant() + renderSiteWise()
   ================================================================ */

export interface GrowthWeek {
  label: string;
  nw: number;
  ret: number;
  res: number;
  dorm: number;
}

export interface RoleShare {
  name: string;
  share: number;
  color: string;
}

export interface SocietyRow {
  society: string;
  active: number;
  sessions: number;
  avgSession: string;
  bounce: number;
  trend: 'up' | 'dn' | 'flat';
  status: 'Watch' | 'Steady' | 'Healthy';
  statusClass: 'st-drop' | 'st-watch' | 'st-healthy';
}

export interface AdoptData {
  tiles: TileSpec[];
  adoptionTrendChart: { series: number[]; labels: string[] };
  growthWeeks: GrowthWeek[];
  retentionCohorts: (number | null)[][];
  retentionRowLabels: string[];
  roleShares: RoleShare[];
  dormant: number;
  societyRows: SocietyRow[];
}

export function buildAdoption(state: DashboardState): AdoptData {
  const dev = state.dev;
  const r = rngFor('adoptTiles|' + dev);
  const curActive = currentActiveUsers(state);
  const seatUtil = curActive / BOOKED_HOMEBUYERS;
  const stickiness = 0.34 + r() * 0.08;
  const adoptionTrend = Math.round(4 + r() * 6);
  const activation14 = Math.round(52 + r() * 10);
  const usedModules = 11; // ILLUSTRATIVE — sample count of modules touched at least once this period

  const tiles: TileSpec[] = [
    { id: 'seatUtil', label: 'Seat Utilisation', val: pct(seatUtil * 100), dir: 'up', delta: '2.1%', sub: 'active ÷ registered gate staff', raw: seatUtil * 100, unit: '%', goodUp: true },
    { id: 'stickiness', label: 'Stickiness', val: pct(stickiness * 100), dir: 'up', delta: '1.2%', sub: 'avg DAU/MAU', raw: stickiness * 100, unit: '%', goodUp: true },
    { id: 'adoptionTrend', label: 'Adoption Trend', val: '+' + adoptionTrend + '%', dir: 'up', delta: 'vs prior 8 weeks', sub: 'weekly active users', noTarget: true },
    { id: 'activation14', label: '14-Day Activation', val: activation14 + '%', dir: 'up', delta: '1.8%', sub: 'of new gate staff', raw: activation14, unit: '%', goodUp: true },
    { id: 'moduleBreadth', label: 'Module Breadth', val: usedModules + ' / ' + TOTAL_MODULES, dir: 'flat', delta: null, sub: 'modules used this period', noTarget: true },
  ];

  const trendWeeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  const tr = rngFor('adoptTrendChart|' + dev);
  const base = curActive * 0.62;
  const adoptionTrendSeries = trendWeeks.map((_, i) => Math.round(base * (0.88 + i * 0.018) * (0.97 + tr() * 0.06)));

  const r2 = rngFor('growth|' + dev);
  const growthBase = 7600 * devFactor(dev);
  const growthWeeks: GrowthWeek[] = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((label) => ({
    label,
    nw: Math.round(growthBase * (0.05 + r2() * 0.06)),
    ret: Math.round(growthBase * (0.55 + r2() * 0.15)),
    res: Math.round(growthBase * (0.03 + r2() * 0.04)),
    dorm: Math.round(growthBase * (0.06 + r2() * 0.08)),
  }));

  const cohortDates = ['5/22', '5/29', '6/5', '6/12', '6/19', '6/26'];
  const rows = 6, cols = 6;
  const retentionCohorts: (number | null)[][] = [];
  cohortDates.forEach((dt, i) => {
    const rr = rngFor('cohort|' + dt + '|' + dev);
    let base2 = 1;
    const curve: (number | null)[] = [];
    for (let w = 0; w < cols; w++) {
      if (w > cols - 1 - (rows - 1 - i)) {
        curve.push(null);
        continue;
      }
      let v: number;
      if (w === 0) v = 1;
      else {
        base2 = base2 * (0.6 + rr() * 0.28);
        v = base2;
      }
      curve.push(w === 0 ? 100 : Math.round(v * 100));
    }
    retentionCohorts.push(curve);
  });

  const roleShares: RoleShare[] = [
    { name: 'Gatekeepers', share: 0.91, color: 'var(--ss-chart-blue)' },
    { name: 'Supervisors', share: 0.64, color: 'var(--ss-chart-violet)' },
    { name: 'Society Admins', share: 0.52, color: 'var(--ss-mint)' },
    { name: 'All registered staff', share: 0.71, color: 'var(--ss-green)' },
  ];

  const dormantR = rngFor('dormant|' + dev);
  const dormant = Math.round(60 + dormantR() * 90);

  const societyRows: SocietyRow[] = PROJECTS.map((p) => {
    const rr = rngFor('sitewise|' + p + '|' + dev);
    const active = Math.round((90 + rr() * 260) * devFactor(dev));
    const sessions = Math.round(active * (2.6 + rr() * 1.4));
    const avgSession = (2.0 + rr() * 1.6).toFixed(1) + 'm';
    const bounce = Math.round(10 + rr() * 16);
    const trendRoll = rr();
    const trend: SocietyRow['trend'] = trendRoll > 0.35 ? 'up' : trendRoll > 0.15 ? 'flat' : 'dn';
    const [statusClass, status]: [SocietyRow['statusClass'], SocietyRow['status']] =
      bounce >= 22 ? ['st-drop', 'Watch'] : bounce >= 16 ? ['st-watch', 'Steady'] : ['st-healthy', 'Healthy'];
    return { society: p, active, sessions, avgSession, bounce, trend, status, statusClass };
  }).sort((a, b) => b.active - a.active);

  return {
    tiles,
    adoptionTrendChart: { series: adoptionTrendSeries, labels: trendWeeks },
    growthWeeks,
    retentionCohorts,
    retentionRowLabels: cohortDates,
    roleShares,
    dormant,
    societyRows,
  };
}

/* ================================================================
   3. WORKFLOW USAGE — ported from renderWf()
   ================================================================ */

export interface FunnelStep {
  step: string;
  pctOfEntrants: number;
  dropPct: number | null;
}

export interface FunnelData {
  steps: FunnelStep[];
  worstIndex: number;
}

export interface ScreenRow {
  screen: string;
  users: number;
  events: number;
  sessions: number;
  completion: number;
}

export interface EntryScreenRow {
  screen: string;
  visitors: number;
  views: number;
  bounce: number;
}

export interface FlowsData {
  workflow: Workflow;
  tiles: TileSpec[];
  funnel: FunnelData;
  screens: ScreenRow[];
  entryScreens: EntryScreenRow[];
  scopeNote: { kind: 'proposed' | 'incomplete'; text: string } | null;
}

/** ILLUSTRATIVE, org-wide (not module-filtered), matching the wireframe's fixed sample rows. */
const ENTRY_SCREEN_SAMPLES: [string, number][] = [
  ['splash_screen_viewed', 58],
  ['home_tab_viewed', 22],
  ['splash_opened_from_notification', 9],
  ['notifications_list_viewed', 6],
  ['gatekeeper_verification_approval_status_checked', 5],
];

function biggestStepDrop(w: Workflow): { step: string; pct: number } {
  const fr = rngFor('funnel|' + w.key);
  const n = w.steps.length;
  let maxDrop = 0;
  let maxStep = w.steps[Math.min(1, n - 1)];
  for (let i = 1; i < n; i++) {
    const drop = Math.round((n - i) * 3 + fr() * 8);
    if (drop > maxDrop) {
      maxDrop = drop;
      maxStep = w.steps[i];
    }
  }
  return { step: maxStep, pct: maxDrop };
}

export function buildFlows(state: DashboardState): FlowsData {
  const w = WORKFLOWS.find((x) => x.key === state.wf) ?? WORKFLOWS[0];
  const dev = state.dev;
  const drop = biggestStepDrop(w);

  const tiles: TileSpec[] = [
    { id: 'F-adopt', label: 'Workflow Adoption', val: w.adoption + '%', dir: w.adoption >= 45 ? 'up' : 'flat', delta: w.adoption >= 45 ? 'improving' : 'stable', raw: w.adoption, unit: '%', goodUp: true },
    { id: 'F-comp', label: 'Completion Rate', val: w.completionRate + '%', dir: w.completionRate >= 55 ? 'up' : 'dn', delta: w.completionRate >= 55 ? 'improving' : 'needs attention', raw: w.completionRate, unit: '%', goodUp: true },
    { label: 'Biggest Step Drop', val: drop.pct + '%', dir: 'dn', delta: drop.step, sub: 'at ' + drop.step, noTarget: true },
    { label: 'Usage Volume', val: w.completions, dir: 'up', delta: 'this period', sub: 'completions', noTarget: true },
  ];

  const n = w.steps.length;
  const start = 100;
  const fr = rngFor('funnel|' + w.key); // same seed as biggestStepDrop → identical per-step sequence
  let worstIndex = 0;
  let worstDrop = -1;
  const steps: FunnelStep[] = w.steps.map((step, i) => {
    const pctOfEntrants = Math.round(start - i * (start * 0.55 / (n - 1 || 1)));
    const dropPct = i > 0 ? Math.round((n - i) * 3 + fr() * 8) : null;
    if (dropPct != null && dropPct > worstDrop) {
      worstDrop = dropPct;
      worstIndex = i;
    }
    return { step, pctOfEntrants, dropPct };
  });

  const rr = rngFor('allscreens|' + w.key);
  const totalCompletions = parseInt(w.completions.replace(/,/g, ''), 10);
  const screens: ScreenRow[] = w.steps.map((step, i) => {
    const users = Math.round(totalCompletions * (1 - i * 0.12) * (0.9 + rr() * 0.2));
    const events = Math.round(users * (1.1 + rr() * 0.6));
    const sessions = Math.round(users * (0.85 + rr() * 0.1));
    const completion = Math.max(8, Math.round(w.completionRate + (n - 1 - i) * 4 - rr() * 6));
    return { screen: step, users, events, sessions, completion };
  });

  const entryScreens: EntryScreenRow[] = ENTRY_SCREEN_SAMPLES.map(([screen, weight]) => {
    const visitors = Math.round(weight * 120 * devFactor(dev));
    const views = Math.round(visitors * 1.8);
    const bounce = Math.max(6, Math.round(30 - weight * 0.3));
    return { screen, visitors, views, bounce };
  });

  const scopeNote: FlowsData['scopeNote'] = w.proposed
    ? {
        kind: 'proposed',
        text:
          "This card and its event names (steps below) do not exist in SmartSecure_PostHog_Events.xlsx. They were added after reviewing the design team's Figma screens for visitor registration, which show this step as part of the real product flow. Treat every event name here as a suggested starting point for engineers to confirm and instrument, not as confirmed instrumentation.",
      }
    : w.incompleteNote
      ? { kind: 'incomplete', text: w.incompleteNote }
      : null;

  return { workflow: w, tiles, funnel: { steps, worstIndex }, screens, entryScreens, scopeNote };
}
