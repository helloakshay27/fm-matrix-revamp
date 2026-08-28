export interface InfoEntry {
  t: string;
  f: string;
  d: string;
}

/**
 * "How this is calculated" dictionary, keyed by metric id — formulas taken
 * from SmartSecure_Chart_Calculation_Instrumentation.html §7.1–§7.3 (the
 * authoritative source for what each tile *means*), business-meaning copy
 * adapted from the wireframe's own KPI_INFO dictionary where one existed.
 */
export const INFO: Record<string, InfoEntry> = {
  U1: { t: 'Active Users (U1)', f: 'distinct(user_id) over the selected scope and period. WAU = 7-day window (dashboard default), DAU = 1-day, MAU = 30-day.', d: 'Shows the reach of the app among registered gate staff and admins — how many people actually used it, not how many times.' },
  U2: { t: 'Screen Views (U2)', f: 'count(Success-typed screen-load events) over the period — e.g. home_screen_viewed, staff_list_viewed, visitor_checkout_list_viewed. SmartSecure has no separate View type, so screen loads are typed Success.', d: 'Overall screen/content consumption across the app.' },
  U3: { t: 'Sessions (U3)', f: 'distinct(session_id) over the period, from app_launched — the first event of every session.', d: 'Usage volume across all gate devices.' },
  U4: { t: 'Session Duration (U4)', f: 'Σ session_duration_s ÷ distinct(session_id). A session ends after ~30 minutes of inactivity (PostHog default).', d: 'Engagement depth per shift.' },
  U5: { t: 'Bounce Rate (U5)', f: '(Σ is_bounce ÷ distinct(session_id)) × 100, where is_bounce = 1 if screen_view_count ≤ 1 AND action_count = 0.', d: 'Immediate exits, or a device left idle after login. Lower is better.' },
  U6: { t: 'Recently Online (U6)', f: 'distinct(user_id where max(timestamp) ≥ now − 30 min).', d: 'A live pulse of which gates are currently active.' },
  U7: { t: 'Usage over time (U7)', f: 'Three interchangeable series over the same time axis — Visitors (=U1), Views (=U2), Sessions (=U3) — each with a previous-period dashed overlay.', d: 'Lets you spot the trend and compare it like-for-like against the previous period.' },
  U8: { t: 'Device / Platform Split (U8)', f: 'Per platform p ∈ {ios, android}: distinct(user_id where platform=p) ÷ U1 × 100. Views/Session = U2 ÷ U3, folded into the same card.', d: 'SmartSecure runs on gate tablets — this shows where release testing and support effort should concentrate.' },
  A1: { t: 'Seat Utilisation (A1)', f: 'U1 ÷ registered gate-staff/admins ceiling × 100.', d: 'Of all the accounts provisioned for gate staff, what share are actually being used.' },
  A2: { t: 'Stickiness (A2)', f: 'distinct(active in P, 1-day) ÷ distinct(active in P, 30-day) × 100, averaged across the active base (DAU ÷ MAU).', d: 'Whether usage is habitual across shifts or only occasional.' },
  A3: { t: 'Adoption Trend (A3)', f: '% change in weekly active users, current 8-week window vs. the prior 8-week window.', d: 'A momentum reading — positive means more of the gate-staff base is engaging than 8 weeks ago.' },
  A4: { t: '14-Day Activation (A4)', f: 'distinct(user_id with an Event-typed action within 14 days of $first_seen) ÷ distinct($first_seen in P) × 100.', d: 'Whether newly added gate staff reach a first meaningful action within their first two weeks.' },
  A5: { t: 'Module Breadth (A5)', f: 'distinct(module with ≥1 active user in P) ÷ 17 modules × 100 (tile shows the raw count).', d: 'How much of the platform a gate/society has actually adopted, not just Home and Visitor check-in.' },
  A6: { t: 'Adoption Trend chart (A6)', f: 'Weekly series of distinct(user_id active that week), trailing 8 weeks.', d: 'The trend line behind the Adoption Trend tile above.' },
  A7: { t: 'Growth Accounting (A7)', f: 'Weekly: New = distinct($first_seen in wk); Returning = distinct(active this wk ∩ last wk); Resurrecting = distinct(active this wk ∩ dormant 14+ d before); Dormant = distinct(active last wk ∩ inactive this wk).', d: 'Explains why the active-user number moved — bars above the line are gains, the bar below is the loss.' },
  A8: { t: 'Retention Cohort Grid (A8)', f: 'Per (cohort c, offset w): distinct($first_seen in wk c, active in wk c+w) ÷ distinct($first_seen in wk c) × 100.', d: 'Each row = gate staff first active that week; cells = % of that cohort still active N weeks later.' },
  A9: { t: 'Adoption by Role (A9)', f: 'Per role g ∈ {gatekeeper, supervisor, admin}: distinct(user_id where role=g, active in P) ÷ registered(g) × 100.', d: "Shows whether adoption is concentrated at the gate or also reaching the people who configure Setup and review history." },
  A10: { t: 'Dormant Users (A10)', f: 'count(user_id where recency_days ≥ 14).', d: 'Registered gate staff/admins with no activity in the last 14 days.' },
  A11: { t: 'Society-wise Breakdown (A11)', f: 'Per society: active users, sessions, avg session, bounce rate, trend vs. previous period, and a status band from bounce rate (Watch ≥22% / Steady 16–21% / Healthy <16%).', d: 'A leaderboard to see which societies are adopting well and which are lagging.' },
  'F-adopt': { t: 'Workflow Adoption (F-adopt)', f: 'distinct(user_id firing the flow’s first step event) ÷ U1 (WAU) × 100.', d: 'Shows how many gate staff attempt this process.' },
  'F-comp': { t: 'Completion Rate (F-comp)', f: 'count(reaching the terminal event) ÷ count(firing the first step event) × 100.', d: 'How effectively the workflow converts to a completed check-in / check-out / creation.' },
  'F-step': { t: 'Biggest Step Drop (F-step)', f: 'reach(i) = distinct(flow_instance_id firing step i); drop(i) = (reach(i) − reach(i+1)) ÷ reach(i) × 100; the tile shows argmax_i drop(i) and the step it occurs at.', d: 'Highlights where the gate process is losing completions — often a validation or API failure.' },
  'F-vol': { t: 'Usage Volume (F-vol)', f: 'count(terminal event) over the period — successful completions.', d: 'Absolute volume of successful check-ins, check-outs, or creations.' },
  'F-scr': { t: 'All screens in this module (F-scr)', f: 'Per step i in the flow: users = distinct reaching step i; events = count(step i event); sessions = distinct sessions reaching step i; completion = reach(i) ÷ reach(1) × 100.', d: 'The module-scoped equivalent of the funnel above, at the individual-screen level.' },
  'F-entry': { t: 'Top entry screens (F-entry)', f: 'Org-wide, not module-filtered: visitors = distinct sessions where entry_screen = screen; views = count of Success-typed screen-load events for that screen; bounce = % of those sessions that were single-view.', d: 'Where gate staff land — usually the Splash/device-approval flow or Home after login.' },
};

