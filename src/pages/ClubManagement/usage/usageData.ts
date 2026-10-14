/**
 * Club Management — Usage Dashboard data layer.
 *
 * DATA DISCLOSURE
 * ---------------
 * Club Management is an internal FM/society-staff back-office console (desktop-only
 * web app), not a resident-facing product. There is no confirmed user-identity
 * property anywhere in the instrumentation catalogue (no user_id / staff_id /
 * account_id / distinct_id on any event row), so every "Active Staff" and session
 * figure below stands on PostHog's auto-assigned distinct_id as a *proposed*,
 * unconfirmed join key.
 *
 * Every volume, rate and trend value here is deterministic illustrative sample data
 * (see rngFor / seeded arrays). Nothing is pulled from a live query. The MODULE
 * NAMES, BUCKET GROUPING and EVENT NAMES used in Workflow Usage are real, taken
 * verbatim from Club_Management_PostHog_Instrumentation.xlsx (156 custom events
 * across 16 modules; project_code "CM-01", project_id "P-238").
 *
 * This module is intentionally presentation-free so the sample data can be replaced
 * by a real API feed later without touching any component.
 */

/* ---------- seeded RNG (deterministic sample data) ---------- */
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

export function rngFor(key: string): () => number {
  return mulberry32(hashStr(key));
}

/* ---------- formatting helpers ---------- */
export function fmtC(n: number): string {
  if (n >= 100000) return Math.round(n / 1000) + "K";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(Math.round(n));
}

export function pct(x: number, d?: number): string {
  return x.toFixed(d == null ? 0 : d) + "%";
}

/* ---------- filters ---------- */
export interface UsageFilters {
  /** Window length in days (7 | 30 | 90) — or a computed length for a custom range. */
  range: number;
  rangeLabel: string;
  rangeSub?: string;
  rangeFrom: string;
  rangeTo: string;
  /** Overlay the previous comparable period on trend charts. */
  prev: boolean;
}

export const RANGE_LABELS: Record<number, string> = {
  7: "Last 7 days",
  30: "Last 30 days",
  90: "Last 90 days",
};

