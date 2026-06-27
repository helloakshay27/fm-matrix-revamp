import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export function useTicketEvents() {
  const posthog = usePostHog();

  const capture = (event: string, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      ...props,
    });
  };

  return {
    onHelpdeskViewed: (screen: "ticket_list" | "ticket_analytics") =>
      capture("Helpdesk Viewed", { screen }),

    onTicketCreateFormOpened: (entryPoint: string) =>
      capture("Ticket Create Form Opened", {
        screen: "ticket_list",
        entry_point: entryPoint,
      }),

    onTicketDetailOpened: (ticketId: string | number, source: string) =>
      capture("Ticket Detail Opened", {
        screen: "ticket_list",
        open_source: source,
        ticket_id: ticketId,
      }),

    onFilterApplied: (filtersUsed: string[], filterCount: number) =>
      capture("Ticket Filter Applied", {
        screen: "ticket_list",
        filters_used: filtersUsed,
        filter_count: filterCount,
      }),

    onSearchPerformed: (queryLength: number, resultCount: number) =>
      capture("Ticket Search Performed", {
        screen: "ticket_list",
        query_length: queryLength,
        result_count: resultCount,
        returned_zero: resultCount === 0,
      }),
  };
}
