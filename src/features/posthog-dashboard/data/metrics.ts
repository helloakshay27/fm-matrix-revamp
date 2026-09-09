import type {
  AdoptionEngagementResponse,
  AdoptionTrendResponse,
  GrowthResponse,
  ModuleNode,
  RetentionResponse,
  RolesResponse,
  TrafficSessionResponse,
  UsageDay,
  UsageDistributionResponse,
  WorkflowUsageResponse,
} from '../api/adoptionApi';
import type { SiteLeagueEntry } from '../api/queries';
import {
  RETENTION_WEEKS,
  ROLE_COLORS,
  TREND_WEEKS,
  type DateRange,
  type Device,
  type Site,
  type SiteGroup,
  type Tier,
} from './constants';
import { fmtC, fmtDur, pctVal } from './format';

export interface DashboardState {
  /** Site Manager / Regional / Management — decides what `scope` means. */
  tier: Tier;
  /**
   * t1: a site id or 'all' · t2: a company id · t3: 'org' or a company id (drilled).
   */
  scope: string;
  date: DateRange;
  dev: Device;
  /** Layer-3 module / sub-module, both derived from real `$pathname` segments. */
  module: string | null;
  subModule: string | null;
  sessTab: 'visitors' | 'views' | 'sessions';
  prev: boolean;
  /** A1 needs a licensed-seat count — billing data the events don't carry. */
  licensedSeats: number | null;
  activePage: 'pgOverview' | 'pgTraffic' | 'pgAdopt' | 'pgFlows' | 'pgFm';
  theme: 'light' | 'dark';
  navCollapsed: boolean;
}

export const DEFAULT_STATE: DashboardState = {
  tier: 't3',
  scope: 'org',
  date: 30,
  dev: 'all',
  module: null,
  subModule: null,
  sessTab: 'sessions',
  prev: true,
  licensedSeats: null,
  activePage: 'pgTraffic',
  theme: 'light',
  navCollapsed: false,
};

/** Keeps `scope` valid for the current tier whenever the site list or tier changes. */
export function normalizeScope(
  tier: Tier,
  scope: string,
  sites: Site[],
  groups: SiteGroup[]
): string {
  if (tier === 't1') {
    if (scope === 'all') return 'all';
    const validIds = scope.split(',').filter(id => sites.some(s => s.id === id));
    return validIds.length > 0 ? validIds.join(',') : 'all';
  }
  if (tier === 't2') {
    return groups.some((g) => g.id === scope) ? scope : (groups[0]?.id ?? 'org');
  }
  return scope === 'org' || groups.some((g) => g.id === scope) ? scope : 'org';
}

/** The sites the current tier + scope covers. Empty means "every site / whole tenant". */
export function scopeSites(state: DashboardState, sites: Site[], groups: SiteGroup[]): Site[] {
  if (state.tier === 't1') {
    if (state.scope === 'all') return sites.slice();
    const selectedIds = new Set(state.scope.split(','));
    return sites.filter((s) => selectedIds.has(s.id));
  }
  if (state.tier === 't3' && state.scope === 'org') return sites.slice();
  const g = groups.find((x) => x.id === state.scope);
  if (!g) return sites.slice();
  const ids = new Set(g.siteIds);
  return sites.filter((s) => ids.has(s.id));
}

/** True when the scope is every site, so `site_id` can be omitted entirely. */
export function isWholeTenant(state: DashboardState): boolean {
  // Management (t3) always passes site IDs explicitly so the API gets the exact org-scoped list.
  // Only Site Manager "all" omits site_id (tenant-wide).
  return state.tier === 't1' && state.scope === 'all';
}

export function scopeLabel(state: DashboardState, sites: Site[], groups: SiteGroup[]): string {
  const scoped = scopeSites(state, sites, groups);
  const tierName =
    state.tier === 't1' ? 'Site Manager view' : state.tier === 't2' ? 'Regional view' : 'Management view';

  if (state.tier === 't1') {
    if (state.scope === 'all') {
      return `${sites.length ? `All sites · ${sites.length} sites` : 'Whole tenant'} · ${tierName}`;
    }
    const names = scoped.map(s => s.name);
    const label = names.length > 2 
      ? `${names[0]}, ${names[1]} +${names.length - 2}`
      : names.join(', ') || 'Unknown site';
    return `${label} · ${tierName}`;
  }

  if (state.tier === 't3' && state.scope === 'org') {
    return `${sites.length ? `All sites · ${sites.length} sites` : 'Whole tenant'}${groups.length ? ` · ${groups.length} companies` : ''} · ${tierName}`;
  }

  const g = groups.find((x) => x.id === state.scope);
  const n = `${scoped.length} site${scoped.length === 1 ? '' : 's'}`;
  return `${g?.name ?? 'All sites'} · ${n} · ${state.tier === 't3' ? 'Management (drilled)' : tierName}`;
}

