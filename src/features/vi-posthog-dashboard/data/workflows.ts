/**
 * Vi my Workspace — the real workflow catalogue behind Layer 3 (Workflow Usage).
 *
 * Names, bucket grouping and event step names are taken verbatim from
 * `Vi_Dashboard_v1_FM_structure.html`, which in turn takes them from
 * `Vi_PostHog_Event_Catalogue_v2.xlsx` — 128 modern events across 11 categories plus 176
 * legacy Google-Analytics events across 28 module labels, with zero name overlap between
 * the two sheets. Those names are the real, documented contract; the reference's own
 * adoption / completion / drop-off / avg-time numbers are NOT reproduced here — its footer
 * states outright that every number on it is illustrative sample data rather than a live
 * query, so this dashboard reads those from the API instead (see WorkflowSection).
 *
 * These events are emitted by the Vi my Workspace Flutter app (client = 'vi'), not by this
 * web app (client = 'vi-web') — see utils/posthogContext.ts. A workflow whose `steps` this
 * web app never sends is still listed: the dashboard reports the whole Vi tenant, and the
 * funnel card falls back to showing the declared steps as awaiting data rather than hiding
 * the workflow entirely.
 *
 * F&B Table Booking (`tableBooking`, food_* / food_and_beverages_* events) is deliberately
 * NOT in this list even though the reference carries it — that module does not exist in Vi
 * my Workspace, so a funnel for it could only ever read empty.
 */

/** Instrumentation generation the workflow's events come from. */
export type ViWorkflowTier = 'modern' | 'legacy';

export interface ViWorkflow {
  /** Stable key — also the selection value held in dashboard state. */
  key: string;
  name: string;
  /** Bucket tab this workflow sits under. Declaration order sets tab order. */
  bucket: string;
  /** Real catalogue event names, in funnel order. */
  steps: string[];
  tier: ViWorkflowTier;
  /**
   * How this workflow is queried against the workflow_usage endpoint.
   *
   * That endpoint does not take an event-step list — it takes `module` and `sub_module`, which
   * the server derives from real `$pathname` segments (segment 1 and segment 2). So these are
   * this app's actual Vi route segments, NOT the event-name prefixes: the Tickets funnel lives
   * at /maintenance/ticket, so it is `maintenance` / `ticket`. Querying module = 'tickets'
   * would match no path at all and every funnel would read empty.
   *
   * `null` means the Vi web app has no screen for this workflow (it is a mobile-only employee
   * flow). Those are deliberately not queried: omitting `module` makes the endpoint fall back
   * to its own maintenance/ticket default, which would print Helpdesk numbers under, say,
   * Business Card. WorkflowSection renders those as awaiting data instead.
   */
  apiModule: string | null;
  apiSubModule: string | null;
  /**
   * Caveat the catalogue itself records about this funnel — a step that fails silently, a
   * validation event that folds many blocking points into one, a flow that cannot actually
   * be completed on this build. Surfaced in the UI so the number is read with it.
   */
  caveat?: string;
}

