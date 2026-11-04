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
  "--v-grid": VEDA_NEUTRAL.grid,
  "--v-axis": VEDA_NEUTRAL.axis,
} as React.CSSProperties;

/** Donut geometry shared by every PieChartCard on the page (thin ring, legend list on the right). */
export const VEDA_PIE_PROPS = {
  innerRadius: "80%",
  outerRadius: "94%",
  legendPosition: "right" as const,
};
