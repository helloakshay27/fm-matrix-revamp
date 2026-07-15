// =============================================
// LOCKATED BRAND - Centralized Chart Color Palette
// Uses CSS variables from theme.css for consistency
// =============================================

// Brand-aligned analytics color palette
// Order preserved for consistent categorical mapping across charts.
export const ANALYTICS_PALETTE = [
  '#DA7756', // [0] Bar - Brand Orange
  '#798C5E', // [1] Bar - Olive Green
  '#9EC8BA', // [2] Bar - Teal/Mint
  '#8E7BE0', // [3] Bar - Purple
  '#EDC488', // [4] Bar - Warm Yellow
  '#CECBF6', // [5] Lavender Purple
  '#E7848E', // [6] Error - Soft Red
  '#76CDC1', // [7] Pie - Teal
] as const;

export type AnalyticsPaletteColor = typeof ANALYTICS_PALETTE[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor => {
  return ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];
};

// Specific semantic mappings aligned with Lockated brand:
export const ITEM_STATUS_COLORS = {
  active: ANALYTICS_PALETTE[1],    // Green - 798C5E
  inactive: ANALYTICS_PALETTE[4],  // Warm Yellow - EDC488
  critical: ANALYTICS_PALETTE[6],  // Error - E7848E
  nonCritical: ANALYTICS_PALETTE[5], // Lavender - CECBF6
};

export const LINE_CHART_COLORS = {
  minimum: ANALYTICS_PALETTE[6],   // Error - E7848E
  current: ANALYTICS_PALETTE[0],   // Primary - DA7756
};

export const GRADIENT_PRIMARY = {
  from: ANALYTICS_PALETTE[0],      // Primary - DA7756
  to: ANALYTICS_PALETTE[4],        // Warm Yellow - EDC488
};

export const CATEGORY_BAR_COLOR = ANALYTICS_PALETTE[0]; // Primary - DA7756

// Additional brand-specific chart colors
export const CHART_COLORS = {
  primary: '#DA7756',
  secondary: '#798C5E',
  tertiary: '#9EC8BA',
  accent: '#8E7BE0',
  neutral: '#EDC488',
  warning: '#CECBF6',
  error: '#E7848E',
  info: '#76CDC1',
  success: '#798C5E',
  background: '#F6F4EE',
  text: '#2C2C2C',
};

// Pie/Donut chart specific colors
export const PIE_CHART_COLORS = [
  '#76CDC1',
  '#E39090',
  '#CDCAF5',
  '#9EC8BA',
  '#EDC488',
  '#8E7BE0',
  '#DA7756',
  '#798C5E',
];

// Bar chart gradient stops
export const BAR_GRADIENT = {
  start: '#DA7756',
  end: 'rgba(218, 119, 86, 0.3)',
};

