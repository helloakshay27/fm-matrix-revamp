export type Device = 'all' | 'ios' | 'android';
export type DateRangeDays = 7 | 30 | 90;
export type ActivePage = 'pgTraffic' | 'pgAdopt' | 'pgFlows';

export interface DashboardState {
  dev: Device;
  prev: boolean;
  wf: string;
  page: ActivePage;
  range: DateRangeDays;
  rangeLabel: string;
  rangeFrom: string;
  rangeTo: string;
  /**
   * The wireframe's own society/project selector (`#projectSel`) has no
   * `onchange` handler anywhere in its script — it never actually filters
   * any chart or tile. Kept here as real, controlled UI state so the
   * dropdown behaves like a normal input, but it intentionally does not
   * feed the seeded generator, matching the wireframe's own behavior.
   */
  society: string;
  theme: 'light' | 'dark';
  navCollapsed: boolean;
}

export interface TileSpec {
  id?: string;
  label: string;
  val: string;
  dir?: 'up' | 'dn' | 'flat';
  delta?: string | null;
  sub?: string;
  raw?: number;
  unit?: string;
  goodUp?: boolean;
  noTarget?: boolean;
}
