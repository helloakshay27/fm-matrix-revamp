// ── Dashboard Design System ───────────────────────────────────────────────────
// Single source of truth for all dashboard chart/table/card colors.
// Import from here — never hardcode in individual components.

/** Bar chart colors per guideline */
export const BAR_COLORS = ['#9EC8BA', '#8E7BE0', '#DA7756', '#798C5E', '#EDC488'];

/** Pie / donut chart colors per guideline */
export const PIE_COLORS = ['#CDCAF5', '#76CDC1', '#E39090'];

/** Stat-card background + number colors per guideline */
export const STAT_CARDS = {
  purple:  { bg: '#EFEFFB',                     num: '#6B5EA8' },
  teal:    { bg: 'rgba(183,220,212,0.30)',       num: '#2E7D6B' },
  orange:  { bg: 'rgba(227,144,144,0.15)',       num: '#D97655' },
  blue:    { bg: 'rgba(133,189,246,0.20)',       num: '#85BDF6' },
  black:   { bg: '#EFEFFB',                     num: '#1a1a1a' },
};

/** Table header color per guideline */
export const TABLE_HEADER_BG   = '#D97655';   // for ticket/task tables
export const TABLE_HEADER_TEAL = '#4DB6AC';   // for AMC tables
export const TABLE_HEADER_TEXT = '#FFFFFF';

/** Row alternating background */
export const ROW_ALT_BG = '#faf9f7';

/** Card wrapper — use as className */
export const CARD_CLASS = 'bg-white rounded-xl shadow-sm overflow-hidden';

/** Recharts common axis/grid styles */
export const AXIS_STYLE = { fill: '#9CA3AF', fontSize: 11 };
export const GRID_STYLE = { strokeDasharray: '3 3', stroke: '#f0f0f0', vertical: false };

/** Tooltip style */
export const TOOLTIP_STYLE = {
  contentStyle: { borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12, padding: '6px 10px' },
};