const today = new Date();
const defaultTo = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}-${`${today.getDate()}`.padStart(2, "0")}`;
const defaultFromDate = new Date(today);
defaultFromDate.setDate(defaultFromDate.getDate() - 29);
const defaultFrom = `${defaultFromDate.getFullYear()}-${`${defaultFromDate.getMonth() + 1}`.padStart(2, "0")}-${`${defaultFromDate.getDate()}`.padStart(2, "0")}`;

export const DEFAULT_FILTERS: UsageFilters = {
  range: 30,
  rangeLabel: "Last 30 days",
  rangeSub: "in the last 30 days",
  rangeFrom: defaultFrom,
  rangeTo: defaultTo,
  prev: true,
};

/**
 * Scales cumulative counts (sessions, screen views, completions) to the selected
 * window length relative to the 30-day baseline the seeded sample series were built
 * for. Rate/percentage metrics are window-independent and must NOT pass through this.
 */
export function rangeFactor(range: number): number {
  return range / 30;
}

export function seriesFor(base: number[]): number[] {
  return base.map((v) => Math.round(v));
}

export function prevSeries(base: number[], shrink: number): number[] {
  return base.map((v) => Math.round(v * shrink));
}

/* ---------- shared (illustrative) series ---------- */
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Illustrative smooth-growth curve so the "Usage over time" chart looks populated.
   A small internal back-office headcount — tens of active staff, not thousands. */
export const activeStaffBase = [24, 26, 27, 29, 30, 32, 33, 35, 36, 38, 39, 41];
export const sessionsBase = [310, 330, 345, 360, 378, 395, 410, 428, 445, 462, 478, 495];

/* Estimated total registered staff/admin account count for a single club back office. */
export const REGISTERED_STAFF = 60;

/* ---------- real modules — from Club_Management_PostHog_Instrumentation.xlsx ---------- */
export const modulesList: Array<[string, number]> = [
  ["Ticket / Helpdesk", 20],
  ["Community", 22],
  ["Membership", 13],
  ["Group Membership", 9],
  ["User Management / Staff (FM)", 18],
  ["User Management / Occupant", 22],
  ["User Management / Guest", 11],
  ["Invoice", 16],
  ["Amenities Booking", 15],
  ["Notices", 12],
  ["Events", 10],
  ["Credit Note", 9],
  ["Debit Note", 7],
  ["Payments", 14],
  ["Wallet", 5],
  ["Dashboard", 24],
];
export const TOTAL_MODULES = modulesList.length; // 16
export const TOTAL_EVENTS = 156;
export const TOTAL_PROJECT_CODE = "CM-01";
export const TOTAL_PROJECT_ID = "P-238";

/* ---------- KPI info dictionary (formula + business meaning) ---------- */
export interface KpiInfo {
  f: string;
  m: string;
}

export const KPI_INFO: Record<string, KpiInfo> = {
  "Active Staff": {
    f: "Distinct active-user count reported for the period.",
    m: "Device-based, not verified people; shared or multiple devices can skew counts.",
  },
  "Screen Views": {
    f: "Total screen or page views reported for the selected period.",
    m: "Repeated views are counted each time.",
  },
  "Sessions": {
    f: "Number of sessions reported for the selected period.",
    m: "This measures visit volume, not distinct staff.",
  },
  "Session Duration": {
    f: "Average session duration reported by the API.",
    m: "Displayed in minutes and seconds.",
  },
  "Bounce Rate": {
    f: "Percentage of sessions classified as bounces by the API.",
    m: "The endpoint's exact bounce criteria are not exposed in this dashboard.",
  },
  "Recently Active": {
    f: "Users reported active during the last 30 minutes.",
    m: "Identity deduplication rules are not specified by the API contract.",
  },
  "Seat Utilisation": {
    f: "Compares seats in use with the licensed seat total.",
    m: "Currently unavailable because this dashboard does not supply a licensed seat count.",
  },
  "Stickiness": {
    f: "API-reported stickiness; reference describes average DAU divided by MAU.",
    m: "The dashboard displays the API value.",
  },
  "Adoption Trend": {
    f: "Weekly active-user change versus four weeks earlier, as reported by the API.",
    m: "The dashboard does not recalculate it.",
  },
  "14-Day Activation": {
    f: "API-reported activation percentage among new joiners.",
    m: "The qualifying action and cohort rules are defined by the API.",
  },
  "Module Breadth": {
    f: "Modules reported in use out of the total modules reported.",
    m: "Shows usage breadth, not activity depth within each module.",
  },
  "Workflow Adoption (F-adopt)": {
    f: "API-reported adoption percentage for the selected module and sub-module.",
    m: "The eligible-user and workflow-start rules are defined by the API.",
  },
  "Completion Rate (F-comp)": {
    f: "API-reported completion percentage for the selected workflow scope.",
    m: "The completion and aggregation rules are defined by the API.",
  },
  "Biggest Step Drop (F-step)": {
    f: "API-reported drop at the workflow's largest step transition.",
    m: "The associated step is shown beneath the KPI.",
  },
  "Usage Volume (F-vol)": {
    f: "API-reported workflow usage volume.",
    m: "The unit is unverified: the local reference says runs, while the card says sessions.",
  },
};

export function kpiInfo(label: string): KpiInfo {
  return KPI_INFO[label] ?? {
    f: "Definition not yet finalized for this metric.",
    m: "Business meaning to be confirmed with product team.",
  };
}

/* ---------- chart palette (CSS custom properties — switches with the theme) ---------- */
export const CHART = {
  blue: "var(--chart-blue)",
  fill: "var(--chart-fill)",
  mint: "var(--chart-mint)",
  amber: "var(--chart-amber)",
  red: "var(--chart-red)",
  violet: "var(--chart-violet)",
  violetTint: "var(--chart-violet-tint)",
  green: "var(--green)",
  greenTint: "var(--green-tint)",
  grid: "var(--chart-grid)",
  line: "var(--chart-line)",
  faint: "var(--faint)",
  ink: "var(--ink)",
  heat: "var(--heat-rgb)",
} as const;

/* ---------- workflows (real event names; illustrative figures) ---------- */
export interface WorkflowDef {
  key: string;
  name: string;
  bucket: string;
  steps: string[];
  adoption: number;
  completionRate: number;
  dropoffRate: number;
  avgTime: string;
  completions: string;
  incompleteNote: string;
}

export const workflows: WorkflowDef[] = [
  {
    key: "ticketCreate",
    name: "Ticket Creation & Resolution",
    bucket: "Ticket Lifecycle",
    steps: [
      "Activity — Ticket Create Form Opened",
      "Ticket Created",
      "Ticket Status Changed",
      "Ticket Resolution Recorded",
    ],
    adoption: 58,
    completionRate: 71,
    dropoffRate: 29,
    avgTime: "3h 20m",
    completions: "1,140",
    incompleteNote:
      "The catalogue also fires Activity — ticket abandoned as a real, documented drop-off/failure branch off the create step (alongside the success path's Activity — ticket creation successful) — it is a genuine exit point from this funnel, not a 5th linear step, so it is not drawn as a funnel stage but is counted into the Drop-off Rate above. The Ticket / Helpdesk sheet has NO Trigger Condition text at all for any of its 20 events (every cell is genuinely blank in the source spreadsheet) — a real, confirmed catalogue gap, not a parsing error.",
  },
  {
    key: "ticketReopen",
    name: "Ticket Reopened",
    bucket: "Ticket Lifecycle",
    steps: ["Ticket Reopened"],
    adoption: 9,
    completionRate: 100,
    dropoffRate: 0,
    avgTime: "—",
    completions: "86",
    incompleteNote:
      "This is deliberately a thin, single-event signal, not a multi-step funnel: Ticket Reopened (reopen_count, days_since_closure, reopened_by_role) fires once, as a recurrence flag on a ticket that was already resolved via the Ticket Creation & Resolution flow above — there is no preceding reopen attempted or following reopen confirmed event in the catalogue to chain it with. It is charted here as its own workflow only because it is operationally important (a resolved ticket coming back is a quality signal FM leadership will want to watch), not because it is structurally a funnel — Adoption/Completion/Drop-off above are not meaningful in the usual sense for a single-event signal like this one.",
  },
  {
    key: "invoicePayment",
    name: "Invoice → Payment Recorded",
    bucket: "Financial Documents",
    steps: ["Invoice Created", "Invoice Viewed", "Invoice Status Changed"],
    adoption: 64,
    completionRate: 82,
    dropoffRate: 18,
    avgTime: "1d 4h",
    completions: "980",
    incompleteNote:
      'The terminal step is the Invoice Status Changed event fired with action: "payment_recorded" — the same event name also fires for two other, unrelated triggers in the Invoice sheet (action: "toggle_active" and action: "bulk_status_update"); only the payment_recorded variant is counted as this funnel\'s completion.',
  },
  {
    key: "creditNoteCreate",
    name: "Credit Note Creation",
    bucket: "Financial Documents",
    steps: ["Credit Note Created", "Credit Note Viewed"],
    adoption: 22,
    completionRate: 88,
    dropoffRate: 12,
    avgTime: "14m",
    completions: "310",
    incompleteNote:
      "Debit Note is a structurally identical parallel module in the catalogue — its 8 events (Debit Note List Viewed, Created, Updated, Viewed, Deleted ×2, Exported, Search Performed) mirror Credit Note's 8 events one-for-one, including the same trigger conditions. Only Credit Note is charted here as the representative of both, to avoid double-counting two near-duplicate modules as if they were separate workflows; Debit Note appears in Module Breadth and the module league table below, just not as its own Workflow Usage bucket.",
  },
  {
    key: "membershipCreate",
    name: "Membership Creation",
    bucket: "Membership & Access",
    steps: ["Membership Created", "Membership Viewed", "Membership Status Changed"],
    adoption: 37,
    completionRate: 76,
    dropoffRate: 24,
    avgTime: "22m",
    completions: "420",
    incompleteNote:
      "Membership Status Changed fires from two different trigger points in the Memberships sheet (a list-level active/inactive toggle, and a status-field edit on the detail page) — both are counted as reaching this funnel's terminal step.",
  },
  {
    key: "groupMembershipPayment",
    name: "Group Membership Payment",
    bucket: "Membership & Access",
    steps: [
      "Group Membership Created",
      "Group Membership Payment Requested",
      "Group Membership Invoice Sent",
    ],
    adoption: 14,
    completionRate: 69,
    dropoffRate: 31,
    avgTime: "2d 6h",
    completions: "96",
    incompleteNote:
      'A distinct, richer multi-step flow than plain Membership\'s create→view→status: Group Membership carries its own payment-request step (multipart submit with bill_id/payment_mode) and its own invoice-send step (which fires twice in the sheet under slightly different trigger conditions — a bare send and a "with bill" send — both counted as reaching this funnel\'s terminal step here).',
  },
];

export function workflowBuckets(): string[] {
  return [...new Set(workflows.map((w) => w.bucket))];
}

export function workflowInBucket(bucket: string): WorkflowDef[] {
  return workflows.filter((w) => w.bucket === bucket);
}
