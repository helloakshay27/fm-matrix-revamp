// Centralized analytics color palette
// Order preserved for consistent categorical mapping across charts.
export const ANALYTICS_PALETTE = [
  '#C4B89D', // 0
  '#D5DBDB', // 1
  '#E4626F', // 2
  '#C4AE9D', // 3
] as const;

export type AnalyticsPaletteColor = typeof ANALYTICS_PALETTE[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor => {
  return ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];
};

// Specific semantic mappings (can adjust later if semantics required):
export const ITEM_STATUS_COLORS = {
  active: ANALYTICS_PALETTE[0],
  inactive: ANALYTICS_PALETTE[1],
  critical: ANALYTICS_PALETTE[2],
  nonCritical: ANALYTICS_PALETTE[3],
};

export const LINE_CHART_COLORS = {
  minimum: ANALYTICS_PALETTE[2],
  current: ANALYTICS_PALETTE[3],
};

export const GRADIENT_PRIMARY = {
  from: ANALYTICS_PALETTE[2],
  to: ANALYTICS_PALETTE[3],
};

export const CATEGORY_BAR_COLOR = ANALYTICS_PALETTE[2];
