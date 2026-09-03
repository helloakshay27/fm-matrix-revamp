import { usePostHog } from '@posthog/react';
import { resolveClient } from '@/utils/posthogContext';

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? 'dev';

/**
 * Vi my Workspace workflow-funnel events — the exact names the Vi usage-analytics dashboard
 * queries (see features/vi-posthog-dashboard/data/workflows.ts, and the reference dashboard
 * `Vi_Dashboard_v1_FM_structure.html` it was taken from).
 *
 * WHY THIS IS A SEPARATE MODULE, AND WHY IT IS GATED
 * --------------------------------------------------
 * These names come from the Vi Flutter app's catalogue (`Vi_PostHog_Event_Catalogue_v2.xlsx`),
 * where they are emitted with `client = 'vi'`. This web app reports as `client = 'vi-web'`, so
 * the two generations sit side by side in one PostHog project and are told apart by `client`
 * alone — which is exactly why the same event names can safely be sent from here.
 *
 * They are NOT added to `useGaFunnelEvents`, and no name there is renamed to match: that
 * module's own header states its names are frozen because live GA reports resolve against
 * them. So `book_facility_button_success` keeps shipping for the GA funnel while
 * `book_facility_success` ships from here for the Vi dashboard. Both fire; neither breaks the
 * other.
 *
 * Every capture here is a no-op unless the host resolves to the Vi deployment. On FM Matrix,
 * Oman, Pulse or Club these screens are the same React components, and letting them emit Vi
 * catalogue events would put other tenants' traffic inside Vi's funnels — the dashboard has no
 * way to separate them again, because `client` would say `fm-matrix-web` while the event name
 * says Vi. Blocking at the source is the only place this can be got right.
 */

/** Screen the action happened on — mirrors the catalogue's own `screen` property. */
export type ViWorkflowScreen =
  | 'ticket_list'
  | 'ticket_create'
  | 'visitor_list'
  | 'visitor_create'
  | 'booking_list'
  | 'facility_booking_create'
  | 'space_booking_list'
  | 'space_booking_create'
  | 'event_create'
  | 'msafe_krcc'
  | 'msafe_training'
  | 'msafe_lmc';

/**
 * Every event name this module can send, grouped by the workflow it belongs to. Listing them
 * as a closed union means a typo is a compile error rather than a silently missing funnel step.
 */
export type ViWorkflowEvent =
  // ── Raise a Ticket (Helpdesk) ─────────────────────────────────────────────
  | 'tickets_raise_clicked'
  | 'tickets_create_viewed'
  | 'tickets_create_submitted'
  | 'tickets_create_succeeded'
  | 'tickets_create_failed'
  // ── Visitor Creation ──────────────────────────────────────────────────────
  | 'visitors_add_clicked'
  | 'visitors_create_viewed'
  | 'visitors_create_succeeded'
  | 'visitors_create_failed'
  // ── Facility Booking (legacy GA tier) ─────────────────────────────────────
  | 'book_facility_page_clicked'
  | 'book_facility_button_clicked'
  | 'book_facility_success'
  // ── Space / Seat Booking (legacy GA tier) ─────────────────────────────────
  | 'book_seat_page_clicked'
  | 'space_management_book_space_confirm_button_clicked'
  | 'space_management_book_space_success'
  // ── Event Creation (legacy GA tier) ───────────────────────────────────────
  | 'events_page_clicked'
  | 'event_create_button_clicked'
  | 'event_create_success'
  // ── mSafe — KRCC Submission ───────────────────────────────────────────────
  | 'msafe_krcc_form_viewed'
  | 'msafe_krcc_submitted'
  | 'msafe_krcc_succeeded'
  | 'msafe_krcc_failed'
  // ── mSafe — Training Submission ───────────────────────────────────────────
  | 'msafe_training_choice_selected'
  | 'msafe_training_submitted'
  | 'msafe_training_succeeded'
  // ── mSafe — Line Manager Connect Request ──────────────────────────────────
  | 'msafe_lmc_requests_opened'
  | 'msafe_lmc_request_created';

/**
 * Hook returning one named handler per event, so a call site never types a raw event string.
 *
 * The handlers are safe to call unconditionally from any tenant's build — see the gate below.
 */
