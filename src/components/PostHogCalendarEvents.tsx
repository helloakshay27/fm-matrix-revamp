import { usePostHog } from '@posthog/react';
import { resolveClient } from '@/utils/posthogContext';

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? 'dev';

/**
 * Calendar App catalogue events — the exact names the Calendar usage-analytics dashboard
 * queries (see features/calendar-posthog-dashboard/data/constants.ts, and the reference
 * wireframe `Calendar_Dashboard_v1_FM_structure.html` it was built from).
 *
 * WHAT THIS INSTRUMENTS
 * ---------------------
 * The Unified Calendar at `/employee/calendar` (components/employee/EmployeeUnifiedCalendar).
 * That is FM Matrix's calendar module: a month/week/day/schedule grid over tasks, tickets,
 * meetings, facility bookings and synced Google Calendar events, with a create-event modal and
 * a Google account connect/sync action.
 *
 * WHY THE NAMES LOOK LIKE A MOBILE APP'S
 * --------------------------------------
 * They are one. `Calendar_App_PostHog_Events.xlsx` is a single flat sheet of 83 events across
 * 16 categories belonging to a separate personal-productivity Calendar app, and the dashboard
 * was built against it. Sending the same names from here is the same arrangement
 * `PostHogViWorkflowEvents` already runs for the Vi catalogue: two generations of one product
 * reporting into one PostHog project, told apart by the `client` super-property alone.
 *
 * ⚠️ READ THIS BEFORE QUERYING
 * ----------------------------
 * Unlike Vi, this catalogue names NO tenant/client value of its own — the dashboard's own
 * footer says so, and says to confirm it with engineering before querying. Until the mobile
 * app's `client` value is known, every query behind that dashboard MUST filter on `client` (web
 * traffic arrives as `fm-matrix-web` / `vi-web` / `oman-web` / … — see utils/posthogContext)
 * or web and mobile numbers will be summed into one meaningless total. Nothing here can fix
 * that for the consumer; it can only be stated.
 *
 * WHY THIS IS NOT HOST-GATED
 * --------------------------
 * `PostHogViWorkflowEvents` refuses to fire outside the Vi deployment because the Vi mobile app
 * already owns those names under `client = 'vi'`, and a stray FM Matrix event would land inside
 * a live Vi funnel with no way to separate it again. Here there is no such collision: the
 * calendar module is the same component for every tenant, no mobile client value is in play
 * yet, and `client` already separates whatever arrives. Gating would just make the dashboard
 * empty for every tenant but one.
 *
 * WHAT THE WEB CALENDAR CANNOT SOURCE
 * -----------------------------------
 * These catalogue events have no equivalent on this screen and are deliberately absent, so a
 * funnel step reading zero from web traffic is expected rather than a broken capture:
 *
 *   event_create_type_selected   no event/task/reminder picker — web creates events only
 *   event_create_colour_selected no colour picker in the create modal
 *   oauth_cancelled              OAuth runs in a `window.open` tab; this app never sees the
 *                                cancel, so the connect funnel's real drop-off signal is blind
 *   event_menu_opened,           the detail modal is read-only — no overflow menu, no edit or
 *   event_menu_action_selected,  delete path on this screen
 *   event_deleted
 *   login_*, logout_*,           authentication lives outside the calendar module
 *   password_reset_*
 *   booking_slot_saved,          no Customise Slot, Propose Time or Assistant surface exists
 *   propose_time_sent,           in FM Matrix
 *   assistant_*
 *   app_launched                 web session start is `$pageview` (see PostHogPageView), not a
 *                                catalogue lifecycle event
 *
 * `location_selected` is likewise absent: FM Matrix's location field is a plain text input, not
 * the catalogue's Location Search flow. Per the catalogue, a location interaction on the create
 * screen is `event_create_field_tapped{field:'location'}` — which is what this module sends.
 */

/** Screen the action happened on — mirrors the catalogue's own `screen` property. */
export type CalendarScreen = 'calendar_home' | 'event_create';

/**
 * Every event name this module can send. A closed union means a typo is a compile error
 * rather than a silently missing funnel step.
 */
export type CalendarEvent =
  // ── Create Event (the catalogue's one full-depth funnel) ──────────────────
  | 'calendar_fab_tapped'
  | 'event_create_field_tapped'
  | 'event_create_duration_selected'
  | 'event_created'
  | 'event_create_failed'
  // ── Calendar Accounts ─────────────────────────────────────────────────────
  | 'calendar_connect_prompt_accepted'
  | 'calendar_account_connected'
  // ── Add People ────────────────────────────────────────────────────────────
  | 'add_people_confirmed';

