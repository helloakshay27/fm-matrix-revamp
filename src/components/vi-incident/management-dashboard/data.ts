import {
  BOARDS,
  CARD_INFO,
  DIR_CHIPS,
  FOLLOW_UP,
  GENERATED_CHARTS,
  GENERATED_DRILLS,
  GENERATED_ROWS,
  HEATMAP,
  KPI_INFO as WIREFRAME_KPI_INFO,
  RECENT,
  SCOPES,
} from "./generated";

export { BOARDS, CARD_INFO, DIR_CHIPS, FOLLOW_UP, HEATMAP, RECENT, SCOPES };

/**
 * KPI cards: the wireframe's, then the CAPA / investigation counts from GET kpi (capa_planned,
 * capa_open, closed_investigation, awaiting_investigation). Values come in this same order.
 */
export const KPI_INFO = [
  ...WIREFRAME_KPI_INFO,
  {
    id: "capa-planned",
    label: "CAPA Planned",
    group: "capa",
    panel: "acc-capa",
    section: "CAPA",
    color: "var(--slate)",
    tint: "rgba(202,222,248,.8)",
    icon: "M9 11l3 3L22 4|M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    info: "Corrective and preventive action plans created for incidents.",
  },
  {
    id: "capa-open",
    label: "CAPA Open",
    group: "capa",
    panel: "acc-capa",
    section: "CAPA",
    color: "var(--warn)",
    tint: "rgba(255,196,0,.22)",
    icon: "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z",
    info: "Action plans not yet closed by the Action Owner.",
  },
  {
    id: "inv-closed",
    label: "Closed Investigation",
    group: "inv",
    panel: "acc-inv",
    section: "Investigation",
    color: "var(--blue)",
    tint: "rgba(90,8,75,.16)",
    icon: "M22 11.08V12a10 10 0 11-5.93-9.14|M22 4L12 14.01l-3-3",
    info: "Incidents whose investigation has been completed.",
  },
  {
    id: "inv-awaiting",
    label: "Awaiting Investigation",
    group: "inv",
    panel: "acc-inv",
    section: "Investigation",
    color: "var(--aubergine)",
    tint: "rgba(243,232,209,.9)",
    icon: "M11 19a8 8 0 100-16 8 8 0 000 16z|M21 21l-4.35-4.35",
    info: "Incidents still waiting for an investigation.",
  },
] as const;

/** Cards shown in the overview, in display order (the others are hidden but keep their values). */
export const VISIBLE_KPI_IDS = ["inc-total", "capa-planned", "capa-open", "capa-closed", "inv-closed", "inv-awaiting"] as const;

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

/** Vi My Workspace brand colour card — the only colours this dashboard uses. */
export const BRAND = {
  crimson: "#EE2737",
  mustard: "#FFC400",
  aubergine: "#5A084B",
  slate: "#2F3043",
  terracotta: "#FF8F6B",
  sky: "#CADEF8",
  sand: "#F3E8D1",
  white: "#FFFFFF",
} as const;

/** Category order for donut slices and multi-colour bars. */
export const PALETTE = [BRAND.aubergine, BRAND.terracotta, BRAND.mustard, BRAND.slate, BRAND.crimson, BRAND.sky, BRAND.sand] as const;

export const C = {
  terra: BRAND.terracotta,
  sage: BRAND.slate,
  teal: BRAND.sky,
  dark: BRAND.slate,
  vi: BRAND.crimson,
} as const;

// The generated sample specs were authored in the Lockated palette; map them onto the brand card.
const BRAND_MAP: Record<string, string> = {
  "#DA7756": BRAND.terracotta,
  "#F4795F": BRAND.terracotta,
  "#F9A592": BRAND.terracotta,
  "#798C5E": BRAND.slate,
  "#2C2C2C": BRAND.slate,
  "#6B9BCC": BRAND.aubergine,
  "#0D47A1": BRAND.aubergine,
  "#108C72": BRAND.aubergine,
  "#9EC8BA": BRAND.sky,
  "#CECBF6": BRAND.sand,
  "#FDE2C8": BRAND.sand,
  "#EDC488": BRAND.mustard,
  "#E7848E": BRAND.crimson,
  "#EE2737": BRAND.crimson,
};
const toBrand = (hex: string) => BRAND_MAP[hex.toUpperCase()] ?? hex;

export function fadeHex(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function toBrandSpec(spec: ChartSpec): ChartSpec {
  return {
    ...spec,
    datasets: spec.datasets.map((series) => {
      const lineColor = series.lineColor ? toBrand(series.lineColor) : undefined;
      return {
        ...series,
        pieColors: series.pieColors?.map(toBrand),
        barColor: series.barColor ? toBrand(series.barColor) : undefined,
        lineColor,
        lineFill: lineColor ? fadeHex(lineColor, 0.12) : undefined,
      };
    }),
  };
}

export const CHARTS: Record<string, ChartSpec> = Object.fromEntries(
  Object.entries(GENERATED_CHARTS as unknown as Record<string, ChartSpec>).map(([key, spec]) => [key, toBrandSpec(spec)]),
);

export const fmt = (n: number) => Number(n).toLocaleString("en-IN");

/** KPI value from the API, or "—" when it was not sent. */
export const fmtKpi = (n: number | null | undefined) => (typeof n === "number" ? fmt(n) : "—");

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
  ...KPI_INFO.filter((item) => (VISIBLE_KPI_IDS as readonly string[]).includes(item.id)).map((item) => ({ id: item.id, label: item.label, kind: "kpi" as const })),
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

/** Circle and zone are display names; "" means none selected. */
export function titleForFilters(persona: Persona, circles: string[], zone: string) {
  const zonePart = zone ? ` · ${zone}` : "";
  if (circles.length === 1) return `Incident · ${circles[0]} Circle${zonePart}`;
  if (circles.length > 1) return `Incident · ${circles.length} Circles${zonePart}`;
  return `Incident · ${persona === "admin" ? "Pan India" : "Circle Manager"} View${zonePart}`;
}

export function cardInfo(title: string) {
  return (CARD_INFO as Record<string, string>)[title] ?? "";
}