export function useViWorkflowEvents() {
  const posthog = usePostHog();

  // Resolved once per mount rather than per capture: the hostname cannot change without a
  // full page load, and re-reading it on every click would be pure overhead.
  const isViDeployment = resolveClient() === 'vi-web';

  const track = (event: ViWorkflowEvent, props: Record<string, unknown> = {}) => {
    if (!isViDeployment) return;

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
    /* ---- Raise a Ticket (Helpdesk) ---- */
    onTicketRaiseClicked: (screen: ViWorkflowScreen = 'ticket_list') =>
      track('tickets_raise_clicked', { screen }),
    onTicketCreateViewed: () => track('tickets_create_viewed', { screen: 'ticket_create' }),
    /**
     * Fires AFTER client-side validation and BEFORE the network call, per the catalogue's own
     * convention — so submitted → succeeded measures server/network drop-off, and a validation
     * bounce is not counted as a submit that the server then lost.
     */
    onTicketCreateSubmitted: (props: { category?: string; priority?: string } = {}) =>
      track('tickets_create_submitted', { screen: 'ticket_create', ...props }),
    onTicketCreateSucceeded: (props: { ticket_id?: string | number } = {}) =>
      track('tickets_create_succeeded', { screen: 'ticket_create', ...props }),
    onTicketCreateFailed: (reason?: string) =>
      track('tickets_create_failed', { screen: 'ticket_create', failure_reason: reason }),

    /* ---- Visitor Creation ---- */
    onVisitorAddClicked: (screen: ViWorkflowScreen = 'visitor_list') =>
      track('visitors_add_clicked', { screen }),
    onVisitorCreateViewed: () => track('visitors_create_viewed', { screen: 'visitor_create' }),
    onVisitorCreateSucceeded: (props: { visitor_type?: string } = {}) =>
      track('visitors_create_succeeded', { screen: 'visitor_create', ...props }),
    onVisitorCreateFailed: (reason?: string) =>
      track('visitors_create_failed', { screen: 'visitor_create', failure_reason: reason }),

    /* ---- Facility Booking ---- */
    onBookFacilityPageClicked: () => track('book_facility_page_clicked', { screen: 'booking_list' }),
    onBookFacilityButtonClicked: () =>
      track('book_facility_button_clicked', { screen: 'facility_booking_create' }),
    onBookFacilitySuccess: (props: { facility_id?: string | number } = {}) =>
      track('book_facility_success', { screen: 'facility_booking_create', ...props }),

    /* ---- Space / Seat Booking ---- */
    onBookSeatPageClicked: () => track('book_seat_page_clicked', { screen: 'space_booking_list' }),
    onSpaceBookConfirmClicked: () =>
      track('space_management_book_space_confirm_button_clicked', {
        screen: 'space_booking_create',
      }),
    onSpaceBookSuccess: (props: { seat_count?: number } = {}) =>
      track('space_management_book_space_success', { screen: 'space_booking_create', ...props }),

    /* ---- Event Creation ---- */
    onEventsPageClicked: () => track('events_page_clicked', { screen: 'event_create' }),
    onEventCreateButtonClicked: () => track('event_create_button_clicked', { screen: 'event_create' }),
    onEventCreateSuccess: (props: { event_id?: string | number } = {}) =>
      track('event_create_success', { screen: 'event_create', ...props }),

    /* ---- mSafe — KRCC ---- */
    /**
     * `form_type` is the KRCC vehicle-type form. All seven forms report through this one event
     * per the catalogue, so the property is what separates them.
     */
    onKrccFormViewed: (props: { form_type?: string } = {}) =>
      track('msafe_krcc_form_viewed', { screen: 'msafe_krcc', ...props }),
    onKrccSubmitted: (props: { form_type?: string } = {}) =>
      track('msafe_krcc_submitted', { screen: 'msafe_krcc', ...props }),
    onKrccSucceeded: (props: { form_type?: string } = {}) =>
      track('msafe_krcc_succeeded', { screen: 'msafe_krcc', ...props }),
    onKrccFailed: (reason?: string) =>
      track('msafe_krcc_failed', { screen: 'msafe_krcc', failure_reason: reason }),

    /* ---- mSafe — Training ---- */
    onTrainingChoiceSelected: (props: { training_type?: string } = {}) =>
      track('msafe_training_choice_selected', { screen: 'msafe_training', ...props }),
    onTrainingSubmitted: (props: { training_type?: string } = {}) =>
      track('msafe_training_submitted', { screen: 'msafe_training', ...props }),
    onTrainingSucceeded: (props: { training_type?: string } = {}) =>
      track('msafe_training_succeeded', { screen: 'msafe_training', ...props }),

    /* ---- mSafe — Line Manager Connect ---- */
    onLmcRequestsOpened: () => track('msafe_lmc_requests_opened', { screen: 'msafe_lmc' }),
    /**
     * The catalogue gives this one event a `succeeded` property instead of a separate
     * success/failure pair, so a failed save is reported here too — not as a missing event.
     */
    onLmcRequestCreated: (props: { succeeded: boolean }) =>
      track('msafe_lmc_request_created', { screen: 'msafe_lmc', ...props }),
  };
}
