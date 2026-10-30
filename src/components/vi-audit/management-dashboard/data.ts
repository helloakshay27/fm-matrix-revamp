/** Vi My Workspace brand colour card. */
export const C = {
  crimson: "#EE2737",
  mustard: "#FFC400",
  aubergine: "#5A084B",
  slate: "#2F3043",
  terracotta: "#FF8F6B",
  sky: "#CADEF8",
  sand: "#F3E8D1",
  white: "#FFFFFF",
  terra: "#FF8F6B",
  sage: "#2F3043",
  teal: "#5A084B",
  lav: "#5A084B",
  blue: "#2F3043",
  ok: "#5A084B",
  warn: "#FFC400",
  err: "#EE2737",
  border: "#E6D7BE",
  dark: "#2F3043",
  vi: "#EE2737",
  draft: "#FFC400",
  closed: "#5A084B",
  spoc: "#FF8F6B",
  ao: "#FFC400",
} as const;

export const fmt = (n: number) => Number(n).toLocaleString("en-IN");

export const CIRCLES = [
  "Maharashtra & Goa",
  "Tamil Nadu",
  "Karnataka",
  "UP East",
  "UP West",
  "Andhra Pradesh",
  "Delhi NCR",
  "Kolkata",
  "Bihar",
  "Assam",
  "NESA",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "MP & Chhattisgarh",
  "Punjab",
  "Haryana",
  "Odisha",
  "J&K",
  "HP",
  "Telangana",
  "Chennai",
];

export const FILTER_CIRCLES = [
  "All Circles",
  "Maharashtra & Goa",
  "Tamil Nadu",
  "Karnataka",
  "UP East",
  "UP West",
  "Andhra Pradesh",
  "Bihar",
  "Kolkata",
  "Haryana",
  "Punjab",
];

export const FUNCTIONS = [
  "Sales",
  "Sales & Distribution",
  "Technology",
  "Postpaid",
  "Customer Service",
  "Finance",
  "HR",
];

export const ZONES = ["All Zones", "Worli", "Andheri", "Thane", "Pune", "Nashik", "Nagpur"];
export const AUDIT_TYPES = ["Corporate & Circle", "Corporate", "Circle"];
export const AUDITORS = ["Sohail Ansari", "Neha Kapoor", "Rahul Verma", "Priya Nair", "Imran Sheikh", "Anita Desai"];
export const ACTION_OWNERS = ["Vama Shah", "Rohit Patil", "Sneha Kulkarni", "Arjun Menon", "Pooja Singh"];
export const LOCS = ["Worli", "Andheri", "Thane", "Pune", "Nashik", "Nagpur"];

export type Persona = "admin" | "circle";
export type ModuleKey = "audit" | "mydashboard";
export type ChartKind = "donut" | "bar" | "line" | "table";

export interface Scope {
  title: string;
  scope: string;
  role: string;
  k: number[];
}

export const SCOPES: Record<Persona, Scope> = {
  admin: {
    title: "Audit · Pan India View",
    scope: "880 audits and 3,412 observations across 22 circles",
    role: "Pan India",
    k: [880, 109, 312, 459, 3412, 365, 3047, 3047, 1208, 1839],
  },
  circle: {
    title: "Audit · Maharashtra & Goa Circle",
    scope: "74 audits and 286 observations · 12 clusters · 84 work locations",
    role: "Circle Manager",
    k: [74, 9, 26, 39, 286, 31, 255, 255, 101, 154],
  },
};

export interface KpiConfig {
  id: string;
  label: string;
  group: string;
  panel: string;
  section: string;
  color: string;
  tint: string;
  icon: string;
  info: string;
}