/** User-defined KPI benchmarks — rate metrics start with a suggested target, count metrics start blank. Ported from the wireframe's BM_DEFAULTS (only the ids actually wired to a tile in this build). */
export const BM_DEFAULTS: Record<string, number> = {
  activeUsers: 75,
  bounceRate: 18,
  seatUtil: 60,
  stickiness: 55,
  activation14: 55,
  'F-adopt': 50,
  'F-comp': 70,
};

/** ILLUSTRATIVE — there is no live PostHog project behind SmartSecure at all. This 12-point
 *  curve is a plain smooth-growth shape chosen only so the "Usage over time" chart looks
 *  populated; it is NOT anchored to any real endpoint from any live project. */
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const ACTIVE_USERS_BASE = [1650, 1720, 1790, 1860, 1930, 2000, 2070, 2140, 2205, 2270, 2330, 2390];
export const SESSIONS_BASE = [9200, 9600, 10000, 10400, 10800, 11200, 11600, 12000, 12380, 12760, 13120, 13480];

/** ILLUSTRATIVE placeholder society names — sample data only, not real SmartSecure client names. */
export const PROJECTS = ['Society A – Powai', 'Society B – Andheri', 'Society C – Malad', 'Society D – Chembur'];

/**
 * ILLUSTRATIVE ceiling — an estimated total registered-gate-staff-and-admin count across
 * societies, not a real/confirmed figure. Named identically to the wireframe's own
 * `BOOKED_HOMEBUYERS` constant (kept for parity with the shared JS engine it was ported
 * from); it functions here as the "registered gate staff" ceiling Active Users is scaled
 * against.
 */
export const BOOKED_HOMEBUYERS = 2500;

/**
 * 17 real modules, taken verbatim from SmartSecure_PostHog_Events.xlsx ("PostHog Events"
 * sheet) — 180 events across 38 categories. The reach % next to each module is
 * illustrative/sample; there is no live PostHog project behind SmartSecure yet.
 */
export const MODULES_LIST: [string, number][] = [
  ['Home', 100], ['Splash & Device Approval', 97], ['Authentication', 94], ['Visitor Management', 86],
  ['Staff Management', 71], ['Profile & Staff Verification', 52], ['Notifications', 48],
  ['Member Vehicle', 44], ['Visitor Vehicle', 41], ['QR Scanner / Gate Entry', 63],
  ['Setup', 36], ['Patrolling', 33], ['Goods Outward', 28], ['History Filter (shared)', 39],
  ['Help Center', 17], ['Shared Utilities', 45], ['App Lifecycle', 100],
];
export const TOTAL_MODULES = MODULES_LIST.length;