/* ------------------------------------------------------------- date helpers */

function ymdParts(iso: string): [number, number, number] {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return [y, m, d];
}

function toDate(iso: string): Date {
  const [y, m, d] = ymdParts(iso);
  return new Date(y, m - 1, d);
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
}

function mdLabel(iso: string): string {
  const [, m, d] = ymdParts(iso);
  return `${m}/${d}`;
}

/** Every calendar day in [from, to] — the API omits days with no activity. */
function dayRange(from: string, to: string): string[] {
  const out: string[] = [];
  const end = toDate(to);
  for (let d = toDate(from); d <= end; d.setDate(d.getDate() + 1)) out.push(ymd(d));
  return out;
}

/** Monday of the ISO week containing `iso`, matching the API's week bucketing. */
function mondayOf(iso: string): Date {
  const d = toDate(iso);
  const dow = (d.getDay() + 6) % 7; // Mon = 0
  d.setDate(d.getDate() - dow);
  return d;
}

function weekRange(anchorTo: string, weeks: number, offsetWeeks = 0): string[] {
  const last = mondayOf(anchorTo);
  last.setDate(last.getDate() - offsetWeeks * 7);
  const out: string[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(last);
    d.setDate(last.getDate() - i * 7);
    out.push(ymd(d));
  }
  return out;
}

/* -------------------------------------------------------------------- tiles */

export interface TileSpec {
  id: string;
  label: string;
  disp: string;
  delta: number | null;
  goodUp: boolean;
  sub?: string;
  /** Numeric value the user's target is compared against. */
  raw: number;
  unit?: string;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const deltaOf = (n: number | null | undefined) => (n == null ? null : Math.round(n));

/* ------------------------------------------------------------------ Layer 1 */

export interface UsageChartData {
  measure: 'visitors' | 'views' | 'sessions';
  cur: number[];
  prev: number[];
  labels: string[];
}

export interface TrafficData {
  tiles: TileSpec[];
  chart: UsageChartData;
  deviceRows: [string, number, string][];
  liveKv: number | null;
  vpsKv: string;
}

const DEVICE_COLORS: Record<string, string> = {
  Desktop: 'var(--blue)',
  Mobile: 'var(--mint)',
  Tablet: 'var(--amber)',
};

function densifyDays(
  rows: UsageDay[],
  days: string[],
  measure: 'visitors' | 'views' | 'sessions'
): number[] {
  const byDay = new Map(rows.map((r) => [r.day.slice(0, 10), r]));
  return days.map((d) => byDay.get(d)?.[measure] ?? 0);
}

/**
 * The day series is bucketed in UTC while from/to snap to IST, so the API can return a
 * boundary day just outside the requested range. Union the two so the plotted line still
 * sums to the tile totals.
 */
function unionDays(rangeDays: string[], rows: UsageDay[] | undefined): string[] {
  const set = new Set(rangeDays);
  for (const r of rows ?? []) set.add(r.day.slice(0, 10));
  return [...set].sort();
}

/** The `n` calendar days ending the day before `firstDay`. */
function windowBefore(firstDay: string, n: number): string[] {
  const end = toDate(firstDay);
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - (n - 1));
  return dayRange(ymd(start), ymd(end));
}