export const INFO = {
  total: "Every audit record created, including drafts · Draft + Open + Closed.",
  draft: "Audits the Auditor saved with Save draft and has not submitted.",
  open: "Submitted audits that still have at least one observation not Closed By Action Owner.",
  closed: "Audits with status Closed. The rule that moves an audit to Closed is not defined in the design and needs confirmation.",
  obs: "All observations on submitted audits.",
  spoc: "Observations with status Pending By SPOC · no action plan created yet (CAPA plan not started).",
  started: "Observations with at least one corrective or preventive plan created by the SPOC.",
  actions: "All actions raised on observations · Pending By Action Owner + Closed By Action Owner.",
  ao: "Observations with status Pending By Action Owner · plan created, action taken not yet recorded.",
  closedao: "Observations with status Closed By Action Owner.",
  heatmap: "% complete for each stage per circle. Sky ≥90%, Terracotta 80–90%, Mustard 70–80%, Crimson <70%. On-time, Extended CAPA and Delayed CAPA are proposed measures based on Target Date and Extend Target Date.",
  followup: "Circles ranked by the average of the five heatmap stages, lowest first.",
  aging: "Days from observation submission to today, for observations still Pending By SPOC. Proposed measure.",
  overdue: "Pending plans where today is later than the Target Date. Proposed measure.",
  ext: "Plans where an Extend Target Date was entered. Proposed measure.",
  dir: "Every audit with its observation and action progress. Click a row for the full drill-down.",
} as const;

