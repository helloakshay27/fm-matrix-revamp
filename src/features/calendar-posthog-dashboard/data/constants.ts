/**
 * Filter vocabulary for the Calendar analytics dashboard.
 *
 * The catalogue itself — module names, workflows and their ordered event steps — lives in
 * `sampleData.ts` alongside the seeded generator that produces every number on the page.
 */

/**
 * Platform filter.
 *
 * Calendar App is a mobile product, so the platform toggle is iOS / Android, as in the
 * reference wireframe.
 */
export type Device = 'all' | 'ios' | 'android';
export type DateRange = 7 | 30 | 90;

export const RANGE_LABELS: Record<DateRange, string> = {
  7: 'Last 7 days',
  30: 'Last 30 days',
  90: 'Last 90 days',
};

/**
 * Suggested KPI targets, keyed by tile id — the reference wireframe's own defaults.
 *
 * A viewer can overwrite any of them in the tile's Target box; those edits stay in memory and
 * are never sent anywhere.
 */
export const BM_DEFAULTS: Record<string, number> = {
  activeUsers: 280,
  bounceRate: 18,
  seatUtil: 60,
  stickiness: 55,
  activation14: 55,
  wfAdoption: 50,
  wfCompletion: 70,
};