export function buildTraffic(
  state: DashboardState,
  from: string,
  to: string,
  traffic: TrafficSessionResponse | undefined,
  usage: UsageDistributionResponse | undefined
): TrafficData {
  const t = traffic?.tiles;
  const dp = traffic?.delta_pct;

  const tiles: TileSpec[] = [
    {
      id: 'U1',
      label: 'Active Users (U1)',
      disp: t ? fmtC(t.active_users) : '—',
      delta: deltaOf(dp?.active_users),
      goodUp: true,
      sub: 'distinct users in period',
      raw: t?.active_users ?? 0,
    },
    {
      id: 'U2',
      label: 'Screen Views (U2)',
      disp: t ? fmtC(t.screen_views) : '—',
      delta: deltaOf(dp?.screen_views),
      goodUp: true,
      sub: 'total pageviews',
      raw: t?.screen_views ?? 0,
    },
    {
      id: 'U3',
      label: 'Sessions (U3)',
      disp: t ? fmtC(t.sessions) : '—',
      delta: deltaOf(dp?.sessions),
      goodUp: true,
      sub: 'in period',
      raw: t?.sessions ?? 0,
    },
    {
      id: 'U5',
      label: 'Session Duration (U5)',
      disp: t ? fmtDur(t.avg_session_seconds) : '—',
      delta: deltaOf(dp?.avg_session_seconds),
      goodUp: true,
      sub: 'average',
      raw: round1((t?.avg_session_seconds ?? 0) / 60),
      unit: 'min',
    },
    {
      id: 'U6',
      label: 'Bounce Rate (U6)',
      disp: pctVal(t?.bounce_rate),
      delta: deltaOf(dp?.bounce_rate),
      goodUp: false,
      sub: '≤ 1 pageview · lower is better',
      raw: round1(t?.bounce_rate ?? 0),
      unit: '%',
    },
    {
      id: 'U8',
      label: 'Recently Online (U8)',
      disp: t ? String(t.recently_online) : '—',
      delta: null,
      goodUp: true,
      sub: 'active last 30 min',
      raw: t?.recently_online ?? 0,
    },
  ];

  const days = unionDays(dayRange(from, to), usage?.usage_over_time.current);
  // The previous line is a reference overlay, so keep it the same length as the current
  // line and aligned on its most recent days.
  const prevDays = unionDays(
    windowBefore(days[0], days.length),
    usage?.usage_over_time.previous
  ).slice(-days.length);

  const cur = densifyDays(usage?.usage_over_time.current ?? [], days, state.sessTab);
  const prev = densifyDays(usage?.usage_over_time.previous ?? [], prevDays, state.sessTab);

  const deviceRows: [string, number, string][] = (usage?.device_split.devices ?? []).map((d) => [
    d.device,
    d.session_share / 100,
    DEVICE_COLORS[d.device] ?? 'var(--faint)',
  ]);

  return {
    tiles,
    chart: { measure: state.sessTab, cur, prev, labels: days.map(mdLabel) },
    deviceRows,
    liveKv: t?.recently_online ?? null,
    vpsKv: usage ? usage.views_per_session.toFixed(1) : '—',
  };
}

/* ------------------------------------------------------------------ Layer 2 */

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
  users: number;
}

export interface AdoptData {
  tiles: TileSpec[];
  trendChart: { cur: number[]; prev: number[]; labels: string[] };
  growthWeeks: GrowthWeek[];
  retentionCohorts: (number | null)[][];
  retentionRowLabels: string[];
  roleShares: RoleShare[];
  breadthKv: string;
  dormantKv: string;
  activationKv: string;
}

/** `pms_organization_admin` → `Organization Admin`. */
export function prettyRole(role: string): string {
  return (
    role
      .replace(/^pms_/, '')
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || role
  );
}

