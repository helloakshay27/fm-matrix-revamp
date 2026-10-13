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


export const INVENTORY_ANALYTICS_PALETTE = [
  '#CECBF6', // [0] Purple
  '#6B9BCC', // [1] Blue
  '#108C72', // [2] Growth
  '#798C5E', // [3] Olive
  '#9EC8BA', // [4] Sage mint
  '#8E7BE0', // [5] Mid purple
  '#EDC488', // [6] Warning
  '#E7848E', // [7] Danger
] as const;

export type AnalyticsPaletteColor = typeof ANALYTICS_PALETTE[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor => {
  return ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];
};

// Business Genie fixed series palette — series are assigned strictly by index,
// never re-ordered per chart: purple, blue, growth, olive, sageMint, purpleMid,
// warning, danger. Written as rgb() on purpose: theme.css has legacy
// [fill="#hex"] !important overrides that would otherwise recolor these.
export const CHART_SERIES_PALETTE = [
  'rgb(142, 123, 224)', // [0] purple    #8E7BE0
  'rgb(107, 155, 204)', // [1] blue      #6B9BCC
  'rgb(16, 140, 114)',  // [2] growth    #108C72
  'rgb(121, 140, 94)',  // [3] olive     #798C5E
  'rgb(158, 200, 186)', // [4] sageMint  #9EC8BA
  'rgb(206, 203, 246)', // [5] purpleMid #CECBF6
  'rgb(237, 196, 136)', // [6] warning   #EDC488
  'rgb(228, 145, 145)', // [7] danger    #E49191
] as const;

export const getSeriesColor = (index: number): string =>
  CHART_SERIES_PALETTE[index % CHART_SERIES_PALETTE.length];

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