export const VI_WORKFLOWS: ViWorkflow[] = [
  {
    key: 'ticketCreate',
    name: 'Raise a Ticket (Helpdesk)',
    bucket: 'Requests & Support',
    tier: 'modern',
    apiModule: 'maintenance',
    apiSubModule: 'ticket',
    steps: [
      'tickets_raise_clicked',
      'tickets_create_viewed',
      'tickets_create_submitted',
      'tickets_create_succeeded',
    ],
  },
  {
    key: 'supportCreate',
    name: 'Raise a Support Request (App Support)',
    bucket: 'Requests & Support',
    tier: 'modern',
    apiModule: null,
    apiSubModule: null,
    steps: [
      'support_viewed',
      'support_create_viewed',
      'support_create_submitted',
      'support_create_succeeded',
    ],
    caveat:
      "App Support (support_*) and Tickets/Helpdesk (tickets_*) are two separate helpdesks with their own screens and API, kept deliberately apart per the catalogue's own guidance even though both validate on the same 4 fields — merging them into one funnel would read plausibly and mean nothing. Only 2 of the 4 form fields (category, description) are actually enforced; issue-type and urgency validation is commented out in the provider, so support_create_validation_failed can only ever carry field=category or field=description.",
  },
  {
    key: 'krccSubmit',
    name: 'mSafe — KRCC Submission',
    bucket: 'Safety Compliance (mSafe)',
    tier: 'modern',
    apiModule: 'safety',
    apiSubModule: 'm-safe',
    steps: [
      'msafe_krcc_form_viewed',
      'msafe_krcc_submitted',
      'msafe_krcc_succeeded',
    ],
    caveat:
      'All seven KRCC vehicle-type forms validate through one shared event (msafe_krcc_validation_failed{field, form_type}) — 53 distinct blocking points across all seven forms are folded into this single event per the catalogue. A saved-as-draft path (msafe_krcc_saved_as_draft) also exists outside this funnel and is not counted as either a completion or a drop-off here.',
  },
  {
    key: 'trainingSubmit',
    name: 'mSafe — Training Submission',
    bucket: 'Safety Compliance (mSafe)',
    tier: 'modern',
    apiModule: 'safety',
    apiSubModule: 'm-safe',
    steps: [
      'msafe_training_choice_selected',
      'msafe_training_submitted',
      'msafe_training_succeeded',
    ],
  },
  {
    key: 'lmcRequest',
    name: 'mSafe — Line Manager Connect Request',
    bucket: 'Safety Compliance (mSafe)',
    tier: 'modern',
    apiModule: 'safety',
    apiSubModule: 'm-safe',
    steps: [
      'msafe_lmc_requests_opened',
      'msafe_lmc_request_created',
    ],
    caveat:
      "msafe_lmc_request_created carries a succeeded property rather than a separate success/failure event pair, so this funnel's completion rate already nets out failed saves inside one step, unlike the three-step submitted/succeeded/failed funnels elsewhere on this dashboard.",
  },
  {
    key: 'businessCardUpdate',
    name: 'Business Card — Edit & Save',
    bucket: 'Identity & Profile',
    tier: 'modern',
    apiModule: 'vi-business-card',
    apiSubModule: null,
    steps: [
      'business_card_edit_opened',
      'business_card_update_submitted',
      'business_card_update_succeeded',
    ],
  },
  {
    key: 'profileEdit',
    name: 'Edit Profile',
    bucket: 'Identity & Profile',
    tier: 'modern',
    apiModule: 'settings',
    apiSubModule: 'account',
    steps: [
      'profile_edit_viewed',
      'profile_edit_submitted',
      'profile_edit_succeeded',
    ],
    caveat:
      "The catalogue's Known Gaps sheet flags that Edit Profile cannot actually be submitted on Vi — the UPDATE button is wrapped in Offstage() for viRevamped. Expect profile_edit_viewed with no profile_edit_submitted behind it in practice; the completion rate above is illustrative sample data only and would be near-zero on a real query against this build.",
  },
  {
    key: 'passwordReset',
    name: 'Change Password',
    bucket: 'Identity & Profile',
    tier: 'modern',
    apiModule: 'settings',
    apiSubModule: 'account',
    steps: [
      'profile_password_otp_requested',
      'profile_password_otp_succeeded',
      'profile_reset_password_submitted',
    ],
    caveat:
      "On a non-200 OTP response the app shows no toast and does not navigate — profile_password_otp_failed is the ONLY signal a user hit this dead end silently. profile_reset_password_submitted has no paired _succeeded/_failed event in the catalogue (Change Password/Reset Password fail silently by design, per Known Gaps), so this funnel's terminal step is submission, not a confirmed outcome.",
  },
  {
    key: 'visitorCreate',
    name: 'Visitor Creation',
    bucket: 'Visitor & Travel Ops',
    tier: 'modern',
    apiModule: 'security',
    apiSubModule: 'visitor',
    steps: [
      'visitors_add_clicked',
      'visitors_create_viewed',
      'visitors_create_succeeded',
    ],
    caveat:
      "The intent half of this action (tapping Add Visitor) is already covered by the legacy visitor_create_button_clicked event, so the modern sheet only adds the outcome half (visitors_create_succeeded / _failed / _validation_failed) — this funnel blends one legacy and two modern events, which is the catalogue's own intended pairing, not a mixing error.",
  },
  {
    key: 'viMilesCheckIn',
    name: 'Vi Miles — Check-In / Check-Out',
    bucket: 'Visitor & Travel Ops',
    tier: 'modern',
    apiModule: 'safety',
    apiSubModule: 'vi-miles',
    steps: [
      'vi_miles_check_in_started',
      'vi_miles_check_in_submitted',
      'vi_miles_check_in_succeeded',
    ],
  },
  {
    key: 'vehicleRegistration',
    name: 'Vi Miles — Vehicle Registration',
    bucket: 'Visitor & Travel Ops',
    tier: 'modern',
    apiModule: 'safety',
    apiSubModule: 'vi-miles',
    steps: [
      'vi_miles_vehicle_registration_viewed',
      'vi_miles_vehicle_registered',
    ],
  },
  {
    key: 'facilityBooking',
    name: 'Facility Booking',
    bucket: 'Bookings & Facilities',
    tier: 'legacy',
    apiModule: 'vas',
    apiSubModule: 'booking',
    steps: [
      'book_facility_page_clicked',
      'book_facility_button_clicked',
      'book_facility_success',
    ],
  },
  {
    key: 'spaceBooking',
    name: 'Space / Seat Booking',
    bucket: 'Bookings & Facilities',
    tier: 'legacy',
    apiModule: 'vas',
    apiSubModule: 'space-management',
    steps: [
      'book_seat_page_clicked',
      'space_management_book_space_confirm_button_clicked',
      'space_management_book_space_success',
    ],
  },
  {
    key: 'taskManagement',
    name: 'Task Create → Complete',
    bucket: 'Field & Work Requests',
    tier: 'legacy',
    apiModule: null,
    apiSubModule: null,
    steps: [
      'task_management_create_button_clicked',
      'task_management_create_success',
      'task_management_complete_button_clicked',
      'task_management_complete_success',
    ],
    caveat:
      "The catalogue's own Known Gaps sheet lists Task Management as \"completely dark — no instrumentation of any kind.\" This directly contradicts the Legacy GA Events sheet, which carries 12 real Task Management events including this create/complete pair — see the footer disclosure for the full discrepancy. This funnel is built from those 12 real legacy events; treat the underlying data source's internal inconsistency as unresolved, not as an error introduced by this dashboard.",
  },
  {
    key: 'eventCreate',
    name: 'Event Creation',
    bucket: 'Field & Work Requests',
    tier: 'legacy',
    apiModule: null,
    apiSubModule: null,
    steps: [
      'events_page_clicked',
      'event_create_button_clicked',
      'event_create_success',
    ],
  },
];

/** Bucket tab order, taken from VI_WORKFLOWS declaration order. */
export const VI_BUCKETS: string[] = [...new Set(VI_WORKFLOWS.map((w) => w.bucket))];

export const workflowsInBucket = (bucket: string): ViWorkflow[] =>
  VI_WORKFLOWS.filter((w) => w.bucket === bucket);

export const findWorkflow = (key: string): ViWorkflow =>
  VI_WORKFLOWS.find((w) => w.key === key) ?? VI_WORKFLOWS[0];
