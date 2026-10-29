import {
  CARD_INFO,
  DIR_CHIPS,
  DIR_COLS,
  FOLLOW_UP,
  GENERATED_CHARTS,
  GENERATED_DRILLS,
  GENERATED_ROWS,
  HEATMAP,
  HEATMAP_STAGES,
  KPI_INFO,
  MY_CHARTS,
  OVERDUE_PLANS,
  OVERDUE_TAG,
  OWNER_BOARD,
  SCOPES,
  SPOC_BOARD,
} from "./generated";

export { CARD_INFO, DIR_CHIPS, DIR_COLS, FOLLOW_UP, HEATMAP, HEATMAP_STAGES, KPI_INFO, OVERDUE_PLANS, OVERDUE_TAG, OWNER_BOARD, SCOPES, SPOC_BOARD };

export type Persona = "admin" | "circle";
export type ModuleKey = "inspection" | "mydashboard";
export type ChartKind = "donut" | "bar" | "line" | "table";

export interface Series {
  label: string;
  data: readonly number[];
  pieColors?: readonly string[];
  barColor?: string;
  lineColor?: string;
  lineFill?: string;
}

export interface ChartSpec {
  defaultType: Exclude<ChartKind, "table">;
  labels: readonly string[];
  datasets: readonly Series[];
  stacked?: boolean;
  horizontal?: boolean;
}

export const CHARTS = GENERATED_CHARTS as unknown as Record<string, ChartSpec>;

export const C = {
  terra: "#DA7756",
  sage: "#798C5E",
  teal: "#9EC8BA",
  lav: "#CECBF6",
  blue: "#6B9BCC",
  ok: "#108C72",
  warn: "#EDC488",
  err: "#E7848E",
  dark: "#2C2C2C",
  vi: "#EE2737",
} as const;

// KPI values can be counts or pre-formatted strings (e.g. "91.4%").
export const fmt = (n: number | string) => (typeof n === "string" ? n : Number(n).toLocaleString("en-IN"));

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
export const FUNCTIONS = ["Sales", "Sales & Distribution", "Technology", "Postpaid", "Customer Service", "Finance", "HR"];
export const ZONES = ["All Zones", "Worli", "Andheri", "Thane", "Pune", "Nashik", "Nagpur"];
export const INSPECTION_TYPES = ["All types", "Lobby Inspection", "Office Room", "Meeting Room Inspection"];

export const ANALYTICS_CATALOG = [
  ...KPI_INFO.map((item) => ({ id: item.id, label: item.label, kind: "kpi" as const })),
  ...MY_CHARTS.map(([id, label]) => ({ id, label, kind: "chart" as const })),
];

export interface DrillModel {
  crumb: string;
  title: string;
  html: string;
}

export const DRILLS = GENERATED_DRILLS as unknown as Record<string, DrillModel>;
export const ROWS = GENERATED_ROWS;

export function titleForFilters(circle: string, zone?: string) {
  if (circle === "All Circles") {
    return zone && zone !== "All Zones" ? `Inspection · Pan India · ${zone} Zone` : SCOPES.admin.title;
  }
  return `Inspection · ${circle}${zone && zone !== "All Zones" ? ` · ${zone} Zone` : " Circle"}`;
}

export function cardInfo(title: string) {
  return (CARD_INFO as Record<string, string>)[title] ?? "";
}
