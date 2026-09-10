import type { CalendarTileSpec } from './calendarMetricIds';
import type { Device } from './constants';

/**
 * Calendar App dashboard — the wireframe's own sample-data engine, ported from
 * `Calendar_Dashboard_v1_FM_structure.html`.
 *
 * This dashboard is a WIREFRAME, not a live report. Every number below is illustrative
 * sample data produced by a seeded RNG, exactly as the reference does it: the same key
 * always yields the same numbers, so the page is stable across renders and recomputes only
 * when a filter changes. Nothing here calls an API.
 *
 * What IS real, and taken verbatim from the reference (which takes it from
 * `Calendar_App_PostHog_Events.xlsx` — 83 events across 16 categories, one flat sheet):
 * the module names, the workflow names and their ordered step event names, and the scope
 * notes recording what each catalogue entry does and does not cover.
 *
 * Read every figure as "what this card will look like", never as "what usage was".
 */

/* ------------------------------------------------------------------ seeded RNG */

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic generator for a given key — same key, same series, every time. */
const rngFor = (key: string) => mulberry32(hashStr(key));

/* ------------------------------------------------------------------ constants */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ACTIVE_USERS_BASE = [3400, 3560, 3690, 3820, 3960, 4100, 4250, 4400, 4560, 4720, 4880, 5040];
const SESSIONS_BASE = [14200, 14780, 15340, 15920, 16510, 17110, 17720, 18340, 18970, 19610, 20260, 20920];

/**
 * ILLUSTRATIVE ceiling — an estimated total registered-account count, not a confirmed
 * figure; the catalogue carries no aggregate account-count field. The Active Users line is
 * scaled against it.
 */
const REGISTERED_ACCOUNTS = 9200;

/** Connected-calendar providers. Placeholder labels: the `provider` property is real, its value set is not documented. */
export const PROVIDERS = ['Google', 'Outlook', 'iCloud', 'Exchange'];

/** 16 real catalogue categories, mapped 1:1 to modules. Reach % beside each is illustrative. */
export const MODULES_LIST: [string, number][] = [
  ['App Lifecycle & Diagnostics', 100],
  ['Authentication', 91],
  ['Calendar Accounts', 54],
  ['Calendar Home', 96],
  ['Events — Create / Edit / Detail', 88],
  ['Add People', 33],
  ['Booking Slots (Customise Slot)', 17],
  ['Location Search', 21],
  ['Propose Time', 14],
  ['To-Do', 38],
  ['Settings', 61],
  ['Sync', 46],
  ['Analytics Screen', 19],
  ['Reminders / Notifications', 57],
  ['Assistant — Chat', 24],
  ['Assistant — Voice', 13],
];

export const TOTAL_MODULES = MODULES_LIST.length;

/** 83 events across 16 categories — one flat catalogue, no modern/legacy split. */
export const TOTAL_REAL_EVENTS = 83;

/* ------------------------------------------------------------------ scaling */

/** iOS/Android are a share of the whole, so a platform filter scales every count down. */
const devFactor = (dev: Device) => (dev === 'ios' ? 0.58 : dev === 'android' ? 0.42 : 1);

/**
 * Scales cumulative counts (sessions, views, completions) to the selected window, relative
 * to the 30-day baseline the seeded series were built for. Rates and durations are
 * window-independent and must NOT be passed through this.
 */
const rangeFactor = (rangeDays: number) => rangeDays / 30;

const seriesForDev = (base: number[], dev: Device) => base.map((v) => Math.round(v * devFactor(dev)));
const prevSeries = (base: number[], shrink: number, dev: Device) =>
  base.map((v) => Math.round(v * shrink * devFactor(dev)));

