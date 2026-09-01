import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Which set of screens the action happened on. The same event name fires from both the
 * admin console and the employee portal — `surface` is what separates them, so a funnel
 * can be read per-surface or combined.
 */
export type GaSurface = "admin" | "employee";

/**
 * GA-parity click/outcome events for Visitor, Tickets (Helpdesk) and Booking.
 *
 * These names come from the existing GA event catalogue and are reproduced VERBATIM —
 * snake_case, and including `visitor_list_item_cliked`, whose typo is deliberate: the
 * catalogue keeps it so the historical GA series stays continuous. Do not "fix" it, and
 * do not rename any of these to match the Title Case convention used by the per-module
 * spec hooks (`useVisitorEvents`, `useHelpdeskEvents`, …) — those are a separate,
 * property-rich contract; this file is the click-funnel mirror of GA.
 */
export type GaFunnelEvent =
  // ── Visitor ───────────────────────────────────────────────────────────────
  | "visitors_page_clicked"
  | "visitor_create_button_clicked"
  | "visitor_create_button_success"
  | "visitor_create_button_failure"
  | "visitor_approve_button_clicked"
  | "visitor_reject_button_clicked"
  | "visitor_list_item_cliked" // sic — see the note above
  // ── Tickets / Helpdesk ────────────────────────────────────────────────────
  | "helpdesk_page_clicked"
  | "home_top_ftres_tickets_page_clicked"
  | "ticket_list_item_clicked"
  | "tickets_update_button_clicked"
  | "tickets_update_button_success"
  | "tickets_update_button_failure"
  | "tickets_comment_post_button_clicked"
  | "tickets_comment_post_button_success"
  | "tickets_comment_post_button_failure"
  | "tickets_reopen_button_clicked"
  | "tickets_reopen_button_success"
  | "tickets_reopen_button_failure"
  | "tickets_add_feedback_button_clicked"
  | "tickets_add_feedback_button_success"
  | "tickets_add_feedback_button_failure"
  // ── Booking ───────────────────────────────────────────────────────────────
  | "book_facility_page_clicked"
  | "book_facility_button_clicked"
  | "book_facility_button_success"
  | "book_facility_button_failure"
  | "book_seat_page_clicked"
  | "book_parking_page_clicked"
  | "space_management_book_space_confirm_button_clicked"
  | "space_management_book_space_confirm_button_success"
  | "my_bookings_list_item_clicked"
  | "my_booking_cancel_booking_button_clicked"
  | "my_booking_cancel_booking_button_success";

type Id = string | number | null | undefined;

