import { usePostHog } from "@posthog/react";
import { captureCMEvent } from "@/utils/posthogHelpers";

/**
 * Central Club Management product-analytics event catalogue.
 *
 * Use this hook on every Club Management screen instead of calling the capture
 * helpers directly — it keeps event names and the CM-01/P-238 context consistent
 * across all ~15 Club Management modules. Module labels are the catalogue names
 * ("Membership", "Staff", "Occupant", "Guest", "Class Setup", "Amenity Booking",
 * "Notice", "Event", "Payment", "Vendor", "Community", "Invoice", "Credit Note",
 * "Debit Note", "Wallet").
 *
 * All event payloads stay aggregate-friendly: IDs and safe metadata only — never
 * passwords, tokens, or full free-text content bodies.
 */
export function useClubManagementEvents() {
  const posthog = usePostHog();

  const capture = (event: string, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    captureCMEvent(event, props);
  };

  return {
    /** One-shot page/section view. Call inside the list-view effect (guard against re-fires). */
    listViewed: (module: string, screen: string, props: Record<string, unknown> = {}) =>
      capture(`${module} List Viewed`, { module, screen, ...props }),

    /** Single-row read view. Call once after the detail data has loaded. */
    detailViewed: (
      module: string,
      id: string | number | undefined,
      screen: string,
      props: Record<string, unknown> = {}
    ) => capture(`${module} Viewed`, { module, entity_id: id, screen, ...props }),

    /** Debounced search (pass the debounced query, not every keystroke). */
    searched: (
      module: string,
      query: string,
      screen: string,
      props: Record<string, unknown> = {}
    ) =>
      capture(`${module} Search Performed`, {
        module,
        search_term: query,
        screen,
        ...props,
      }),

    /** Filter dialog/panel apply action (not per state-change). */
    filtered: (
      module: string,
      screen: string,
      filterSummary: Record<string, unknown>,
      props: Record<string, unknown> = {}
    ) =>
      capture(`${module} Filter Applied`, {
        module,
        screen,
        filter_count: Object.keys(filterSummary).length,
        ...filterSummary,
        ...props,
      }),

    /** Filter reset/clear-all action. */
    filtersReset: (module: string, screen: string, props: Record<string, unknown> = {}) =>
      capture(`${module} Filter Reset`, { module, screen, ...props }),

    /** Excel/PDF/print export, fired only after the export succeeded. */
    exported: (
      module: string,
      format: string,
      rowCount: number | undefined,
      screen: string,
      props: Record<string, unknown> = {}
    ) =>
      capture(`${module} Exported`, {
        module,
        file_format: format,
        row_count: rowCount,
        screen,
        ...props,
      }),

    /** Entity creation, fired only after the API call succeeded. */
    created: (
      module: string,
      id: string | number | undefined,
      screen: string,
      props: Record<string, unknown> = {}
    ) => capture(`${module} Created`, { module, entity_id: id, screen, ...props }),

    /** Entity update, fired only after the API call succeeded. */
    updated: (
      module: string,
      id: string | number | undefined,
      screen: string,
      props: Record<string, unknown> = {}
    ) => capture(`${module} Updated`, { module, entity_id: id, screen, ...props }),

    /** Entity deletion/removal, fired only after the API call succeeded. */
    deleted: (
      module: string,
      id: string | number | undefined,
      screen: string,
      props: Record<string, unknown> = {}
    ) => capture(`${module} Deleted`, { module, entity_id: id, screen, ...props }),

    /** Status/workflow change (activate, cancel, confirm, publish, pay, …) after success. */
    statusChanged: (
      module: string,
      id: string | number | undefined,
      props: Record<string, unknown> = {}
    ) => capture(`${module} Status Changed`, { module, entity_id: id, ...props }),

    /** Anything module-specific that does not fit the generic verbs. */
    action: (event: string, props: Record<string, unknown> = {}) => capture(event, props),
  };
}