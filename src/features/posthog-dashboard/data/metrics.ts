import { rngFor } from './rng';
import { MODULES, ROLES, type Site, type Tier, type Device, type DateRange } from './constants';
import { fmtC, fmtDur, pct } from './format';

export interface DashboardState {
  tier: Tier;
  scope: string;
  date: DateRange;
  dev: Device;
  mod: string;
  sessTab: 'visitors' | 'views' | 'sessions';
  prev: boolean;
}

export const DEFAULT_STATE: DashboardState = {
  tier: 't1', scope: 'bkc', date: 30, dev: 'all', mod: 'helpdesk', sessTab: 'sessions', prev: true,
};

/** Keeps `scope` valid whenever the tier or the allowed-sites list changes (mirrors the wireframe's fillScope()). */
export function normalizeScope(tier: Tier, scope: string, sites: Site[], regions: string[], preferredSiteId?: string): string {
  if (tier === 't1') {
    if (scope === 'all' || sites.some((s) => s.id === scope)) return scope;
    if (preferredSiteId && sites.some((s) => s.id === preferredSiteId)) return preferredSiteId;
    return sites[0]?.id ?? scope;
  }
  if (tier === 't2') return regions.includes(scope) ? scope : (regions[0] ?? scope);
  if (scope !== 'org' && !regions.includes(scope)) return 'org';
  return scope;
}

export function scopeSites(state: DashboardState, sites: Site[]): Site[] {
  if (state.tier === 't1') return state.scope === 'all' ? sites.slice() : sites.filter((s) => s.id === state.scope);
  if (state.tier === 't2') return sites.filter((s) => s.region === state.scope);
  if (state.scope === 'org') return sites.slice();
  return sites.filter((s) => s.region === state.scope);
}

export function scopeKey(state: DashboardState): string {
  return `${state.tier}|${state.scope}|${state.date}|${state.dev}`;
}

export function scopeLabel(state: DashboardState, sites: Site[], regions: string[]): string {
  const s = scopeSites(state, sites);
  if (state.tier === 't1') {
    if (state.scope === 'all') return `All sites · ${s.length} sites · Site Manager view`;
    const site = s[0];
    return site ? `${site.name} · ${site.region} region · Site Manager view` : 'No site available · Site Manager view';
  }
  if (state.tier === 't2') return `${state.scope} region · ${s.length} sites · Regional view`;
  if (state.scope === 'org') return `All sites · ${s.length} sites · ${regions.join(' / ')} · Management view`;
  return `${state.scope} region · ${s.length} sites · Management (drilled)`;
}

export function seats(sites: Site[]): number {
  return sites.reduce((a, s) => a + s.seats, 0);
}

function devFactor(dev: Device): number {
  return dev === 'all' ? 1 : dev === 'desktop' ? 0.63 : 0.37;
}

function dateFactor(date: DateRange): number {
  return date === 7 ? 0.34 : date === 30 ? 1 : 2.6;
}

export interface Core {
  sites: Site[];
  S: number;
  util: number;
  WAU: number;
  MAU: number;
  DAU: number;
  stick: number;
  sessions: number;
  views: number;
  vps: number;
  durSec: number;
  bounce: number;
  live: number;
  desktopShare: number;
  activation: number;
  dormant: number;
  breadthUsed: number;
  dVis: number;
  dViews: number;
  dSess: number;
  dDur: number;
  dBounce: number;
  dUtil: number;
  dStick: number;
  dTrend: number;
  dAct: number;
}

export function core(state: DashboardState, allSites: Site[]): Core {
  const sites = scopeSites(state, allSites);
  const key = scopeKey(state);
  const r = rngFor(key);
  const S = seats(sites);
  const util = 0.52 + r() * 0.36;
  const WAU = Math.max(3, Math.round(S * util * devFactor(state.dev)));
  const MAU = Math.round(WAU * (1.18 + r() * 0.28));
  const DAU = Math.round(WAU * (0.3 + r() * 0.2));
  const stick = DAU / MAU;
  const sessions = Math.round(WAU * (3.2 + r() * 4.5) * dateFactor(state.date));
  const views = Math.round(sessions * (6 + r() * 9));
  const vps = views / sessions;
  const durSec = Math.round(210 + r() * 640);
  const bounce = 0.07 + r() * 0.2;
  const live = Math.max(1, Math.round(DAU * (0.05 + r() * 0.1)));
  const desktopShare = 0.55 + r() * 0.2;
  const activation = 0.38 + r() * 0.42;
  const dormant = Math.round((MAU - WAU) * (0.4 + r() * 0.4));
  const breadthUsed = Math.max(2, Math.round(MODULES.length * (0.55 + r() * 0.4)));

  const rp = rngFor(key + '|prev');
  const d = () => rp() * 2 - 1;
  return {
    sites, S, util, WAU, MAU, DAU, stick, sessions, views, vps, durSec, bounce, live, desktopShare, activation, dormant, breadthUsed,
    dVis: Math.round((d() * 0.5 + 0.15) * 100),
    dViews: Math.round((d() * 0.5 + 0.12) * 100),
    dSess: Math.round((d() * 0.5 + 0.18) * 100),
    dDur: Math.round((d() * 0.4 - 0.05) * 100),
    dBounce: Math.round(d() * 0.4 * 100),
    dUtil: Math.round((d() * 0.3 + 0.05) * 100),
    dStick: Math.round(d() * 0.3 * 100),
    dTrend: Math.round((d() * 0.4 + 0.06) * 100),
    dAct: Math.round((d() * 0.4 + 0.04) * 100),
  };
}

