// =============================================
// VEDA THEME — single source of truth for RevampDashboardPage colours.
// Edit values HERE (and surface tokens in veda-dashboard.css) to restyle every
// card/chart on the Revamp dashboard. Nothing outside that page reads this file.
// Reference: veda-gardens-vertical-bars.html
// =============================================

/** Categorical series palette — assigned strictly by index. */
export const VEDA_PALETTE = [
  "#5A4BE0", // [0] purple
  "#2F6FE0", // [1] blue
  "#12A150", // [2] growth
  "#798C5E", // [3] olive
  "#7FD6AE", // [4] mint
  "#4839C4", // [5] deep purple
  "#F2A312", // [6] warning
  "#E5484D", // [7] danger
] as const;

export const getVedaColor = (index: number): string => VEDA_PALETTE[index % VEDA_PALETTE.length];

/**
 * Horizontal progress tracks — veda-gardens `.htrack > i` uses --warning.
 * Vertical columns use VEDA_PALETTE by index. Donuts use VEDA_PIE_PALETTE.
 */
export const VEDA_BAR_COLOR = "#F2A312";

/**
 * Donut slices only — the "Cases by tower" combination: purple, blue, green.
 * Extra slices repeat that trio. Columns keep the full VEDA_PALETTE.
 */
export const VEDA_PIE_PALETTE = [
  "#5A4BE0", // purple
  "#2F6FE0", // blue
  "#12A150", // green
] as const;

export const getVedaPieColor = (index: number): string =>
  VEDA_PIE_PALETTE[index % VEDA_PIE_PALETTE.length];

/** Semantic colours (replaces the old BRAND_HEX map on the page). */
export const VEDA_COLORS = {
  ink: "#1A1A18",
  purple: "#5A4BE0",
  purpleMid: "#4839C4",
  blue: "#2F6FE0",
  growth: "#12A150",
  olive: "#798C5E",
  mint: "#7FD6AE",
  warning: "#F2A312",
  danger: "#E5484D",
} as const;

/** Greys used for neutral series / tracks. */
export const VEDA_NEUTRAL = {
  bar: "rgba(26, 26, 24, 0.16)",
  track: "#FFFFFF",
  grid: "rgba(26, 26, 24, 0.06)",
  axis: "rgba(26, 26, 24, 0.48)",
} as const;

/** CSS custom properties applied to the page root; veda-dashboard.css consumes them. */
export const VEDA_CSS_VARS = {
  "--v-c0": VEDA_PALETTE[0],
  "--v-c1": VEDA_PALETTE[1],
  "--v-c2": VEDA_PALETTE[2],
  "--v-c3": VEDA_PALETTE[3],
  "--v-c4": VEDA_PALETTE[4],
  "--v-c5": VEDA_PALETTE[5],
  "--v-c6": VEDA_PALETTE[6],
  "--v-c7": VEDA_PALETTE[7],
  "--v-pie0": getVedaPieColor(0),
  "--v-pie1": getVedaPieColor(1),
  "--v-pie2": getVedaPieColor(2),
  "--v-pie3": getVedaPieColor(3),
  "--v-pie4": getVedaPieColor(4),
  "--v-pie5": getVedaPieColor(5),
  "--v-pie6": getVedaPieColor(6),
  "--v-pie7": getVedaPieColor(7),
  "--v-grid": VEDA_NEUTRAL.grid,
  "--v-axis": VEDA_NEUTRAL.axis,
} as React.CSSProperties;

/** Donut geometry shared by every PieChartCard on the page (thin ring, legend list on the right). */
export const VEDA_PIE_PROPS = {
  innerRadius: "80%",
  outerRadius: "94%",
  legendPosition: "right" as const,
};
