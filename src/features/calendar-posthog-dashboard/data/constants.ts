/**
 * Static catalogue data behind the Calendar analytics dashboard.
 *
 * MODULE NAMES, BUCKET GROUPING and every `steps[]` event name are real — taken verbatim
 * from the single sheet of `Calendar_App_PostHog_Events.xlsx` (83 events across 16
 * categories, View/Action/Failure typed; one flat catalogue, no modern/legacy split).
 *
 * Every NUMBER now comes from the API (see api/queries.ts). The wireframe's seeded sample
 * series — active-user curves, per-workflow adoption/completion rates, a registered-account
 * ceiling, a provider list — have been deleted rather than kept as fallbacks: a dashboard
 * that silently swaps invented numbers in when a call fails is worse than one that says the
 * call failed, which is what `Guard` does instead.
 */

/**
 * Platform filter.
 *
 * The wireframe split iOS / Android because it described a mobile app. The
 * `/fm/adoption/*` endpoints take `device_type` as `Desktop` / `Mobile` only — there is no
 * iOS/Android dimension to query — and what is instrumented today is the web calendar module.
 * So the toggle reports what the API can actually filter by. See api/adoptionApi.ts.
 */
export type Device = 'all' | 'desktop' | 'mobile';
export type DateRange = 7 | 30 | 90;

export const RANGE_LABELS: Record<DateRange, string> = {
  7: 'Last 7 days',
  30: 'Last 30 days',
  90: 'Last 90 days',
};

/**
 * KPI targets, keyed by the metric ids the shared builders emit.
 *
 * Deliberately empty. The wireframe seeded suggested targets (280 active users, 18% bounce,
 * and so on), but those were invented numbers, and a tile that stamps "✓ on target" on a live
 * metric by comparing it against a hardcoded constant is reporting a verdict nobody set.
 * Every tile therefore starts at "set a target" and only judges against a threshold the
 * viewer has actually entered.
 *
 * Populate this map if the business ever agrees real targets per metric.
 */
export const BM_DEFAULTS: Record<string, number> = {};

/** 83 events across 16 categories in the single Calendar App PostHog Events sheet. */
export const TOTAL_REAL_EVENTS = 83;

export interface Workflow {
  /** Stable key — also the selection value held in dashboard state. */
  key: string;
  name: string;
  /** Bucket tab this workflow sits under. Declaration order sets tab order. */
  bucket: string;
  /** Real catalogue event names, in funnel order. */
  steps: string[];
  /**
   * How this workflow is queried against the `workflow_usage` endpoint.
   *
   * That endpoint does not take an event-step list — it takes `module` and `sub_module`,
   * which the server derives from real `$pathname` segments (segment 1 and segment 2). So
   * these are this app's actual route segments, NOT the catalogue's event-name prefixes:
   * the calendar lives at `/employee/calendar`, so it is `employee` / `calendar`.
   *
   * `null` means this app has no web screen for the workflow. Those are deliberately not
   * queried: omitting `module` makes the endpoint fall back to its own maintenance/ticket
   * default, which would print Helpdesk numbers under, say, Password Reset. WorkflowSection
   * renders those as awaiting data instead.
   */
  apiModule: string | null;
  apiSubModule: string | null;
  /**
   * Caveat the catalogue itself records about this funnel — a failure branch that is not a
   * step, an event that folds many actions into one, a drop-off signal this app cannot see.
   * Surfaced in the UI so the number is read with it.
   */
  incompleteNote?: string;
}

/**
 * 4 workflow-bearing modules (of the 16 tracked) grouped into 3 buckets, 6 real workflows.
 *
 * Per an explicit product decision, Workflow Usage concentrates depth on ONE primary funnel
 * — `eventCreate` — rather than giving every sub-flow its own multi-step funnel. Add People,
 * Booking Slots, Location Search, Propose Time and Assistant Voice are real, catalogue-sourced
 * flows surfaced as reach/adoption reference cards instead; none is disabled or dead code,
 * they are simply out of scope for full-funnel depth in this pass.
 *
 * ⚠️ `eventCreate` and `accountConnect` share one route — both happen on `/employee/calendar`
 * — so both query `employee` / `calendar` and the endpoint returns the SAME path-derived
 * funnel for each. The endpoint infers steps from URL patterns, not from the catalogue event
 * names listed here; `PostHogCalendarEvents` now emits the real step events, and once the
 * backend groups on those the two funnels separate. Until then, read the funnel card as
 * "activity on the calendar screen", not as the specific flow named on the tab.
 */