export function series(key: string, base: number, n: number, vol: number): number[] {
  const r = rngFor(key);
  const out: number[] = [];
  let v = base * (0.7 + r() * 0.2);
  for (let i = 0; i < n; i++) {
    v = Math.max(base * 0.25, v * (1 + (r() - 0.45) * vol));
    out.push(Math.round(v));
  }
  return out;
}

export function dayLabels(n: number): string[] {
  const out: string[] = [];
  const now = new Date(2026, 6, 3);
  for (let i = n - 1; i >= 0; i--) {
    const dd = new Date(now);
    dd.setDate(now.getDate() - i);
    out.push(`${dd.getMonth() + 1}/${dd.getDate()}`);
  }
  return out;
}

export interface TileSpec {
  id: string;
  label: string;
  disp: string;
  delta: number | null;
  goodUp: boolean;
  sub?: string;
  raw: number;
  unit?: string;
}

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
  liveKv: number;
  vpsKv: string;
}

export function buildTraffic(state: DashboardState, c: Core): TrafficData {
  const days = state.date;
  const lab = dayLabels(days > 30 ? 30 : days);
  const tiles: TileSpec[] = [
    { id: 'U1', label: 'Active Users (U1)', disp: fmtC(c.WAU), delta: c.dVis, goodUp: true, sub: 'weekly active', raw: c.WAU },
    { id: 'U2', label: 'Screen Views (U2)', disp: fmtC(c.views), delta: c.dViews, goodUp: true, sub: 'total', raw: c.views },
    { id: 'U3', label: 'Sessions (U3)', disp: fmtC(c.sessions), delta: c.dSess, goodUp: true, sub: 'in period', raw: c.sessions },
    { id: 'U5', label: 'Session Duration (U5)', disp: fmtDur(c.durSec), delta: c.dDur, goodUp: true, sub: 'average', raw: +(c.durSec / 60).toFixed(1), unit: 'min' },
    { id: 'U6', label: 'Bounce Rate (U6)', disp: pct(c.bounce), delta: c.dBounce, goodUp: false, sub: 'lower is better', raw: +(c.bounce * 100).toFixed(1), unit: '%' },
    { id: 'U8', label: 'Recently Online (U8)', disp: String(c.live), delta: null, goodUp: true, sub: 'active last 30 min', raw: c.live },
  ];

  const base = state.sessTab === 'visitors' ? c.WAU / 4 : state.sessTab === 'views' ? c.views / (days > 30 ? 30 : days) : c.sessions / (days > 30 ? 30 : days);
  const key = scopeKey(state);
  const cur = series(`${key}|${state.sessTab}`, base, lab.length, 0.5);
  const prev = series(`${key}|${state.sessTab}|p`, base * 0.82, lab.length, 0.5);

  const ds = c.desktopShare;
  const deviceRows: [string, number, string][] = [
    ['Desktop', state.dev === 'mobile' ? 0 : ds, 'var(--phg-blue)'],
    ['Mobile', state.dev === 'desktop' ? 0 : (1 - ds) * 0.86, 'var(--phg-orange)'],
    ['Tablet', state.dev === 'desktop' ? 0 : (1 - ds) * 0.14, 'var(--phg-green)'],
  ];

  return { tiles, chart: { measure: state.sessTab, cur, prev, labels: lab }, deviceRows, liveKv: c.live, vpsKv: c.vps.toFixed(1) };
}

export interface GrowthWeek { nw: number; ret: number; res: number; dorm: number }
export interface RoleShare { name: string; share: number; color: string }

export interface AdoptData {
  tiles: TileSpec[];
  trendChart: { cur: number[]; prev: number[]; labels: string[] };
  growthWeeks: GrowthWeek[];
  retentionCohorts: (number | null)[][];
  retentionRowLabels: string[];
  roleShares: RoleShare[];
  breadthKv: string;
  dormantKv: number;
  activationKv: string;
}

