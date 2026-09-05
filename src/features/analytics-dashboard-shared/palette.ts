/**
 * Chart palette for the Calendar analytics dashboard.
 *
 * The HTML original read these off `getComputedStyle(documentElement)` at render time; here
 * both themes are declared directly so a chart can be built without a live DOM measurement.
 * Values track the tokens in `calendar-posthog-dashboard.css` — keep in sync.
 *
 * Copied from `vi-posthog-dashboard/data/palette.ts` rather than extracted out of it: the Vi
 * dashboard is live, and it was deliberately left byte-identical so that nothing which
 * already works changes behaviour because the Calendar dashboard was added. If the two are
 * ever consolidated, this is the copy to keep.
 */
export type DashboardTheme = 'light' | 'dark';

export interface ChartPalette {
  ink: string;
  faint: string;
  grid: string;
  line: string;
  blue: string;
  fill: string;
  mint: string;
  amber: string;
  red: string;
  violet: string;
  violetTint: string;
  green: string;
  greenTint: string;
  heatRgb: string;
  onHeat: string;
  heatA0: number;
  heatA1: number;
}

const LIGHT: ChartPalette = {
  ink: '#141413', faint: '#9b9990', grid: '#e6e4de', line: '#d9d6ce',
  blue: '#2c7be5', fill: '#d3e3f9', mint: '#3daf7d', amber: '#c98a12', red: '#b3402c',
  violet: '#7c6fd6', violetTint: '#e7e4f8', green: '#0f8a3d', greenTint: '#e2efe6',
  heatRgb: '44,123,229', onHeat: '#ffffff', heatA0: 0.09, heatA1: 0.78,
};

const DARK: ChartPalette = {
  ink: '#f2f0eb', faint: '#7b7871', grid: '#33302a', line: '#4a463d',
  blue: '#5f9df6', fill: '#22344b', mint: '#57c496', amber: '#dfa63e', red: '#e4735c',
  violet: '#9d90e8', violetTint: '#292440', green: '#4fc07f', greenTint: '#1a2c21',
  heatRgb: '95,157,246', onHeat: '#101820', heatA0: 0.12, heatA1: 0.8,
};

export function paletteFor(theme: DashboardTheme): ChartPalette {
  return theme === 'dark' ? DARK : LIGHT;
}