export function buildAdopt(
  state: DashboardState,
  to: string,
  eng: AdoptionEngagementResponse | undefined,
  trend: AdoptionTrendResponse | undefined,
  growth: GrowthResponse | undefined,
  retention: RetentionResponse | undefined,
  roles: RolesResponse | undefined
): AdoptData {
  const seat = eng?.seat_utilisation;
  const stick = eng?.stickiness;
  const a3 = eng?.adoption_trend;
  const act = eng?.activation;
  const breadth = eng?.module_breadth;

  const tiles: TileSpec[] = [
    {
      id: 'A1',
      label: 'Seat Utilisation (A1)',
      disp: pctVal(seat?.value),
      delta: deltaOf(seat?.delta_pct),
      goodUp: true,
      sub: seat
        ? seat.licensed_seats
          ? `${fmtC(seat.used_seats)} / ${fmtC(seat.licensed_seats)} seats`
          : `${fmtC(seat.used_seats)} active · set licensed seats`
        : 'no data',
      raw: round1(seat?.value ?? 0),
      unit: '%',
    },
    {
      id: 'A2',
      label: 'Stickiness (A2)',
      disp: pctVal(stick?.value),
      delta: deltaOf(stick?.delta_pct),
      goodUp: true,
      sub: stick ? `avg DAU ${round1(stick.avg_dau)} / MAU ${fmtC(stick.mau)}` : 'DAU / MAU',
      raw: round1(stick?.value ?? 0),
      unit: '%',
    },
    {
      id: 'A3',
      label: 'Adoption Trend (A3)',
      disp: a3?.value == null ? '—' : `${a3.value > 0 ? '+' : ''}${round1(a3.value)}%`,
      delta: null,
      goodUp: true,
      sub: a3 ? `WAU ${fmtC(a3.wau_now)} vs ${fmtC(a3.wau_4wk_ago)} 4 wks ago` : 'WAU vs 4 wks ago',
      raw: round1(a3?.value ?? 0),
      unit: '%',
    },
    {
      id: 'A5',
      label: '14-Day Activation (A5)',
      disp: pctVal(act?.value),
      delta: deltaOf(act?.delta_pct),
      goodUp: true,
      sub: act ? `of ${fmtC(act.joiners)} new joiners` : 'of new joiners',
      raw: round1(act?.value ?? 0),
      unit: '%',
    },
    {
      id: 'A6',
      label: 'Module Breadth (A6)',
      disp: breadth ? `${breadth.in_use} / ${breadth.total}` : '—',
      delta: null,
      goodUp: true,
      sub: 'modules in use',
      raw: breadth?.in_use ?? 0,
    },
  ];

  // The API omits weeks with no activity — rebuild the full window so the line stays evenly spaced.
  const curWeeks = weekRange(to, TREND_WEEKS);
  const prevWeeks = weekRange(to, TREND_WEEKS, TREND_WEEKS);
  const curMap = new Map((trend?.weekly.current ?? []).map((w) => [w.week.slice(0, 10), w.wau]));
  const prevMap = new Map((trend?.weekly.previous ?? []).map((w) => [w.week.slice(0, 10), w.wau]));

  const growthWeeks: GrowthWeek[] = (growth?.weeks ?? []).map((w) => ({
    label: mdLabel(w.week),
    nw: w.new,
    ret: w.returning,
    res: w.resurrected,
    dorm: w.dormant,
  }));

  const cohorts: (number | null)[][] = [];
  const retentionRowLabels: string[] = [];
  for (const row of retention?.cohorts ?? []) {
    const curve: (number | null)[] = [];
    for (let w = 0; w < RETENTION_WEEKS; w++) {
      const v = row[`week${w}`];
      curve.push(typeof v === 'number' ? Math.round(v) : null);
    }
    cohorts.push(curve);
    retentionRowLabels.push(`${mdLabel(row.cohort_week)} · ${row.size}`);
  }

  const roleShares: RoleShare[] = (roles?.roles ?? []).map((r, i) => ({
    name: prettyRole(r.role),
    share: r.active_share / 100,
    color: ROLE_COLORS[i % ROLE_COLORS.length],
    users: r.users,
  }));

  return {
    tiles,
    trendChart: {
      cur: curWeeks.map((w) => curMap.get(w) ?? 0),
      // The API returns an empty `previous` when there is no history that far back —
      // an all-zero comparison line would read as "engagement was zero", so drop it.
      prev: prevMap.size ? prevWeeks.map((w) => prevMap.get(w) ?? 0) : [],
      labels: curWeeks.map(mdLabel),
    },
    growthWeeks,
    retentionCohorts: cohorts,
    retentionRowLabels,
    roleShares,
    breadthKv: breadth ? `${breadth.in_use} / ${breadth.total}` : '—',
    dormantKv: eng ? fmtC(eng.dormant_users.value) : '—',
    activationKv: pctVal(act?.value),
  };
}

/* -------------------------------------------------------- site league table */

export interface SiteHealthRow {
  siteId: string;
  name: string;
  users: number;
  sessions: number;
  durSec: number;
  bounce: number; // 0-100
  trend: number | null;
}

export interface SiteHealthData {
  rows: SiteHealthRow[];
}

/** Built by fanning `traffic_session` out per site — there is no per-site endpoint. */
export function buildSiteHealth(
  entries: SiteLeagueEntry[],
  sites: Site[]
): SiteHealthData | null {
  const nameById = new Map(sites.map((s) => [s.id, s.name]));
  const rows: SiteHealthRow[] = entries
    .filter((e) => e.data)
    .map((e) => ({
      siteId: e.siteId,
      name: nameById.get(e.siteId) ?? e.siteId,
      users: e.data!.tiles.active_users,
      sessions: e.data!.tiles.sessions,
      durSec: e.data!.tiles.avg_session_seconds,
      bounce: e.data!.tiles.bounce_rate,
      trend: deltaOf(e.data!.delta_pct.active_users),
    }))
    // Busiest first. Most allowed sites have no events at all, so sorting worst-first
    // would bury every site that actually has data under a wall of zeros.
    .sort((a, b) => b.users - a.users || b.sessions - a.sessions);
  return rows.length ? { rows } : null;
}