/**
 * Fields the create-event form can report. The catalogue is explicit that
 * `event_create_field_tapped{field}` is ONE event covering every field rather than one event
 * per field, so this union is the property, not a set of event names.
 */
export type EventCreateField =
  | 'title'
  | 'people'
  | 'location'
  | 'description'
  | 'date'
  | 'time';

/** Where the create-event modal was opened from. */
export type CreateEventSource = 'date_click' | 'range_select';

export function useCalendarEvents() {
  const posthog = usePostHog();

  // Resolved once per mount: the hostname cannot change without a full page load.
  const client = resolveClient();

  const track = (event: CalendarEvent, props: Record<string, unknown> = {}) => {
    const readId = (...keys: string[]): number | undefined => {
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw && !Number.isNaN(Number(raw))) return Number(raw);
      }
      return undefined;
    };

    posthog?.capture(event, {
      platform: 'web',
      release_version: RELEASE_VERSION,
      // The catalogue documents no automatic screen tracking, so every breakdown groups by an
      // explicit `screen` stamped at the call site. Defaulted here, overridden per helper.
      screen: 'calendar_home',
      module: 'calendar',
      client,
      site_id: readId('selectedSiteId', 'site_id'),
      site_name: localStorage.getItem('selectedSiteName') ?? undefined,
      company_id: readId('selectedCompanyId', 'company_id'),
      company_name: localStorage.getItem('selectedCompany') ?? undefined,
      organization_id: readId('selectedOrgId', 'organization_id', 'org_id'),
      user_id: readId('userId', 'user_id'),
      ...props,
    });
  };

  return {
    /* ---- Create Event funnel ---- */

    /**
     * Step 1 — the create-event entry point, and the funnel's denominator. Named for the
     * mobile FAB it maps to; on web the equivalent gesture is clicking or dragging a slot on
     * the grid, which `source` distinguishes.
     */
    onCreateEventOpened: (source: CreateEventSource) =>
      track('calendar_fab_tapped', { screen: 'calendar_home', source }),

    /**
     * Step 3 — a field interaction inside the create form. Fires on focus, once per field per
     * time the modal is open: the funnel asks whether the user engaged with the form at all,
     * and re-firing on every keystroke would turn one user into hundreds of step hits.
     */
    onCreateFieldTapped: (field: EventCreateField) =>
      track('event_create_field_tapped', { screen: 'event_create', field }),

    /**
     * Step 4 — the user set the event's length, either by editing the end time or by flipping
     * it to all-day. `all_day` says which, so the two are separable downstream.
     */
    onCreateDurationSelected: (props: { all_day: boolean; duration_minutes?: number }) =>
      track('event_create_duration_selected', { screen: 'event_create', ...props }),

    /** Terminal success — the event exists on the connected calendar. */
    onEventCreated: (props: { all_day?: boolean; invitee_count?: number } = {}) =>
      track('event_created', { screen: 'event_create', ...props }),

    /**
     * The funnel's real failure branch. `reason` carries both client-side validation bounces
     * and server rejections — the catalogue's `event_create_failed{reason}` is one event with a
     * reason property, not a pair, so splitting them here would invent a name.
     */
    onEventCreateFailed: (reason: string) =>
      track('event_create_failed', { screen: 'event_create', failure_reason: reason }),

    /* ---- Add People ---- */

    /**
     * Fires once at submit with the final headcount, not once per attendee added: the
     * catalogue describes this as "invitee_count on confirm", and per-attendee firing would
     * report one 5-guest meeting as five separate reaches.
     */
    onAddPeopleConfirmed: (invitee_count: number) =>
      track('add_people_confirmed', { screen: 'event_create', invitee_count }),

    /* ---- Calendar Accounts ---- */

    /**
     * The user accepted the connect prompt and the OAuth tab was opened. This is the connect
     * funnel's first step; whether they finish is only observable on the next sync, because
     * the OAuth tab never reports back here (see `oauth_cancelled` in the header note).
     */
    onConnectPromptAccepted: (provider = 'google') =>
      track('calendar_connect_prompt_accepted', { screen: 'calendar_home', provider }),

    /**
     * Terminal success for the connect funnel — an account is confirmed connected. `provider`
     * is the real catalogue property the dashboard's Provider filter and Provider-wise
     * breakdown both read.
     */
    onAccountConnected: (provider = 'google') =>
      track('calendar_account_connected', { screen: 'calendar_home', provider }),
  };
}
