/**
 * Vi my Workspace — instrumentation coverage, straight from the event catalogue.
 *
 * `Vi_PostHog_Event_Catalogue_v2.xlsx` is split across two sheets with ZERO event-name overlap:
 *
 *   • "Vi my Workspace"   — 128 modern events across 11 categories. View/Action/Failure typed,
 *                           with real *_submitted / *_succeeded / *_failed funnels for 9 modules.
 *   • "Legacy GA Events"  — 176 older Google-Analytics events across 28 module labels, dual-sunk
 *                           to both PostHog and Firebase by logEvents() and left unchanged so
 *                           existing GA reports keep resolving. Mostly page/click only.
 *
 * 9 of the legacy module labels are the SAME real feature as one of the modern modules — just
 * the older click-only instrumentation for it, not a separate module. Those are marked `both`.
 *
 * This is catalogue metadata, not a metric: it describes which generation of tracking code
 * exists per module, so whoever decides where to invest in instrumentation next can see it. It
 * is therefore a static list by nature — there is no endpoint that reports "which sheet is this
 * module documented in". Every VOLUME on this dashboard still comes from the API; the reference
 * dashboard's own reach percentages and per-tier active-user counts are seeded sample data and
 * are deliberately NOT reproduced here.
 */

/** Which catalogue sheet(s) document this module's events. */
export type ViInstrumentationTier = 'modern' | 'legacy' | 'both';

export interface ViModuleCoverage {
  name: string;
  tier: ViInstrumentationTier;
}

/** All ~30 tracked modules, in catalogue order. */
export const VI_MODULE_COVERAGE: ViModuleCoverage[] = [
  { name: 'App Lifecycle', tier: 'modern' },
  { name: 'Authentication & Splash', tier: 'modern' },
  { name: 'Tickets (Helpdesk)', tier: 'both' },
  { name: 'mSafe', tier: 'both' },
  { name: 'Business Card', tier: 'both' },
  { name: 'Visitors', tier: 'both' },
  { name: 'Vi Miles (Local Travel)', tier: 'both' },
  { name: 'Drawer, Profile & Navigation', tier: 'both' },
  { name: 'App Support (Help Centre)', tier: 'both' },
  { name: 'Broadcast (Notices)', tier: 'both' },
  { name: 'App Health & Errors', tier: 'modern' },
  { name: 'Bookings', tier: 'legacy' },
  { name: 'F&B', tier: 'legacy' },
  { name: 'Transport', tier: 'legacy' },
  { name: 'Events', tier: 'legacy' },
  { name: 'Audit', tier: 'legacy' },
  { name: 'Mailroom', tier: 'legacy' },
  { name: 'Fitout', tier: 'legacy' },
  { name: 'Task Management', tier: 'legacy' },
  { name: 'Space Booking', tier: 'legacy' },
  { name: 'Directory', tier: 'legacy' },
  { name: 'Documents', tier: 'legacy' },
  { name: 'Fitness', tier: 'legacy' },
  { name: 'Inventory', tier: 'legacy' },
  { name: 'MOM', tier: 'legacy' },
  { name: 'Payments', tier: 'legacy' },
  { name: 'Wellness', tier: 'legacy' },
  { name: 'Breakdown', tier: 'legacy' },
  { name: 'Home & Navigation', tier: 'legacy' },
  { name: 'Other (Cab, Forgot Password, Bottom Nav)', tier: 'legacy' },
];

/** Event counts per sheet — 304 real events in total, no name overlap between the two. */
export const VI_MODERN_EVENTS = 128;
export const VI_LEGACY_EVENTS = 176;

/**
 * A module counts toward a tier if that sheet documents it — `both` counts toward each.
 *
 * KNOWN OFF-BY-ONE IN THE SOURCE. The list above yields 11 modern / 27 legacy / 8 dual-tracked.
 * The reference dashboard's prose instead says 28 legacy module labels and names NINE
 * dual-tracked modules — Tickets, mSafe, Business Card, Visitors, Broadcast, Vi Miles, Drawer &
 * Profile, App Support, Auth & Splash — but its own module list marks Authentication & Splash
 * as modern-only, which is where the extra one goes missing. These counts are computed from
 * the list rather than hardcoded from the prose, so the summary and the table below can never
 * disagree with each other; whether Auth & Splash is genuinely dual-tracked is a question for
 * whoever owns the workbook.
 */
export const viModernModuleCount = VI_MODULE_COVERAGE.filter(
  (m) => m.tier === 'modern' || m.tier === 'both',
).length;

export const viLegacyModuleCount = VI_MODULE_COVERAGE.filter(
  (m) => m.tier === 'legacy' || m.tier === 'both',
).length;

export const TIER_LABEL: Record<ViInstrumentationTier, string> = {
  modern: 'Modern',
  legacy: 'Legacy',
  both: 'Both',
};

/**
 * The catalogue disagrees with itself about which modules are instrumented, and the card says so
 * rather than silently picking a side — a coverage card that hides a known contradiction in its
 * own source is worse than no card.
 */
export const VI_COVERAGE_CAVEAT = {
  headline: 'The source catalogue contradicts itself on module coverage.',
  body:
    'The "Known Gaps" sheet states Task Management, Tasks/Assets, Payments, Book Parking, MOM, ' +
    'Documents and Inventory are "completely dark — no instrumentation of any kind, legacy or ' +
    'new." But the Legacy GA Events sheet directly contradicts this for most of them: Task ' +
    'Management alone has 12 real events (task_management_create/start/complete_success and ' +
    'their failure counterparts), and Payments, MOM, Documents and Inventory each have at least ' +
    'one real *_page_clicked event. Only Tasks/Assets and Book Parking (a sub-event of Bookings, ' +
    'not its own module) have genuinely zero rows in either sheet. This dashboard’s Task ' +
    'Create → Complete workflow on the Workflow Usage page is built from those 12 real Task ' +
    'Management events — treat the source’s internal inconsistency as unresolved, not as an ' +
    'error introduced here. Whoever built the workbook should confirm which claim is correct ' +
    'before either is treated as ground truth for a live build.',
};