export function buildAdopt(state: DashboardState, c: Core): AdoptData {
  const key = scopeKey(state);
  const tiles: TileSpec[] = [
    { id: 'A1', label: 'Seat Utilisation (A1)', disp: pct(c.util), delta: c.dUtil, goodUp: true, sub: `${fmtC(c.WAU)} / ${c.S} seats`, raw: +(c.util * 100).toFixed(1), unit: '%' },
    { id: 'A2', label: 'Stickiness (A2)', disp: pct(c.stick), delta: c.dStick, goodUp: true, sub: 'DAU / MAU', raw: +(c.stick * 100).toFixed(1), unit: '%' },
    { id: 'A3', label: 'Adoption Trend (A3)', disp: `${c.dTrend > 0 ? '+' : ''}${c.dTrend}%`, delta: null, goodUp: true, sub: 'WAU vs 4 wks ago', raw: c.dTrend, unit: '%' },
    { id: 'A5', label: '14-Day Activation (A5)', disp: pct(c.activation), delta: c.dAct, goodUp: true, sub: 'of new joiners', raw: +(c.activation * 100).toFixed(1), unit: '%' },
    { id: 'A6', label: 'Module Breadth (A6)', disp: `${c.breadthUsed} / ${MODULES.length}`, delta: null, goodUp: true, sub: 'modules in use', raw: c.breadthUsed },
  ];

  const cur = series(`${key}|wau`, c.WAU, 8, 0.28);
  const prev = series(`${key}|waup`, c.WAU * 0.8, 8, 0.28);

  const gr = rngFor(`${key}|grw`);
  const growthWeeks: GrowthWeek[] = [];
  for (let i = 0; i < 6; i++) {
    growthWeeks.push({
      nw: Math.round(c.WAU * (0.05 + gr() * 0.09)),
      ret: Math.round(c.WAU * (0.5 + gr() * 0.2)),
      res: Math.round(c.WAU * (0.02 + gr() * 0.05)),
      dorm: Math.round(c.WAU * (0.05 + gr() * 0.1)),
    });
  }

  const { cohorts, rowLabels } = buildRetention(state);

  const roleShares: RoleShare[] = ROLES.map((role) => {
    const rr = rngFor(`${key}|role|${role.key}`);
    return { name: role.name, share: 0.35 + rr() * 0.55, color: role.color };
  });

  return {
    tiles,
    trendChart: { cur, prev, labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'] },
    growthWeeks,
    retentionCohorts: cohorts,
    retentionRowLabels: rowLabels,
    roleShares,
    breadthKv: `${c.breadthUsed} / ${MODULES.length}`,
    dormantKv: c.dormant,
    activationKv: pct(c.activation),
  };
}

function buildRetention(state: DashboardState): { cohorts: (number | null)[][]; rowLabels: string[] } {
  const r = rngFor(`${scopeKey(state)}|ret`);
  const rows = 6, cols = 8;
  const now = new Date(2026, 6, 3);
  const cohorts: (number | null)[][] = [];
  const rowLabels: string[] = [];
  for (let i = 0; i < rows; i++) {
    const dd = new Date(now);
    dd.setDate(now.getDate() - (rows - i) * 7);
    rowLabels.push(`${dd.getMonth() + 1}/${dd.getDate()}`);
    let base = 1;
    const curve: (number | null)[] = [];
    for (let w = 0; w < cols; w++) {
      if (w > cols - 1 - (rows - 1 - i)) { curve.push(null); continue; }
      let v: number;
      if (w === 0) v = 1; else { base = base * (0.55 + r() * 0.28); v = base; }
      curve.push(w === 0 ? 100 : Math.round(v * 100));
    }
    cohorts.push(curve);
  }
  return { cohorts, rowLabels };
}

export interface SiteHealthRow { name: string; region: string; util: number; trend: number; comp: number; drop: boolean }
export interface SiteHealthData { tierBadge: string; rows: SiteHealthRow[] }
export interface RegionRow { reg: string; sites: number; wau: number; util: number; trend: number }
export interface RegionData { rows: RegionRow[] }

export function buildSiteHealth(state: DashboardState, allSites: Site[]): SiteHealthData | null {
  if (state.tier === 't1' && state.scope !== 'all') return null;
  const sites = scopeSites(state, allSites);
  const rows: SiteHealthRow[] = sites
    .map((s) => {
      const rr = rngFor(`site|${s.id}|${state.date}`);
      const util = 0.42 + rr() * 0.5;
      const trend = Math.round((rr() * 2 - 1) * 30);
      const comp = 0.4 + rr() * 0.5;
      const drop = rr() < 0.22;
      return { name: s.name, region: s.region, util, trend, comp, drop };
    })
    .sort((a, b) => a.util - b.util);
  return { tierBadge: state.tier === 't1' ? 'Site Manager' : state.tier === 't2' ? 'Regional' : 'Management', rows };
}

export function buildRegion(state: DashboardState, allSites: Site[], regions: string[]): RegionData | null {
  if (!(state.tier === 't3' && state.scope === 'org')) return null;
  const rows: RegionRow[] = regions.map((reg) => {
    const rsites = allSites.filter((s) => s.region === reg);
    const rr = rngFor(`region|${reg}|${state.date}`);
    const util = 0.45 + rr() * 0.42;
    const wau = Math.round(seats(rsites) * util);
    const trend = Math.round((rr() * 2 - 1) * 24);
    return { reg, sites: rsites.length, util, wau, trend };
  });
  return { rows };
}

export interface FunnelData { flowLabel: string; steps: string[]; reaches: number[]; worst: number; worstDrop: number }
export interface FlowRow { label: string; flagship: boolean; adopt: number; comp: number; vol: number }
export interface PathRow { path: string; vis: number; vw: number; bo: number; dv: number; dw: number; db: number }

export interface FlowsData {
  modName: string;
  flagshipFunnelName: string;
  tiles: TileSpec[];
  funnel: FunnelData;
  flowRows: FlowRow[];
  pathRows: PathRow[];
}

export function buildFlows(state: DashboardState, c: Core): FlowsData {
  const mod = MODULES.find((m) => m.key === state.mod) ?? MODULES[0];
  const flagship = mod.flows.find((f) => f.flagship) ?? mod.flows[0];
  const key = scopeKey(state);
  const r = rngFor(`${key}|${mod.key}`);
  const adopt = 0.35 + r() * 0.5;
  const comp = 0.42 + r() * 0.45;
  const vol = Math.round(c.WAU * (0.6 + r() * 2.4) * dateFactor(state.date));
  const stepDrop = Math.round(15 + r() * 35);
  const dAdopt = Math.round((r() * 2 - 1) * 20);
  const dComp = Math.round((r() * 2 - 1) * 18);
  const dStep = Math.round((r() * 2 - 1) * 15);
  const dVol = Math.round((r() * 2 - 1) * 22);

  const tiles: TileSpec[] = [
    { id: 'F-adopt', label: 'Workflow Adoption (F-adopt)', disp: pct(adopt), delta: dAdopt, goodUp: true, sub: 'active users who start', raw: +(adopt * 100).toFixed(1), unit: '%' },
    { id: 'F-comp', label: 'Completion Rate (F-comp)', disp: pct(comp), delta: dComp, goodUp: true, sub: 'finish once started', raw: +(comp * 100).toFixed(1), unit: '%' },
    { id: 'F-step', label: 'Biggest Step Drop (F-step)', disp: `${stepDrop}%`, delta: dStep, goodUp: false, sub: 'at worst step', raw: stepDrop, unit: '%' },
    { id: 'F-vol', label: 'Usage Volume (F-vol)', disp: fmtC(vol), delta: dVol, goodUp: true, sub: 'runs in period', raw: vol },
  ];

  const steps = flagship.steps;
  const fr = rngFor(`${key}|${flagship.key}|f`);
  let reach = vol;
  const reaches = [reach];
  for (let i = 1; i < steps.length; i++) {
    reach = Math.round(reach * (0.62 + fr() * 0.3));
    reaches.push(reach);
  }
  let worst = 0, worstDrop = 0;
  for (let i = 1; i < reaches.length; i++) {
    const dpct = (reaches[i - 1] - reaches[i]) / reaches[i - 1];
    if (dpct > worstDrop) { worstDrop = dpct; worst = i; }
  }

  const flowRows: FlowRow[] = mod.flows.map((f) => {
    const rf = rngFor(`${key}|${f.key}`);
    return { label: f.label, flagship: !!f.flagship, adopt: 0.25 + rf() * 0.6, comp: 0.4 + rf() * 0.5, vol: Math.round(c.WAU * (0.4 + rf() * 2) * dateFactor(state.date)) };
  });

  const pathRows: PathRow[] = mod.paths.map((p) => {
    const rp = rngFor(`${key}|path|${p}`);
    const vis = Math.round(c.WAU * (0.1 + rp() * 0.7));
    const vw = Math.round(vis * (4 + rp() * 40));
    const bo = 0.02 + rp() * 0.7;
    return { path: p, vis, vw, bo, dv: Math.round((rp() * 2 - 1) * 30), dw: Math.round((rp() * 2 - 1) * 30), db: Math.round((rp() * 2 - 1) * 20) };
  });

  return {
    modName: `${mod.bucket ? mod.bucket + ' · ' : ''}${mod.name}`,
    flagshipFunnelName: `${flagship.label} funnel`,
    tiles,
    funnel: { flowLabel: flagship.label, steps, reaches, worst, worstDrop: Math.round(worstDrop * 100) },
    flowRows,
    pathRows,
  };
}
