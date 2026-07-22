import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type GatePassDirection = "inward" | "outward";
export type GatePassScreen =
  | "gatepass_inwards_list"
  | "gatepass_outwards_list"
  | "gatepass_create"
  | "gatepass_detail";

/**
 * Event/property contract for the Gate Pass module — see
 * "09 Requirements/Gate Pass - Product-Flow Analytics Spec.md".
 * Same event names & property domains fire on web and mobile; this hook
 * only stamps the web-side properties (platform, release_version).
 */
export function useGatePassEvents() {
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
    // F4 · Findability & Review
    onGatePassListViewed: (direction: GatePassDirection, resultCount: number) =>
      capture("Gate Pass List Viewed", {
        screen: direction === "inward" ? "gatepass_inwards_list" : "gatepass_outwards_list",
        direction,
        result_count: resultCount,
      }),

    onGatePassSearchPerformed: (
      direction: GatePassDirection,
      queryLength: number,
      resultCount: number
    ) =>
      capture("Gate Pass Search Performed", {
        screen: direction === "inward" ? "gatepass_inwards_list" : "gatepass_outwards_list",
        query_length: queryLength,
        returned_zero: resultCount === 0,
      }),

    onGatePassFlagToggled: (direction: GatePassDirection, flagged: boolean) =>
      capture("Gate Pass Flag Toggled", {
        screen: direction === "inward" ? "gatepass_inwards_list" : "gatepass_outwards_list",
        direction,
        flagged,
      }),

    onGatePassDetailViewed: (
      tab: "profile" | "details" | "attachments",
      openSource: string
    ) =>
      capture("Gate Pass Detail Viewed", {
        screen: "gatepass_detail",
        tab,
        open_source: openSource,
      }),

    // F5 · Register Export
    onGatePassRegisterExported: (
      direction: GatePassDirection,
      rowCount: number,
      afterFilter: boolean
    ) =>
      capture("Gate Pass Register Exported", {
        screen: direction === "inward" ? "gatepass_inwards_list" : "gatepass_outwards_list",
        direction,
        row_count: rowCount,
        after_filter: afterFilter,
      }),

    // F1/F2 · Pass Creation funnel
    onGatePassFormOpened: (direction: GatePassDirection, entrySource: string) =>
      capture("Gate Pass Form Opened", {
        screen: "gatepass_create",
        direction,
        entry_source: entrySource,
      }),

    onGatePassSectionCompleted: (
      section: "visitor" | "pass" | "items",
      sectionIndex: number
    ) =>
      capture("Gate Pass Section Completed", {
        screen: "gatepass_create",
        section,
        section_index: sectionIndex,
      }),

    onGatePassItemRowAdded: (rowIndex: number, itemType?: string | number | null) =>
      capture("Gate Pass Item Row Added", {
        screen: "gatepass_create",
        row_index: rowIndex,
        item_type: itemType ?? null,
      }),

    onGatePassReturnableStatusSet: (
      goodsType: "returnable" | "non_returnable",
      expectedReturnDateSet: boolean
    ) =>
      capture("Gate Pass Returnable Status Set", {
        screen: "gatepass_create",
        goods_type: goodsType,
        expected_return_date_set: expectedReturnDateSet,
      }),

    onGatePassSubmitted: (direction: GatePassDirection, props: Record<string, unknown>) =>
      capture("Gate Pass Submitted", {
        screen: "gatepass_create",
        direction,
        ...props,
      }),

    onGatePassFormAbandoned: (
      direction: GatePassDirection,
      lastSection: string,
      rowsAdded: number,
      timeOnFormSec: number
    ) =>
      capture("Gate Pass Form Abandoned", {
        screen: "gatepass_create",
        direction,
        last_section: lastSection,
        rows_added: rowsAdded,
        time_on_form_sec: timeOnFormSec,
      }),

    // F3 · Returnable Closure (Handover) — open-loop headline metric
    onGatePassHandoverOpened: (passId: string | number, itemId: string | number) =>
      capture("Gate Pass Handover Opened", {
        screen: "gatepass_detail",
        pass_id: passId,
        item_id: itemId,
      }),

    // Client mirror of the server-side handover receipt event; keep the name
    // identical to the server event per the standardisation contract.
    onGatePassItemHandoverRecorded: (props: {
      pass_id: string | number;
      item_id: string | number;
      received_date?: string;
      has_attachment: boolean;
      has_remarks: boolean;
    }) => capture("Gate Pass Item Handover Recorded", props),
  };
}