export const KPI_CONFIG: KpiConfig[] = [
  { id: "kpi-total", label: "Total Audits", group: "audits", panel: "acc-audits", section: "Audits", color: "var(--terracotta)", tint: "rgba(255,143,107,.16)", icon: "M9 11l3 3L22 4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", info: INFO.total },
  { id: "kpi-draft", label: "Draft Audits", group: "audits", panel: "acc-audits", section: "Audits", color: "var(--mustard)", tint: "rgba(255,196,0,.28)", icon: "M12 20h9|M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z", info: INFO.draft },
  { id: "kpi-open", label: "Open Audits", group: "audits", panel: "acc-audits", section: "Audits", color: "var(--crimson)", tint: "rgba(238,39,55,.10)", icon: "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z", info: INFO.open },
  { id: "kpi-closed", label: "Closed Audits", group: "audits", panel: "acc-audits", section: "Audits", color: "var(--aubergine)", tint: "rgba(90,8,75,.10)", icon: "M22 11.08V12a10 10 0 11-5.93-9.14|M22 4L12 14.01l-3-3", info: INFO.closed },
  { id: "kpi-obs", label: "Total Observations", group: "obs", panel: "acc-obs", section: "Observations", color: "var(--slate)", tint: "rgba(47,48,67,.08)", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6", info: INFO.obs },
  { id: "kpi-spoc", label: "Pending Action Plan by SPOC", group: "capa", panel: "acc-capa", section: "CAPA", color: "var(--crimson)", tint: "rgba(238,39,55,.10)", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M9 11a4 4 0 100-8 4 4 0 000 8z", info: INFO.spoc },
  { id: "kpi-started", label: "CAPA Plan Started", group: "capa", panel: "acc-capa", section: "CAPA", color: "var(--terracotta)", tint: "rgba(255,143,107,.16)", icon: "M5 12h14|M12 5l7 7-7 7", info: INFO.started },
  { id: "kpi-actions", label: "Total Actions", group: "capa", panel: "acc-capa", section: "CAPA", color: "var(--slate)", tint: "rgba(47,48,67,.08)", icon: "M9 11l3 3L22 4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", info: INFO.actions },
  { id: "kpi-ao", label: "Action Pending by Action Owner", group: "capa", panel: "acc-capa", section: "CAPA", color: "var(--mustard)", tint: "rgba(255,196,0,.28)", icon: "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z", info: INFO.ao },
  { id: "kpi-closedao", label: "Action Taken / Closed by Action Owner", group: "capa", panel: "acc-capa", section: "CAPA", color: "var(--aubergine)", tint: "rgba(90,8,75,.10)", icon: "M9 12l2 2 4-4|M12 22a10 10 0 100-20 10 10 0 000 20z", info: INFO.closedao },
];

export interface AuditRow {
  id: string;
  type: string;
  circle: string;
  loc: string;
  loc2: string;
  auditor: string;
  date: string;
  obs: number;
  closed: number;
  status: "Closed" | "Open" | "Draft";
  spocP: number;
}

const STAT: AuditRow["status"][] = ["Closed", "Open", "Draft", "Open", "Closed", "Closed"];

export const AUDITS: AuditRow[] = Array.from({ length: 40 }, (_, i) => {
  const status = STAT[(i * 5 + 2) % STAT.length];
  const obs = status === "Draft" ? 0 : 3 + ((i * 7) % 9);
  const closed = status === "Closed" ? obs : status === "Draft" ? 0 : Math.floor((obs * ((i % 5) + 1)) / 7);
  const spocP = status === "Open" ? (i % 4 === 0 ? 1 + (i % 3) : 0) : 0;
  return {
    id: `Audit${String(i + 1).padStart(2, "0")}`,
    type: i % 5 === 0 ? "Circle Audit" : "Corporate Audit",
    circle: CIRCLES[(i * 3) % 10],
    loc: LOCS[i % LOCS.length],
    loc2:
      i === 0
        ? "Birla Centurion Pvt. Ltd., Wing B, Floor 3, Room 203, Common Area"
        : `Site ${LOCS[i % LOCS.length]}, Floor ${1 + (i % 5)}`,
    auditor: AUDITORS[i % AUDITORS.length],
    date: `${String(1 + ((i * 3) % 28)).padStart(2, "0")}/${String(1 + (i % 10)).padStart(2, "0")}/2026`,
    obs,
    closed,
    status,
    spocP,
  };
});

Object.assign(AUDITS[0], { status: "Open", obs: 10, closed: 2, spocP: 2, type: "Corporate Audit" });
Object.assign(AUDITS[1], { status: "Draft", obs: 0, closed: 0, spocP: 0, type: "Corporate Audit", loc2: AUDITS[0].loc2 });
Object.assign(AUDITS[2], { status: "Closed", obs: 10, closed: 10, spocP: 0, type: "Corporate Audit", loc2: AUDITS[0].loc2 });

export const DIR_CHIPS: [string, string][] = [
  ["all", "All (880)"],
  ["Draft", "Draft (109)"],
  ["Open", "Open (312)"],
  ["Closed", "Closed (459)"],
  ["spoc", "Pending SPOC plan (365 obs)"],
  ["ao", "Pending Action Owner (1,208 obs)"],
];

export interface HeatCell {
  circle: string;
  values: number[];
  average: number;
}

export const HEATMAP: HeatCell[] = CIRCLES.slice(0, 12).map((circle, i) => {
  const values = [0, 1, 2, 3, 4, 5].map((j) => Math.max(52, Math.min(99, Math.round(94 - ((i * 7 + j * 11) % 38) - (i > 8 ? 6 : 0)))));
  const average = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  return { circle, values, average };
});

export const heatClass = (v: number) => (v >= 90 ? "c4" : v >= 80 ? "c3" : v >= 70 ? "c2" : "c1");

export const FOLLOW_UP = [...HEATMAP].sort((a, b) => a.average - b.average).slice(0, 5);

export const SPOC_BOARD: [string, number][] = [
  ["Shahab Mirza", 48],
  ["Meera Iyer", 41],
  ["Kunal Shah", 36],
  ["Deepa Rao", 29],
  ["Farhan Ali", 24],
];

export const OWNER_BOARD: [string, number][] = [
  ["Vama Shah", 64],
  ["Rohit Patil", 57],
  ["Sneha Kulkarni", 49],
  ["Arjun Menon", 42],
  ["Pooja Singh", 35],
];

export interface OverdueRow {
  plan: string;
  audit: string;
  observation: string;
  owner: string;
  target: string;
  days: number;
}

export const OVERDUE_ROWS: OverdueRow[] = Array.from({ length: 8 }, (_, i) => ({
  plan: `${i % 2 ? "Pa" : "Ca"}${String((i % 3) + 1).padStart(2, "0")}`,
  audit: `Audit${String(i * 3 + 1).padStart(2, "0")}`,
  observation: `Obs${String(i * 2 + 2).padStart(2, "0")}`,
  owner: ACTION_OWNERS[i % ACTION_OWNERS.length],
  target: `${String(18 - i).padStart(2, "0")}/09/2026`,
  days: 33 + i * 2,
})).sort((a, b) => b.days - a.days);

export interface ChartSeries {
  label: string;
  data: number[];
  pieColors?: string[];
  barColor?: string;
  lineColor?: string;
  lineFill?: string;
}

export interface ChartSpec {
  id: string;
  labels: string[];
  datasets: ChartSeries[];
  defaultType: Exclude<ChartKind, "table">;
  stacked?: boolean;
  horizontal?: boolean;
}

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export const OBS_CIRCLES = CIRCLES.slice(0, 12);
export const OBS_BY_CIRCLE = OBS_CIRCLES.map((_, i) => 320 - i * 18);
export const OBS_BY_FUNCTION = [980, 690, 560, 440, 330, 250, 162];

export const OBS_CLASSIFICATIONS = [
  { label: "Non-Compliance", share: 0.63 },
  { label: "Other classifications", share: 0.37 },
];
export const OBS_CATEGORY_TREE = [
  { label: "Fire Safety", share: 0.3, subs: [["Fire extinguisher", 0.45], ["Emergency exits", 0.3], ["Fire alarm", 0.25]] },
  { label: "Category B", share: 0.23, subs: [["Category B – Sub 1", 0.6], ["Category B – Sub 2", 0.4]] },
  { label: "Category C", share: 0.19, subs: [["Category C – Sub 1", 0.6], ["Category C – Sub 2", 0.4]] },
  { label: "Category D", share: 0.15, subs: [["Category D – Sub 1", 0.6], ["Category D – Sub 2", 0.4]] },
  { label: "Category E", share: 0.13, subs: [["Category E – Sub 1", 0.6], ["Category E – Sub 2", 0.4]] },
] as { label: string; share: number; subs: [string, number][] }[];

export const CAPA_INITIATED_RATIO = 0.89;
export const CAPA_CLOSED_RATIO = 0.54;

const scaled = (values: number[], ratio: number) => values.map((value) => Math.round(value * ratio));

// Vi brand journey — Observations / CAPA Assigned / CAPA Closed.
// rgb() form avoids theme.css [fill="#hex"] !important overrides affecting paints.
export const OBS_JOURNEY_COLORS: [string, string, string] = [
  "rgb(255, 143, 107)", // Terracotta #FF8F6B — Observations
  "rgb(255, 196, 0)",   // Mustard #FFC400 — CAPA Assigned / Initiated
  "rgb(90, 8, 75)",     // Aubergine #5A084B — CAPA Closed
];

// Audits charts already use Terracotta for the audit series, so Observations uses Slate.
const AUDIT_CAPA_COLORS: [string, string, string] = [
  "rgb(47, 48, 67)",    // Slate #2F3043 — Observations
  "rgb(255, 196, 0)",   // Mustard #FFC400 — CAPA Assigned
  "rgb(90, 8, 75)",     // Aubergine #5A084B — CAPA Closed
];

const capaSeries = (values: number[], colors: [string, string, string] = OBS_JOURNEY_COLORS): ChartSeries[] => [
  { label: "Observations", data: values, barColor: colors[0] },
  { label: "CAPA Assigned", data: scaled(values, CAPA_INITIATED_RATIO), barColor: colors[1] },
  { label: "CAPA Closed", data: scaled(values, CAPA_CLOSED_RATIO), barColor: colors[2] },
];

export const CHARTS: Record<string, ChartSpec> = {
  auditStatus: { id: "auditStatus", labels: ["Draft", "Open", "Closed"], datasets: [{ label: "Audits", data: [109, 312, 459], pieColors: [C.draft, C.vi, C.closed], barColor: C.vi }], defaultType: "donut" },
  auditType: { id: "auditType", labels: ["Corporate", "Circle"], datasets: [{ label: "Audits", data: [536, 344], pieColors: [C.blue, C.terra], barColor: C.blue }], defaultType: "donut" },
  auditFunc: { id: "auditFunc", labels: FUNCTIONS, datasets: [{ label: "Audits", data: [248, 171, 142, 118, 92, 64, 45], barColor: C.terra }, ...capaSeries(OBS_BY_FUNCTION, AUDIT_CAPA_COLORS)], defaultType: "bar" },
  auditTrend: { id: "auditTrend", labels: MONTHS, datasets: [{ label: "Audits", data: [52, 58, 61, 66, 70, 74, 79, 81, 76, 84, 88, 91], lineColor: C.terracotta, lineFill: "rgba(255,143,107,.20)", barColor: C.terracotta }], defaultType: "line" },
  auditCircle: {
    id: "auditCircle",
    labels: CIRCLES.slice(0, 12),
    datasets: [
      { label: "Audits", data: [100, 92, 83, 75, 71, 64, 59, 54, 50, 45, 40, 37], barColor: C.terra },
      ...capaSeries(OBS_BY_CIRCLE, AUDIT_CAPA_COLORS),
    ],
    defaultType: "bar",
  },
  obsPerAudit: {
    id: "obsPerAudit",
    labels: AUDITS.filter((audit) => audit.status !== "Draft").slice(0, 15).map((audit) => audit.id),
    datasets: [{ label: "Observations", data: AUDITS.filter((audit) => audit.status !== "Draft").slice(0, 15).map((audit) => audit.obs), barColor: C.terra }],
    defaultType: "bar",
  },
  obsFunc: { id: "obsFunc", labels: FUNCTIONS, datasets: capaSeries(OBS_BY_FUNCTION, OBS_JOURNEY_COLORS), defaultType: "bar" },
  obsCircle: { id: "obsCircle", labels: OBS_CIRCLES, datasets: capaSeries(OBS_BY_CIRCLE, OBS_JOURNEY_COLORS), defaultType: "bar" },
  obsStatus: { id: "obsStatus", labels: ["Pending By SPOC", "Pending By Action Owner", "Closed By Action Owner"], datasets: [{ label: "Observations", data: [365, 1208, 1839], pieColors: [C.spoc, C.ao, C.blue], barColor: C.blue }], defaultType: "donut" },
  obsClass: { id: "obsClass", labels: ["Non-Compliance", "Other classifications"], datasets: [{ label: "Observations", data: [2140, 1272], pieColors: [C.vi, C.blue], barColor: C.vi }], defaultType: "donut" },
  obsCategory: { id: "obsCategory", labels: ["Fire Safety", "Category B", "Category C", "Category D", "Category E"], datasets: [{ label: "Observations", data: [1020, 780, 640, 520, 452], pieColors: [C.terracotta, C.mustard, C.slate, C.crimson, C.aubergine], barColor: C.terracotta }], defaultType: "bar" },
  obsFacility: { id: "obsFacility", labels: ["Facility type A", "Facility type B", "Facility type C", "Facility type D", "Facility type E"], datasets: [{ label: "Observations", data: [1180, 860, 610, 480, 282], pieColors: [C.slate, C.terracotta, C.mustard, C.crimson, C.aubergine], barColor: C.slate }], defaultType: "bar" },
  obsTrend: {
    id: "obsTrend",
    labels: MONTHS,
    datasets: [
      { label: "Raised", data: [210, 232, 248, 262, 281, 296, 308, 314, 299, 322, 338, 352], lineColor: C.terracotta, lineFill: "rgba(255,143,107,.18)", barColor: C.terracotta },
      { label: "Closed", data: [96, 122, 138, 151, 170, 182, 196, 205, 214, 228, 241, 262], lineColor: C.aubergine, lineFill: "rgba(90,8,75,.10)", barColor: C.aubergine },
    ],
    defaultType: "line",
  },
  obsVendor: { id: "obsVendor", labels: ["Jethalal & Sons Pvt. Ltd.", "Vendor B", "Vendor C", "Vendor D", "Vendor E"], datasets: [{ label: "Observations", data: [412, 366, 301, 254, 198], barColor: C.sage }], defaultType: "bar", horizontal: true },
  capaStatus: {
    id: "capaStatus",
    labels: ["Corrective", "Preventive"],
    datasets: [
      { label: "Not started", data: [365, 365], barColor: OBS_JOURNEY_COLORS[0] },
      { label: "Pending By Action Owner", data: [1208, 1208], barColor: OBS_JOURNEY_COLORS[1] },
      { label: "Closed By Action Owner", data: [1839, 1839], barColor: OBS_JOURNEY_COLORS[2] },
    ],
    defaultType: "bar",
    stacked: true,
  },
  capaAging: { id: "capaAging", labels: ["0–3 days", "4–7 days", "8–14 days", "15–30 days", "30+ days"], datasets: [{ label: "Observations", data: [112, 98, 71, 52, 32], pieColors: [C.aubergine, C.slate, C.mustard, C.terracotta, C.crimson], barColor: C.terracotta }], defaultType: "bar" },
  capaOverdue: { id: "capaOverdue", labels: CIRCLES.slice(0, 10), datasets: [{ label: "Past target date", data: [14, 13, 12, 11, 10, 9, 9, 8, 7, 6], barColor: C.vi }], defaultType: "bar" },
  capaExt: { id: "capaExt", labels: MONTHS, datasets: [{ label: "Extensions", data: [2, 3, 3, 4, 4, 5, 5, 4, 4, 5, 4, 4], lineColor: C.slate, lineFill: "rgba(47,48,67,.12)", barColor: C.slate }], defaultType: "line" },
};

export interface CatalogItem {
  id: string;
  type: "kpi" | "chart";
  label: string;
}

export const ANALYTICS_CATALOG: CatalogItem[] = [
  ...KPI_CONFIG.map((kpi) => ({ id: kpi.id, type: "kpi" as const, label: kpi.label })),
  { id: "auditStatus", type: "chart", label: "Audit Status" },
  { id: "auditType", type: "chart", label: "Audit Type" },
  { id: "auditFunc", type: "chart", label: "Audits by Function" },
  { id: "auditTrend", type: "chart", label: "Audits Conducted — 12 Months" },
  { id: "auditCircle", type: "chart", label: "Audits per Circle" },
  { id: "obsStatus", type: "chart", label: "Observation Status" },
  // { id: "obsPerAudit", type: "chart", label: "Total Observations · Per Audit" },
  { id: "obsFunc", type: "chart", label: "Observations by Function" },
  { id: "obsCircle", type: "chart", label: "Observations by Circle" },
  { id: "obsClass", type: "chart", label: "Observation Classification" },
  { id: "obsCategory", type: "chart", label: "Observations by Category" },
  // { id: "obsFacility", type: "chart", label: "Observations by Type of Facility" },
  { id: "obsTrend", type: "chart", label: "Observations Raised vs Closed" },
  { id: "obsVendor", type: "chart", label: "Observations by Vendor" },
  { id: "capaStatus", type: "chart", label: "Corrective vs Preventive Status" },
  { id: "capaAging", type: "chart", label: "Waiting for SPOC Plan — Aging" },
  { id: "capaOverdue", type: "chart", label: "Actions Past Target Date by Circle" },
  { id: "capaExt", type: "chart", label: "Target-date Extensions" },
];

export type DrillBlock =
  | { kind: "stats"; items: [string, string][] }
  | { kind: "note"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "table"; headers: string[]; rows: (string | number)[][] };

export interface DrillModel {
  crumb: string;
  title: string;
  blocks: DrillBlock[];
}

const byCircle = (n: number, f: (i: number) => (string | number)[]) => CIRCLES.slice(0, n).map((circle, i) => [circle, ...f(i)]);

export const DRILLS: Record<string, DrillModel> = {
  "kpi-total": { crumb: "Overview › Audits", title: "Total Audits · 880", blocks: [{ kind: "stats", items: [["880", "Total"], ["109", "Draft"], ["312", "Open"], ["459", "Closed"]] }, { kind: "heading", text: "Audits by Circle" }, { kind: "table", headers: ["Circle", "Open", "Closed"], rows: byCircle(6, (i) => [38 - i * 3, 62 - i * 5]) }] },
  "kpi-draft": { crumb: "Overview › Audits", title: "Draft Audits · 109", blocks: [{ kind: "stats", items: [["109", "Drafts"], ["29", "Older than 15 days"]] }, { kind: "note", text: "Drafts are saved by the Auditor with Save draft and can be continued from the audit list." }, { kind: "heading", text: "Oldest drafts" }, { kind: "table", headers: ["Audit", "Auditor", "Last saved"], rows: [["Audit02", "Sohail Ansari", "12 days ago"], ["Audit11", "Neha Kapoor", "19 days ago"], ["Audit23", "Rahul Verma", "22 days ago"]] }] },
  "kpi-open": { crumb: "Overview › Audits", title: "Open Audits · 312", blocks: [{ kind: "stats", items: [["312", "Open"], ["1208", "Actions pending"]] }, { kind: "heading", text: "Open audits with most pending observations" }, { kind: "table", headers: ["Audit", "Circle", "Pending"], rows: [["Audit01", "Maharashtra & Goa", 8], ["Audit07", "Tamil Nadu", 7], ["Audit14", "Karnataka", 6]] }] },
  "kpi-closed": { crumb: "Overview › Audits", title: "Closed Audits · 459", blocks: [{ kind: "stats", items: [["459", "Closed"], ["52.2%", "Of all audits"]] }, { kind: "note", text: "The rule that moves an audit to Closed is not defined in the design and needs confirmation." }] },
  "kpi-obs": { crumb: "Overview › Observations", title: "Total Observations · 3,412", blocks: [{ kind: "stats", items: [["365", "Pending SPOC"], ["1208", "Pending Action Owner"], ["1839", "Closed"]] }, { kind: "heading", text: "By Circle" }, { kind: "table", headers: ["Circle", "Observations", "Closed"], rows: byCircle(6, (i) => [320 - i * 24, 170 - i * 14]) }] },
  "kpi-spoc": { crumb: "Overview › CAPA", title: "Pending Action Plan by SPOC · 365", blocks: [{ kind: "stats", items: [["365", "Pending"], ["155", "Waiting > 7 days"]] }, { kind: "heading", text: "Waiting longest" }, { kind: "table", headers: ["Observation", "Audit", "SPOC", "Days"], rows: [["Obs01", "Audit01", "Shahab Mirza", 41], ["Obs05", "Audit01", "Shahab Mirza", 33], ["Obs18", "Audit09", "Meera Iyer", 29]] }] },
  "kpi-started": { crumb: "Overview › CAPA", title: "CAPA Plan Started · 3,047", blocks: [{ kind: "stats", items: [["3047", "Plans created"], ["89.3%", "Of observations"]] }, { kind: "note", text: "Includes observations with a plan created, whether or not the Action Owner has recorded the action taken." }] },
  "kpi-actions": { crumb: "Overview › CAPA", title: "Total Actions · 3,047", blocks: [{ kind: "stats", items: [["3047", "Total"], ["1208", "Pending"], ["1839", "Closed"]] }, { kind: "note", text: "Total Actions = Pending By Action Owner + Closed By Action Owner." }] },
  "kpi-ao": { crumb: "Overview › CAPA", title: "Action Pending by Action Owner · 1,208", blocks: [{ kind: "stats", items: [["1208", "Pending"], ["128", "Past target date"]] }, { kind: "heading", text: "Next due" }, { kind: "table", headers: ["Plan", "Observation", "Action Owner", "Target"], rows: [["Ca01", "Obs02", "Vama Shah", "18 Sep"], ["Pa01", "Obs02", "Vama Shah", "18 Sep"], ["Ca01", "Obs04", "Rohit Patil", "19 Sep"]] }] },
  "kpi-closedao": { crumb: "Overview › CAPA", title: "Closed by Action Owner · 1,839", blocks: [{ kind: "stats", items: [["1839", "Closed"], ["53.9%", "Of observations"]] }, { kind: "heading", text: "Recently closed" }, { kind: "table", headers: ["Plan", "Observation", "Closure date"], rows: [["Ca02", "Obs02", "18 Sep 2026"], ["Pa02", "Obs02", "18 Sep 2026"], ["Ca01", "Obs03", "17 Sep 2026"]] }] },
  "alert-spoc": { crumb: "Priority Actions", title: "Waiting for SPOC action plan > 7 days · 155", blocks: [{ kind: "stats", items: [["71", "8–14 days"], ["52", "15–30 days"], ["32", "30+ days"]] }, { kind: "heading", text: "By SPOC" }, { kind: "table", headers: ["SPOC", "Pending"], rows: SPOC_BOARD }, { kind: "note", text: "Proposed measure · days counted from observation submission." }] },
  "alert-overdue": { crumb: "Priority Actions", title: "Action plans past target date · 128", blocks: [{ kind: "stats", items: [["128", "Past target"], ["47", "Extended"]] }, { kind: "heading", text: "By Action Owner" }, { kind: "table", headers: ["Action Owner", "Open", "Past target"], rows: [["Vama Shah", 64, 22], ["Rohit Patil", 57, 19], ["Sneha Kulkarni", 49, 17], ["Arjun Menon", 42, 14]] }] },
  "alert-ext": { crumb: "Priority Actions", title: "Target-date extensions · 47", blocks: [{ kind: "stats", items: [["47", "Extensions"], ["31", "Corrective"], ["16", "Preventive"]] }, { kind: "note", text: "Counts plans with an Extend Target Date and Reason for extension. Who approves an extension is not defined in the design." }] },
  "alert-draft": { crumb: "Priority Actions", title: "Draft audits older than 15 days · 29", blocks: [{ kind: "stats", items: [["29", "Stale drafts"], ["109", "All drafts"]] }, { kind: "table", headers: ["Audit", "Auditor", "Age"], rows: [["Audit11", "Neha Kapoor", "19 days"], ["Audit23", "Rahul Verma", "22 days"], ["Audit31", "Priya Nair", "27 days"]] }] },
  "circle-underperform": { crumb: "Overview › Circle follow-up", title: "Circles needing follow-up", blocks: [{ kind: "note", text: "Circles with the lowest average closure progress across audit closure, plan creation, action taken, on-time and no-extension." }, { kind: "table", headers: ["Circle", "Open audits", "Pending SPOC", "Pending AO"], rows: [["Bihar", 21, 34, 88], ["Assam", 17, 29, 74], ["NESA", 15, 25, 71], ["Kolkata", 19, 22, 66]] }] },
};

export const auditDrill = (audit: AuditRow, index: number): DrillModel => {
  const rows = Array.from({ length: Math.min(audit.obs, 6) }, (_, k) => {
    const status = k < audit.closed ? "Closed By Action Owner" : audit.spocP > k ? "Pending By SPOC" : "Pending By Action Owner";
    return [`Obs${String(k + 1).padStart(2, "0")}`, status, audit.status === "Closed" ? "–" : `1${8 - (k % 4)} Sep`];
  });
  const blocks: DrillBlock[] = [
    { kind: "stats", items: [[String(audit.obs), "Observations"], [String(audit.closed), "Closed"], [audit.status, "Status"]] },
    { kind: "heading", text: "Audit details" },
    {
      kind: "table",
      headers: ["Field", "Value"],
      rows: [
        ["Circle", audit.circle],
        ["Work Location", audit.loc],
        ["Audit Location", audit.loc2],
        ["Auditor", audit.auditor],
        ["Date of Audit", audit.date],
        ["Function", FUNCTIONS[index % FUNCTIONS.length]],
      ],
    },
  ];
  if (rows.length) {
    blocks.push({ kind: "heading", text: "Observations" }, { kind: "table", headers: ["Observation", "Status", "Due"], rows });
  } else {
    blocks.push({ kind: "note", text: "Draft audit · no observations submitted yet." });
  }
  return { crumb: `Audit Directory › ${audit.id}`, title: `${audit.id} · ${audit.type}`, blocks };
};

export const titleForFilters = (circle: string, zone: string, persona: Persona) => {
  if (zone !== "All Zones") {
    const base = circle === "All Circles" ? "Audit · Pan India" : `Audit · ${circle}`;
    return `${base} · ${zone} Zone`;
  }
  if (circle === "All Circles") return SCOPES[persona].title;
  return `Audit · ${circle} Circle`;
};
