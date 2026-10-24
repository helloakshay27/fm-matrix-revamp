import {
  BOARDS,
  CARD_INFO,
  DIR_CHIPS,
  FOLLOW_UP,
  GENERATED_CHARTS,
  GENERATED_DRILLS,
  GENERATED_ROWS,
  HEATMAP,
  KPI_INFO,
  RECENT,
  SCOPES,
} from "./generated";

export { BOARDS, CARD_INFO, DIR_CHIPS, FOLLOW_UP, HEATMAP, KPI_INFO, RECENT, SCOPES };

export type Persona = "admin" | "circle";
export type ModuleKey = "incident" | "mydashboard";
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
  dark: "#2C2C2C",
  vi: "#EE2737",
} as const;

export const fmt = (n: number) => Number(n).toLocaleString("en-IN");

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
export const CLASSIFICATIONS = ["All classifications", "Non-Compliance", "Other classifications"];

export const CHART_LABELS: Record<string, string> = {
  incStatus: "Incident Status",
  incStage: "Open Incident Stage",
  incInjury: "Incidents with Injury",
  incTrend: "Incidents Reported vs Closed",
  incCircle: "Incidents per Circle",
  incClass: "Incident Classification",
  incCategory: "Incidents by Category",
  incFacility: "Incidents by Type of Facility",
  incFunc: "Incidents by Function",
  incTime: "Incidents by Time of Day",
  incPerson: "Nature of Person Impacted",
  incInjType: "Nature of Injury",
  incBody: "Body Part Affected",
  incLost: "Days Away vs Restricted Work Days",
  invReq: "Investigation Required?",
  invFactors: "Contributing Factor Groups",
  invConc: "Investigation Conclusion",
  invCauses: "Top Contributing Causes",
  invAging: "Waiting for SPOC Review — Aging",
  capaStatus: "Corrective vs Preventive Status",
  capaOverdue: "Plans Past Target Date by Circle",
  capaExt: "Target-date Extensions",
};

export const ANALYTICS_CATALOG = [
  ...KPI_INFO.map((item) => ({ id: item.id, label: item.label, kind: "kpi" as const })),
  ...Object.entries(CHART_LABELS).map(([id, label]) => ({ id, label, kind: "chart" as const })),
];

export interface DrillModel {
  crumb: string;
  title: string;
  html: string;
}

export const DRILLS = GENERATED_DRILLS as unknown as Record<string, DrillModel>;
export const ROWS = GENERATED_ROWS;

export const OVERDUE_PLANS = [
  ["Ca01", "Incident01", "Vama Shah", "18/09/2026", "33"],
  ["Pa01", "Incident04", "Rohit Patil", "19/09/2026", "32"],
  ["Ca02", "Incident09", "Sneha Kulkarni", "22/09/2026", "29"],
  ["Pa02", "Incident12", "Arjun Menon", "24/09/2026", "27"],
  ["Ca01", "Incident17", "Pooja Singh", "26/09/2026", "25"],
  ["Pa01", "Incident21", "Vama Shah", "28/09/2026", "23"],
] as const;

export const PROGRESS = [
  ["Reported", "100%", "var(--blue)"],
  ["Reviewed by SPOC", "88.5%", "var(--teal)"],
  ["Investigation complete", "80.2%", "var(--sage)"],
  ["Action plan submitted", "74.6%", "var(--ok)"],
  ["Closed", "58.1%", "var(--ok)"],
] as const;

export function titleForFilters(circle: string, zone?: string) {
  if (circle === "All Circles") {
    return zone && zone !== "All Zones" ? `Incident · Pan India · ${zone} Zone` : SCOPES.admin.title;
  }
  return `Incident · ${circle}${zone && zone !== "All Zones" ? ` · ${zone} Zone` : " Circle"}`;
}

export function cardInfo(title: string) {
  return (CARD_INFO as Record<string, string>)[title] ?? "";
}