/* ------------------------------------------------------------------ Layer 3 */

export interface FunnelData {
  flowLabel: string;
  steps: string[];
  reaches: number[];
  dropPct: (number | null)[];
  worst: number;
  worstDrop: number;
}

export interface FlowRow {
  path: string;
  users: number;
  events: number;
  sessions: number;
  comp: number | null;
}

export interface PathRow {
  path: string;
  vis: number;
  vw: number;
  bo: number; // 0-100
  dv: number | null;
  dw: number | null;
  db: number | null;
}

export interface FlowsData {
  modName: string;
  flagshipFunnelName: string;
  tiles: TileSpec[];
  funnel: FunnelData;
  flowRows: FlowRow[];
  pathRows: PathRow[];
}

export function buildFlows(
  state: DashboardState,
  wf: WorkflowUsageResponse | undefined
): FlowsData {
  const k = wf?.kpis;
  const tiles: TileSpec[] = [
    {
      id: 'F-adopt',
      label: 'Workflow Adoption (F-adopt)',
      disp: pctVal(k?.f_adopt.value),
      delta: deltaOf(k?.f_adopt.delta_pct),
      goodUp: true,
      sub: 'active users who enter',
      raw: round1(k?.f_adopt.value ?? 0),
      unit: '%',
    },
    {
      id: 'F-comp',
      label: 'Completion Rate (F-comp)',
      disp: pctVal(k?.f_comp.value),
      delta: deltaOf(k?.f_comp.delta_pct),
      goodUp: true,
      sub: 'reach the last step',
      raw: round1(k?.f_comp.value ?? 0),
      unit: '%',
    },
    {
      id: 'F-step',
      label: 'Biggest Step Drop (F-step)',
      disp: pctVal(k?.f_step.value),
      delta: deltaOf(k?.f_step.delta_pct),
      goodUp: false,
      sub: 'at worst step',
      raw: round1(k?.f_step.value ?? 0),
      unit: '%',
    },
    {
      id: 'F-vol',
      label: 'Usage Volume (F-vol)',
      disp: k?.f_vol.value == null ? '—' : fmtC(k.f_vol.value),
      delta: deltaOf(k?.f_vol.delta_pct),
      goodUp: true,
      sub: 'sessions entering the flow',
      raw: k?.f_vol.value ?? 0,
    },
  ];

  const funnelSteps = wf?.funnel ?? [];
  const worstIdx = Math.max(
    0,
    funnelSteps.findIndex((s) => s.biggest)
  );
  const prefix = wf?.meta.prefix ?? '';
  const modName = [state.module, state.subModule].filter(Boolean).join(' · ') || '—';

  return {
    modName,
    flagshipFunnelName: prefix ? `${prefix} flow` : 'Workflow funnel',
    tiles,
    funnel: {
      flowLabel: prefix || modName,
      steps: funnelSteps.map((s) => s.step),
      reaches: funnelSteps.map((s) => s.reach),
      dropPct: funnelSteps.map((s) => s.drop_pct),
      worst: worstIdx,
      worstDrop: Math.round(funnelSteps[worstIdx]?.drop_pct ?? 0),
    },
    flowRows: (wf?.flows ?? []).map((f) => ({
      path: f.path,
      users: f.users,
      events: f.events,
      sessions: f.sessions,
      comp: f.f_comp,
    })),
    pathRows: (wf?.entry_screens ?? []).map((p) => ({
      path: p.path,
      vis: p.visitors,
      vw: p.views,
      bo: p.bounce,
      dv: deltaOf(p.visitors_trend),
      dw: deltaOf(p.views_trend),
      db: deltaOf(p.bounce_trend),
    })),
  };
}

/** Module nav rows, ordered by the API (events desc). */
export interface ModuleOption {
  name: string;
  users: number;
  events: number;
  sessions: number;
}

export function toModuleOptions(tree: ModuleNode[] | undefined): ModuleOption[] {
  return (tree ?? []).map((m) => ({
    name: m.name,
    users: m.users,
    events: m.events,
    sessions: m.sessions,
  }));
}