export function useGaFunnelEvents() {
  const posthog = usePostHog();

  const getCommonContext = () => {
    const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
    const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
    const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
    const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
    const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
    const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
    const _orgId =
      localStorage.getItem("selectedOrgId") ??
      localStorage.getItem("organization_id") ??
      localStorage.getItem("org_id");
    const orgIdNum = _orgId && !isNaN(Number(_orgId)) ? Number(_orgId) : undefined;

    return {
      project_id: "P-223",
      project_code: "FM-01",
      site_id: siteIdNum,
      site_name: localStorage.getItem("selectedSiteName") ?? undefined,
      company_id: companyIdNum,
      company_name: localStorage.getItem("selectedCompany") ?? undefined,
      organization_id: orgIdNum,
      organization_name: localStorage.getItem("selectedOrg") ?? undefined,
      user_id: userIdNum,
    };
  };

  const track = (
    event: GaFunnelEvent,
    surface: GaSurface,
    props: Record<string, unknown> = {}
  ) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      // Lets "all GA funnel events" be one query even though each has its own name.
      ga_funnel: true,
      surface,
      ...getCommonContext(),
      ...props,
    });
  };

  /** Normalises whatever an API/axios error is into one short, groupable string. */
  const reasonOf = (error: unknown): string => {
    const e = error as { response?: { status?: number }; message?: string } | undefined;
    if (e?.response?.status) return `http_${e.response.status}`;
    return e?.message ?? "request_failed";
  };

  return {
    // ── Visitor ─────────────────────────────────────────────────────────────
    onVisitorsPageClicked: (surface: GaSurface) => track("visitors_page_clicked", surface),

    onVisitorCreateClicked: (surface: GaSurface, props?: { visitor_type?: string | null }) =>
      track("visitor_create_button_clicked", surface, {
        visitor_type: props?.visitor_type ?? null,
      }),

    onVisitorCreateSuccess: (
      surface: GaSurface,
      props?: { visitor_id?: Id; visitor_type?: string | null }
    ) =>
      track("visitor_create_button_success", surface, {
        visitor_id: props?.visitor_id ?? null,
        visitor_type: props?.visitor_type ?? null,
      }),

    onVisitorCreateFailure: (
      surface: GaSurface,
      props?: { visitor_type?: string | null; error?: unknown; failure_reason?: string }
    ) =>
      track("visitor_create_button_failure", surface, {
        visitor_type: props?.visitor_type ?? null,
        failure_reason: props?.failure_reason ?? reasonOf(props?.error),
      }),

    onVisitorApproveClicked: (surface: GaSurface, visitorId?: Id) =>
      track("visitor_approve_button_clicked", surface, { visitor_id: visitorId ?? null }),

    onVisitorRejectClicked: (surface: GaSurface, visitorId?: Id) =>
      track("visitor_reject_button_clicked", surface, { visitor_id: visitorId ?? null }),

    onVisitorListItemClicked: (surface: GaSurface, visitorId?: Id) =>
      track("visitor_list_item_cliked", surface, { visitor_id: visitorId ?? null }),

    // ── Tickets / Helpdesk ──────────────────────────────────────────────────
    onHelpdeskPageClicked: (surface: GaSurface) => track("helpdesk_page_clicked", surface),

    onHomeTopFeaturesTicketsClicked: (surface: GaSurface) =>
      track("home_top_ftres_tickets_page_clicked", surface),

    onTicketListItemClicked: (surface: GaSurface, ticketId?: Id) =>
      track("ticket_list_item_clicked", surface, { ticket_id: ticketId ?? null }),

    onTicketUpdateClicked: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_update_button_clicked", surface, { ticket_id: ticketId ?? null }),
    onTicketUpdateSuccess: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_update_button_success", surface, { ticket_id: ticketId ?? null }),
    onTicketUpdateFailure: (surface: GaSurface, ticketId?: Id, error?: unknown) =>
      track("tickets_update_button_failure", surface, {
        ticket_id: ticketId ?? null,
        failure_reason: reasonOf(error),
      }),

    onTicketCommentPostClicked: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_comment_post_button_clicked", surface, { ticket_id: ticketId ?? null }),
    onTicketCommentPostSuccess: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_comment_post_button_success", surface, { ticket_id: ticketId ?? null }),
    onTicketCommentPostFailure: (surface: GaSurface, ticketId?: Id, error?: unknown) =>
      track("tickets_comment_post_button_failure", surface, {
        ticket_id: ticketId ?? null,
        failure_reason: reasonOf(error),
      }),

    onTicketReopenClicked: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_reopen_button_clicked", surface, { ticket_id: ticketId ?? null }),
    onTicketReopenSuccess: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_reopen_button_success", surface, { ticket_id: ticketId ?? null }),
    onTicketReopenFailure: (surface: GaSurface, ticketId?: Id, error?: unknown) =>
      track("tickets_reopen_button_failure", surface, {
        ticket_id: ticketId ?? null,
        failure_reason: reasonOf(error),
      }),

    onTicketAddFeedbackClicked: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_add_feedback_button_clicked", surface, { ticket_id: ticketId ?? null }),
    onTicketAddFeedbackSuccess: (surface: GaSurface, ticketId?: Id) =>
      track("tickets_add_feedback_button_success", surface, { ticket_id: ticketId ?? null }),
    onTicketAddFeedbackFailure: (surface: GaSurface, ticketId?: Id, error?: unknown) =>
      track("tickets_add_feedback_button_failure", surface, {
        ticket_id: ticketId ?? null,
        failure_reason: reasonOf(error),
      }),

    // ── Booking ─────────────────────────────────────────────────────────────
    onBookFacilityPageClicked: (surface: GaSurface) =>
      track("book_facility_page_clicked", surface),
    onBookFacilityClicked: (surface: GaSurface, facilityId?: Id) =>
      track("book_facility_button_clicked", surface, { facility_id: facilityId ?? null }),
    onBookFacilitySuccess: (surface: GaSurface, props?: { facility_id?: Id; booking_id?: Id }) =>
      track("book_facility_button_success", surface, {
        facility_id: props?.facility_id ?? null,
        booking_id: props?.booking_id ?? null,
      }),
    onBookFacilityFailure: (
      surface: GaSurface,
      props?: { facility_id?: Id; error?: unknown; failure_reason?: string }
    ) =>
      track("book_facility_button_failure", surface, {
        facility_id: props?.facility_id ?? null,
        failure_reason: props?.failure_reason ?? reasonOf(props?.error),
      }),

    onBookSeatPageClicked: (surface: GaSurface) => track("book_seat_page_clicked", surface),
    onBookParkingPageClicked: (surface: GaSurface) => track("book_parking_page_clicked", surface),

    onSpaceBookConfirmClicked: (surface: GaSurface, props?: { seat_count?: number | null }) =>
      track("space_management_book_space_confirm_button_clicked", surface, {
        seat_count: props?.seat_count ?? null,
      }),
    onSpaceBookConfirmSuccess: (
      surface: GaSurface,
      props?: { booking_id?: Id; seat_count?: number | null }
    ) =>
      track("space_management_book_space_confirm_button_success", surface, {
        booking_id: props?.booking_id ?? null,
        seat_count: props?.seat_count ?? null,
      }),

    onMyBookingsListItemClicked: (surface: GaSurface, bookingId?: Id) =>
      track("my_bookings_list_item_clicked", surface, { booking_id: bookingId ?? null }),
    onMyBookingCancelClicked: (surface: GaSurface, bookingId?: Id) =>
      track("my_booking_cancel_booking_button_clicked", surface, {
        booking_id: bookingId ?? null,
      }),
    onMyBookingCancelSuccess: (surface: GaSurface, bookingId?: Id) =>
      track("my_booking_cancel_booking_button_success", surface, {
        booking_id: bookingId ?? null,
      }),
  };
}
