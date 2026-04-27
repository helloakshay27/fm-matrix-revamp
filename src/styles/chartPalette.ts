// =============================================
// LOCKATED BRAND - Centralized Chart Color Palette
// Uses CSS variables from theme.css for consistency
// =============================================

// Brand-aligned analytics color palette
// Order preserved for consistent categorical mapping across charts.
export const ANALYTICS_PALETTE = [
  '#DA7756', // Primary - Brand Orange
  '#798C5E', // Secondary - Olive Green
  '#CECBF6', // Tertiary - Lavender Purple
  '#9EC8BA', // Accent - Teal/Mint
  '#C4B89D', // Neutral - Card Border Tan
  '#EDC488', // Warning - Warm Yellow
  '#E7848E', // Error - Soft Red
  '#6B9BCC', // Info - Sky Blue
] as const;

export type AnalyticsPaletteColor = typeof ANALYTICS_PALETTE[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor => {
  return ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];
};

// Specific semantic mappings aligned with Lockated brand:
export const ITEM_STATUS_COLORS = {
  active: ANALYTICS_PALETTE[1],    // Green - 798C5E
  inactive: ANALYTICS_PALETTE[4],  // Neutral - C4B89D
  critical: ANALYTICS_PALETTE[6],  // Error - E7848E
  nonCritical: ANALYTICS_PALETTE[5], // Warning - EDC488
};

export const LINE_CHART_COLORS = {
  minimum: ANALYTICS_PALETTE[6],   // Error - E7848E
  current: ANALYTICS_PALETTE[0],   // Primary - DA7756
};

export const GRADIENT_PRIMARY = {
  from: ANALYTICS_PALETTE[0],      // Primary - DA7756
  to: ANALYTICS_PALETTE[4],        // Neutral - C4B89D
};

export const CATEGORY_BAR_COLOR = ANALYTICS_PALETTE[0]; // Primary - DA7756

// Additional brand-specific chart colors
export const CHART_COLORS = {
  primary: '#DA7756',
  secondary: '#798C5E',
  tertiary: '#CECBF6',
  accent: '#9EC8BA',
  neutral: '#C4B89D',
  warning: '#EDC488',
  error: '#E7848E',
  info: '#6B9BCC',
  success: '#798C5E',
  background: '#F6F4EE',
  text: '#2C2C2C',
};

// Pie/Donut chart specific colors
export const PIE_CHART_COLORS = [
  '#DA7756',
  '#798C5E',
  '#CECBF6',
  '#9EC8BA',
  '#EDC488',
  '#6B9BCC',
];

// Bar chart gradient stops
export const BAR_GRADIENT = {
  start: '#DA7756',
  end: 'rgba(218, 119, 86, 0.3)',
};