/** Compact count — 1.2K, 34K. */
export const fmtCount = (n: number) => {
  if (n >= 100000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(Math.round(n));
};

/* ------------------------------------------------------------------ tiles */

interface TileInput {
  id: string;
  label: string;
  disp: string;
  delta?: number | null;
  deltaText?: string;
  sub?: string;
  raw?: number;
  unit?: string;
  goodUp?: boolean;
  noTarget?: boolean;
}

const tile = (t: TileInput): CalendarTileSpec => ({
  id: t.id,
  label: t.label,
  disp: t.disp,
  delta: t.delta ?? null,
  deltaText: t.deltaText,
  sub: t.sub,
  raw: t.raw ?? 0,
  unit: t.unit,
  goodUp: t.goodUp ?? true,
  noTarget: t.noTarget,
  infoKey: t.id,
  infoLabel: t.label,
});

/* ------------------------------------------------------------------ 1 · traffic */

export interface UsageSeries {
  labels: string[];
  cur: number[];
  prev: number[];
}

export interface TrafficSample {
  tiles: CalendarTileSpec[];
  users: UsageSeries;
  views: UsageSeries;
  sessions: UsageSeries;
  /** iOS / Android share of active users. */
  platformRows: { label: string; share: number }[];
  viewsPerSession: string;
}

export function buildTraffic(dev: Device, rangeDays: number): TrafficSample {
  const activeUsers = seriesForDev(ACTIVE_USERS_BASE, dev);
  const sessionsSeries = seriesForDev(SESSIONS_BASE, dev);
  const rf = rangeFactor(rangeDays);

  const curActive = Math.min(
    Math.round(activeUsers[activeUsers.length - 1] * Math.min(rf, 1.6)),
    Math.round(REGISTERED_ACCOUNTS * 0.92),
  );
  const curSessions = Math.round(sessionsSeries[sessionsSeries.length - 1] * rf);
  const views = Math.round(curSessions * 4.07);
  const recentlyOnline = Math.round(curActive * 0.021);

  // The platform toggle picks one side of the split outright; "all" shows the real 59/41.
  const iosBase = 0.59;
  const ios = dev === 'android' ? 0 : dev === 'ios' ? 1 : iosBase;

  return {
    tiles: [
      tile({ id: 'activeUsers', label: 'Active Users', disp: curActive.toLocaleString(), delta: 5.8, sub: 'unique users this period', raw: curActive }),
      tile({ id: 'screenViews', label: 'Screen Views', disp: fmtCount(views), delta: 4.6, sub: 'total across modules', raw: views, noTarget: true }),
      tile({ id: 'totalSessions', label: 'Sessions', disp: curSessions.toLocaleString(), delta: 4.1, sub: 'app sessions started', raw: curSessions, noTarget: true }),
      tile({ id: 'avgSessionDur', label: 'Session Duration', disp: '4m 02s', deltaText: '▲ 16s', sub: 'per session', raw: 4.03, noTarget: true }),
      tile({ id: 'bounceRate', label: 'Bounce Rate', disp: '22%', delta: -1.3, sub: 'lower is better', raw: 22, unit: '%', goodUp: false }),
      tile({ id: 'recentlyOnline', label: 'Recently Online', disp: recentlyOnline.toLocaleString(), sub: 'active in last 30 min', noTarget: true }),
    ],
    users: { labels: MONTHS, cur: activeUsers, prev: prevSeries(ACTIVE_USERS_BASE, 0.9, dev) },
    views: {
      labels: MONTHS,
      cur: activeUsers.map((v) => Math.round(v * 4.07)),
      prev: prevSeries(ACTIVE_USERS_BASE.map((v) => v * 4.07), 0.9, dev),
    },
    sessions: { labels: MONTHS, cur: sessionsSeries, prev: prevSeries(SESSIONS_BASE, 0.92, dev) },
    platformRows: [
      { label: 'iOS', share: ios },
      { label: 'Android', share: 1 - ios },
    ],
    viewsPerSession: (views / curSessions).toFixed(1),
  };
}

/* ------------------------------------------------------------------ 2 · adoption */

export interface GrowthWeek {
  label: string;
  nw: number;
  ret: number;
  res: number;
  dorm: number;
}

export interface AdoptionSample {
  tiles: CalendarTileSpec[];
  trend: { labels: string[]; values: number[] };
  growth: GrowthWeek[];
  /** Cohort grid — null cells are weeks the cohort has not reached yet. */
  retention: { labels: string[]; rows: (number | null)[][]; weeks: number };
  /** Share of event_created by item type. */
  itemTypes: { label: string; share: number }[];
  secondaryFeatures: { feature: string; event: string; note: string; users: number }[];
  dormantUsers: number;
  providers: {
    provider: string;
    active: number;
    sessions: number;
    avgSession: string;
    bounce: number;
    trend: 'up' | 'dn' | 'flat';
  }[];
}

export function buildAdoption(dev: Device, rangeDays: number): AdoptionSample {
  const r = rngFor(`adoptTiles|${dev}`);
  const activeUsers = seriesForDev(ACTIVE_USERS_BASE, dev);
  const rf = rangeFactor(rangeDays);
  const curActive = Math.min(
    Math.round(activeUsers[activeUsers.length - 1] * Math.min(rf, 1.6)),
    Math.round(REGISTERED_ACCOUNTS * 0.92),
  );

  const seatUtil = curActive / REGISTERED_ACCOUNTS;
  const stickiness = 0.34 + r() * 0.08;
  const adoptionTrend = Math.round(4 + r() * 6);
  const activation14 = Math.round(52 + r() * 10);
  /** ILLUSTRATIVE — sample count of the 16 tracked modules touched at least once. */
  const usedModules = 11;

  const trendR = rngFor(`adoptTrendChart|${dev}`);
  const trendWeeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  const trendBase = curActive * 0.62;

  const growthR = rngFor(`growth|${dev}`);
  const growthBase = 250 * devFactor(dev);
  const growth = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((label) => ({
    label,
    nw: Math.round(growthBase * (0.05 + growthR() * 0.06)),
    ret: Math.round(growthBase * (0.55 + growthR() * 0.15)),
    res: Math.round(growthBase * (0.03 + growthR() * 0.04)),
    dorm: Math.round(growthBase * (0.06 + growthR() * 0.08)),
  }));

  const secondaryR = rngFor(`secondaryFeatures|${dev}`);
  const secondary: [string, string, string, number][] = [
    ['Add People', 'add_people_confirmed', 'invitee_count on confirm', 0.1 + secondaryR() * 0.03],
    ['Booking Slots', 'booking_slot_saved', 'Customise Slot screen', 0.05 + secondaryR() * 0.02],
    ['Location Search', 'location_selected', 'no address/PII logged', 0.06 + secondaryR() * 0.02],
    ['Propose Time', 'propose_time_sent', 'availability slot(s) sent', 0.04 + secondaryR() * 0.015],
    ['Assistant Voice', 'assistant_voice_call_ended', 'funnel-completion event', 0.035 + secondaryR() * 0.015],
  ];

  const dormantR = rngFor(`dormant|${dev}`);

  return {
    tiles: [
      tile({ id: 'seatUtil', label: 'Account Utilisation', disp: `${Math.round(seatUtil * 100)}%`, delta: 2.1, sub: 'active ÷ registered accounts', raw: seatUtil * 100, unit: '%' }),
      tile({ id: 'stickiness', label: 'Stickiness', disp: `${Math.round(stickiness * 100)}%`, delta: 1.2, sub: 'avg DAU/MAU', raw: stickiness * 100, unit: '%' }),
      tile({ id: 'adoptionTrend', label: 'Adoption Trend', disp: `+${adoptionTrend}%`, deltaText: '▲ vs prior 8 weeks', sub: 'weekly active users', noTarget: true }),
      tile({ id: 'activation14', label: '14-Day Activation', disp: `${activation14}%`, delta: 1.8, sub: 'of new users who created an event', raw: activation14, unit: '%' }),
      tile({ id: 'moduleBreadth2', label: 'Module Breadth', disp: `${usedModules} / ${TOTAL_MODULES}`, sub: 'modules used this period', noTarget: true }),
    ],
    trend: {
      labels: trendWeeks,
      values: trendWeeks.map((_, i) => Math.round(trendBase * (0.88 + i * 0.018) * (0.97 + trendR() * 0.06))),
    },
    growth,
    retention: buildRetention(dev),
    itemTypes: [
      { label: 'Event', share: 0.61 },
      { label: 'Task', share: 0.27 },
      { label: 'Reminder', share: 0.12 },
    ],
    secondaryFeatures: secondary.map(([feature, event, note, share]) => ({
      feature,
      event,
      note,
      users: Math.round(REGISTERED_ACCOUNTS * share),
    })),
    dormantUsers: Math.round(320 + dormantR() * 540),
    providers: PROVIDERS.map((provider) => {
      const pr = rngFor(`sitewise|${provider}|${dev}`);
      const active = Math.round((180 + pr() * 1120) * devFactor(dev));
      return {
        provider,
        active,
        sessions: Math.round(active * (2.6 + pr() * 1.4)),
        avgSession: `${(2.0 + pr() * 1.6).toFixed(1)}m`,
        bounce: Math.round(10 + pr() * 16),
        trend: (pr() > 0.35 ? 'up' : pr() > 0.15 ? 'flat' : 'dn') as 'up' | 'dn' | 'flat',
      };
    }).sort((a, b) => b.active - a.active),
  };
}

/** Six weekly cohorts, each one week shorter than the one above it. */
function buildRetention(dev: Device) {
  const labels = ['5/22', '5/29', '6/5', '6/12', '6/19', '6/26'];
  const weeks = 6;
  const rows = labels.map((label, i) => {
    const rr = rngFor(`cohort|${label}|${dev}`);
    let base = 1;
    return Array.from({ length: weeks }, (_, w) => {
      // The newest cohort has only reached week 0; each older one has one more week of life.
      if (w > weeks - 1 - (labels.length - 1 - i)) return null;
      if (w === 0) return 100;
      base = base * (0.6 + rr() * 0.28);
      return Math.round(base * 100);
    });
  });
  return { labels, rows, weeks };
}

/* ------------------------------------------------------------------ 3 · workflows */

export interface CalendarWorkflow {
  key: string;
  name: string;
  bucket: string;
  /** Real catalogue event names, in funnel order. */
  steps: string[];
  adoption: number;
  completionRate: number;
  dropoffRate: number;
  avgTime: string;
  completions: number;
  /** What the catalogue itself records about this funnel's edges and omissions. */
  incompleteNote?: string;
}

export const CALENDAR_WORKFLOWS: CalendarWorkflow[] = [
  {
    key: 'login',
    name: 'Login',
    bucket: 'Identity & Access',
    steps: ['login_attempted', 'login_success'],
    adoption: 74,
    completionRate: 92,
    dropoffRate: 8,
    avgTime: '6s',
    completions: 2860,
    incompleteNote:
      'login_failed{reason} is the real failure branch for this funnel — a rejected sign-in attempt, not counted toward login_success. password_visibility_toggled and forgot_password_link_tapped are real events on the same screen but are secondary UI interactions, not funnel steps.',
  },
  {
    key: 'passwordReset',
    name: 'Password Reset',
    bucket: 'Identity & Access',
    steps: ['forgot_password_link_tapped', 'password_reset_otp_requested', 'password_reset_completed'],
    adoption: 9,
    completionRate: 71,
    dropoffRate: 29,
    avgTime: '1m 10s',
    completions: 186,
  },
  {
    key: 'signOut',
    name: 'Sign Out',
    bucket: 'Identity & Access',
    steps: ['settings_sign_out_requested', 'settings_sign_out_confirmed', 'logout_success'],
    adoption: 6,
    completionRate: 88,
    dropoffRate: 12,
    avgTime: '4s',
    completions: 142,
    incompleteNote:
      'settings_sign_out_cancelled is the real drop-off branch — the user opened the confirm dialog and backed out. settings_sign_out_confirmed only triggers the actual logout call; logout_success is a separate event and the true terminal step of this funnel, tracked on its own per the catalogue.',
  },
  {
    key: 'accountConnect',
    name: 'Connect Calendar Account',
    bucket: 'Calendar Setup',
    steps: ['calendar_connect_prompt_accepted', 'calendar_account_connected'],
    adoption: 41,
    completionRate: 79,
    dropoffRate: 21,
    avgTime: '18s',
    completions: 1340,
    incompleteNote:
      'calendar_connect_prompt_dismissed ("Not now") and oauth_cancelled (backing out of the OAuth web view before completing) are the two real drop-off signals for this funnel — oauth_cancelled is explicitly documented as a drop-off signal for the connect flow. provider on calendar_account_connected/_disconnected (Google/Outlook/etc) is the real property behind the Provider filter and the Provider-wise breakdown table.',
  },
  {
    key: 'eventCreate',
    name: 'Create Event',
    bucket: 'Event Management',
    steps: [
      'calendar_fab_tapped',
      'event_create_type_selected',
      'event_create_field_tapped',
      'event_create_duration_selected',
      'event_create_colour_selected',
      'event_created',
    ],
    adoption: 63,
    completionRate: 81,
    dropoffRate: 19,
    avgTime: '52s',
    completions: 4920,
    incompleteNote:
      'This is the one funnel this dashboard gives full multi-step depth, per an explicit product decision. The real "Events — Create / Edit / Detail" category has 19 events; this funnel shows 6 checkpoints — fab tap, type choice, a representative field interaction, duration and colour pickers, and the real terminal outcome — rather than every field-level event (event_create_field_tapped{field} alone covers people/location/date/time/task-estimate/reminder-offset, one event with six possible field values, not six separate steps). event_create_failed{reason} is the real failure branch. Add People, Location Search, Booking Slots and Propose Time can each be launched mid-flow from this funnel\'s field-tap step, but are tracked as their own reach cards (see the Secondary Feature Reach card) rather than folded into this funnel\'s steps.',
  },
  {
    key: 'eventEditDelete',
    name: 'Edit / Delete Event',
    bucket: 'Event Management',
    steps: ['event_menu_opened', 'event_menu_action_selected', 'event_deleted'],
    adoption: 22,
    completionRate: 68,
    dropoffRate: 32,
    avgTime: '11s',
    completions: 1080,
    incompleteNote:
      'event_menu_action_selected{action} covers every overflow-menu choice (e.g. delete, duplicate, share) in one event, not one event per action — this funnel follows only the delete path through to event_deleted (or event_delete_failed{reason} as the failure branch). event_updated{via} (drag-reschedule or detail-screen edit) and event_complete_toggled are real, separate Action events on the same screen, tracked outside this funnel.',
  },
];

export const findWorkflow = (key: string): CalendarWorkflow =>
  CALENDAR_WORKFLOWS.find((w) => w.key === key) ?? CALENDAR_WORKFLOWS[0];

export interface WorkflowSample {
  workflow: CalendarWorkflow;
  tiles: CalendarTileSpec[];
  funnel: { step: string; ofEntrants: number; dropPct: number | null }[];
  screens: { screen: string; users: number; events: number; sessions: number; completion: number }[];
  entryRows: { event: string; sessions: number; views: number; build: string }[];
}

export function buildWorkflow(key: string, dev: Device): WorkflowSample {
  const w = findWorkflow(key);
  const n = w.steps.length;

  // One generator drives both the funnel bars and the "biggest drop" tile, so the tile
  // always names a step the funnel below actually shows falling that far.
  const dropsR = rngFor(`funnel|${w.key}`);
  const drops = w.steps.map((_, i) => (i === 0 ? null : Math.round((n - i) * 3 + dropsR() * 8)));
  const biggest = drops.reduce<{ step: string; pct: number }>(
    (acc, d, i) => (d != null && d > acc.pct ? { step: w.steps[i], pct: d } : acc),
    { step: w.steps[Math.min(1, n - 1)], pct: 0 },
  );

  const screensR = rngFor(`allscreens|${w.key}`);

  return {
    workflow: w,
    tiles: [
      tile({ id: 'wfAdoption', label: 'Workflow Adoption', disp: `${w.adoption}%`, deltaText: w.adoption >= 45 ? '▲ improving' : '— stable', raw: w.adoption, unit: '%' }),
      tile({ id: 'wfCompletion', label: 'Completion Rate', disp: `${w.completionRate}%`, deltaText: w.completionRate >= 55 ? '▲ improving' : '▼ needs attention', raw: w.completionRate, unit: '%' }),
      tile({ id: 'wfStepDrop', label: 'Biggest Step Drop', disp: `${biggest.pct}%`, deltaText: `▼ ${biggest.step}`, sub: `at ${biggest.step}`, noTarget: true }),
      tile({ id: 'wfVolume', label: 'Usage Volume', disp: w.completions.toLocaleString(), deltaText: '▲ this period', sub: 'completions', noTarget: true }),
    ],
    funnel: w.steps.map((step, i) => ({
      step,
      // Entrants are 100% and the last step keeps 45% of them, spread evenly between.
      ofEntrants: Math.round(100 - i * ((100 * 0.55) / (n - 1 || 1))),
      dropPct: drops[i],
    })),
    screens: w.steps.map((screen, i) => {
      const users = Math.round(w.completions * (1 - i * 0.12) * (0.9 + screensR() * 0.2));
      return {
        screen,
        users,
        events: Math.round(users * (1.1 + screensR() * 0.6)),
        sessions: Math.round(users * (0.85 + screensR() * 0.1)),
        completion: Math.max(8, Math.round(w.completionRate + (n - 1 - i) * 4 - screensR() * 6)),
      };
    }),
    // app_launched is the confirmed first event of every session; app_launch_diagnostic is
    // documented as debug-only ("Never fires in release builds"), so it shows a true zero.
    entryRows: [
      { event: 'app_launched', sessions: Math.round(100 * 120 * devFactor(dev)), views: Math.round(100 * 120 * devFactor(dev) * 1.8), build: 'All builds' },
      { event: 'app_launch_diagnostic', sessions: 0, views: 0, build: 'Debug only' },
    ],
  };
}