export const WORKFLOWS: Workflow[] = [
  {
    key: 'login', name: 'Login', bucket: 'Identity & Access',
    steps: ['login_attempted', 'login_success'],
    // Authentication happens outside the calendar module and is not instrumented by it.
    apiModule: null, apiSubModule: null,
    incompleteNote:
      'login_failed{reason} is the real failure branch for this funnel — a rejected sign-in attempt, not counted toward login_success. password_visibility_toggled and forgot_password_link_tapped are real events on the same screen but are secondary UI interactions, not funnel steps.',
  },
  {
    key: 'passwordReset', name: 'Password Reset', bucket: 'Identity & Access',
    steps: ['forgot_password_link_tapped', 'password_reset_otp_requested', 'password_reset_completed'],
    apiModule: null, apiSubModule: null,
  },
  {
    key: 'signOut', name: 'Sign Out', bucket: 'Identity & Access',
    steps: ['settings_sign_out_requested', 'settings_sign_out_confirmed', 'logout_success'],
    apiModule: null, apiSubModule: null,
    incompleteNote:
      'settings_sign_out_cancelled is the real drop-off branch — the user opened the confirm dialog and backed out. settings_sign_out_confirmed only triggers the actual logout call; logout_success is a separate event and the true terminal step of this funnel, tracked on its own per the catalogue.',
  },
  {
    key: 'accountConnect', name: 'Connect Calendar Account', bucket: 'Calendar Setup',
    steps: ['calendar_connect_prompt_accepted', 'calendar_account_connected'],
    apiModule: 'employee', apiSubModule: 'calendar',
    incompleteNote:
      'calendar_connect_prompt_dismissed ("Not now") and oauth_cancelled (backing out of the OAuth web view before completing) are the two real drop-off signals for this funnel — oauth_cancelled is explicitly documented as a drop-off signal for the connect flow. On web the OAuth tab never reports back, so that drop-off is currently blind. Both steps ARE instrumented (see PostHogCalendarEvents), but this card reads the endpoint\'s path-derived funnel for /employee/calendar until the backend groups on the catalogue event names.',
  },
  {
    key: 'eventCreate', name: 'Create Event', bucket: 'Event Management',
    steps: [
      'calendar_fab_tapped', 'event_create_type_selected', 'event_create_field_tapped',
      'event_create_duration_selected', 'event_create_colour_selected', 'event_created',
    ],
    apiModule: 'employee', apiSubModule: 'calendar',
    incompleteNote:
      'This is the one funnel this dashboard gives full multi-step depth, per an explicit product decision. Four of the six steps are instrumented on web (calendar_fab_tapped, event_create_field_tapped, event_create_duration_selected, event_created); event_create_type_selected and event_create_colour_selected have no web equivalent — there is no type or colour picker — so those steps read empty from web traffic by design. event_create_failed{reason} is the real failure branch and is instrumented.',
  },
  {
    key: 'eventEditDelete', name: 'Edit / Delete Event', bucket: 'Event Management',
    steps: ['event_menu_opened', 'event_menu_action_selected', 'event_deleted'],
    // The web detail modal is read-only — no overflow menu, no edit or delete path.
    apiModule: null, apiSubModule: null,
    incompleteNote:
      'event_menu_action_selected{action} covers every overflow-menu choice (e.g. delete, duplicate, share) in one event, not one event per action — this funnel follows only the delete path through to event_deleted (or event_delete_failed{reason} as the failure branch). The FM Matrix web calendar has no edit or delete UI, so nothing feeds this funnel from web traffic.',
  },
];

export function findWorkflow(key: string): Workflow {
  return WORKFLOWS.find((w) => w.key === key) ?? WORKFLOWS[0];
}

/** Buckets in declaration order — the Workflow Usage tab order. */
export const WORKFLOW_BUCKETS = [...new Set(WORKFLOWS.map((w) => w.bucket))];

/**
 * The calendar module's real route segments, as `/employee/calendar`.
 *
 * The analytics API derives Layer-3 scoping from `$pathname` segments, so these are the two
 * values every path-scoped query is built from — `modules?module=employee` to get the calendar
 * row, and `workflow_usage?module=employee&sub_module=calendar` for the funnel.
 */
export const CALENDAR_MODULE = 'employee';
export const CALENDAR_SUB_MODULE = 'calendar';
