import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Business-lifecycle events for Helpdesk (Ticket) — see the Helpdesk (Ticket)
 * Event Catalogue (Object Verb, past tense; NOT UI clicks). Screen-level usage
 * events ("Ticket Create Form Opened", filters, search) live separately in
 * useTicketEvents / PostHogTicketActivity.
 *
 * ticket_id is stamped on every event as the join key. SLA-clock events
 * (Response/Resolution TAT) and timer-driven escalation are emitted server-side
 * where the authoritative timestamps live.
 */
export function useHelpdeskEvents() {
  const posthog = usePostHog();

  const capture = (event: string, ticketId: string | number | null, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      ticket_id: ticketId,
      ...props,
    });
  };

  return {
    onTicketCreated: (
      ticketId: string | number | null,
      props: {
        ticket_type?: string | null;
        on_behalf_of?: string | null;
        category?: string | number | null;
        sub_category?: string | number | null;
        mode?: string | number | null;
        identification?: "proactive" | "reactive" | null;
        priority?: string | null;
        severity?: string | null;
        creation_source?: string | null;
        is_golden_ticket: boolean;
        is_flagged: boolean;
        has_attachments: boolean;
        vendor_assigned: boolean;
        linked_asset_id?: string | number | null;
      }
    ) => capture("Ticket Created", ticketId, props),

    onTicketAssigned: (
      ticketId: string | number | null,
      props: {
        assignee_type?: string | null;
        is_reassignment: boolean;
        assignment_sequence?: number | null;
        time_since_created_sec?: number | null;
      }
    ) => capture("Ticket Assigned", ticketId, props),

    onTicketStatusChanged: (
      ticketId: string | number | null,
      props: {
        from_status: string | null;
        to_status: string | null;
        changed_by_role?: string | null;
        time_in_previous_status_sec?: number | null;
      }
    ) => capture("Ticket Status Changed", ticketId, props),

    onTicketCostFlagged: (
      ticketId: string | number | null,
      props: { estimated_cost?: number | string | null; category?: string | number | null }
    ) => capture("Ticket Cost Flagged", ticketId, props),

    onTicketCostApprovalDecided: (
      ticketId: string | number | null,
      props: { decision: "approved" | "rejected" | string; approver_role?: string | null; approval_cycle_time_sec?: number | null }
    ) => capture("Ticket Cost Approval Decided", ticketId, props),

    onTicketCommentAdded: (
      ticketId: string | number | null,
      props: { comment_channel: "internal" | "customer"; used_template: boolean; has_attachment: boolean }
    ) => capture("Ticket Comment Added", ticketId, props),

    onTicketResolutionRecorded: (
      ticketId: string | number | null,
      props: {
        resolution_outcome?: string | null;
        closure_completeness_score?: number | null;
        has_root_cause: boolean;
        has_preventive_action: boolean;
        has_corrective_action: boolean;
        review_date_set: boolean;
      }
    ) => capture("Ticket Resolution Recorded", ticketId, props),

    onTicketEscalated: (
      ticketId: string | number | null,
      props: { escalation_clock?: "response" | "resolution" | null; escalation_level?: string | null; is_golden_ticket_track?: boolean }
    ) => capture("Ticket Escalated", ticketId, props),

    onTicketReopened: (
      ticketId: string | number | null,
      props: { reopen_count?: number | null; days_since_closure?: number | null; reopened_by_role?: string | null }
    ) => capture("Ticket Reopened", ticketId, props),

    onTicketFlaggedGoldenMarked: (
      ticketId: string | number | null,
      markerType: "flag" | "golden_ticket" | string
    ) => capture("Ticket Flagged / Golden Ticket Marked", ticketId, { marker_type: markerType }),
  };
}
