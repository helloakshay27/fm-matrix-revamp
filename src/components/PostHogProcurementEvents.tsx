import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type PrType = "material" | "service";
export type ProcurementScreen =
  | "material_pr_list"
  | "material_pr_create"
  | "service_pr_list"
  | "service_pr_create"
  | "po_list"
  | "po_create"
  | "wo_list"
  | "wo_create"
  | "grn_list"
  | "grn_create"
  | "invoices_list"
  | "auto_saved_pr"
  | "procurement_approvals"
  | "deletion_requests"
  | "deleted_prs";
export type PrSection = "supplier" | "items" | "attachments";
export type ProcurementDocType = "material_pr" | "service_pr" | "po" | "grn";

/**
 * Event/property contract for the Procurement module — see
 * "09 Requirements/Procurement - Product-Flow Analytics Spec.md".
 * Same event names & property domains fire on web and mobile; this hook stamps
 * the web-side properties (platform, release_version) plus the shared `screen`
 * key from §2. Approval decisions and governed deletion approvals are emitted
 * server-side and are not mirrored here.
 */
export function useProcurementEvents() {
  const posthog = usePostHog();

  const capture = (event: string, screen: ProcurementScreen, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      screen,
      ...props,
    });
  };

  const createScreen = (prType: PrType): ProcurementScreen =>
    prType === "service" ? "service_pr_create" : "material_pr_create";

  return {
    // F1 · PR Creation
    onPrFormOpened: (prType: PrType, entrySource: string) =>
      capture("PR Form Opened", createScreen(prType), { pr_type: prType, entry_source: entrySource }),

    onPrSectionCompleted: (prType: PrType, section: PrSection, sectionIndex: number) =>
      capture("PR Section Completed", createScreen(prType), {
        pr_type: prType,
        section,
        section_index: sectionIndex,
      }),

    onPrItemRowAdded: (prType: PrType, rowIndex: number, hasGst: boolean) =>
      capture("PR Item Row Added", createScreen(prType), { pr_type: prType, row_index: rowIndex, has_gst: hasGst }),

    onPrDraftAutoSaved: (prType: PrType, draftId: string | number | null, sectionReached: string) =>
      capture("PR Draft Auto Saved", createScreen(prType), {
        pr_type: prType,
        draft_id: draftId,
        section_reached: sectionReached,
      }),

    onPrAttachmentFailed: (prType: PrType, reason: "size" | "type" | string) =>
      capture("PR Attachment Failed", createScreen(prType), { pr_type: prType, reason }),

    onPrSubmitted: (
      prType: PrType,
      props: {
        item_count: number;
        total_amount?: number | null;
        from_draft: boolean;
        draft_id?: string | number | null;
        time_on_form_sec: number;
      }
    ) => capture("PR Submitted", createScreen(prType), { pr_type: prType, ...props }),

    onPrFormAbandoned: (
      prType: PrType,
      props: { last_section: string; rows_added: number; time_on_form_sec: number }
    ) => capture("PR Form Abandoned", createScreen(prType), { pr_type: prType, ...props }),

    // F2 · Approval Decision (client side: queue reach + review; decision is server)
    onApprovalQueueViewed: (props: { pending_count: number; oldest_age_days?: number | null; type_mix?: string | null }) =>
      capture("Approval Queue Viewed", "procurement_approvals", props),

    onApprovalItemOpened: (props: { doc_type: string; level?: string | null; pr_class?: string | null }) =>
      capture("Approval Item Opened", "procurement_approvals", props),

    // F3 · PR → PO / WO Conversion
    onPoFormOpened: (entrySource: string) =>
      capture("PO Form Opened", "po_create", { entry_source: entrySource }),

    onPoSourcePrSelected: (sourcePrAgeDays: number | null) =>
      capture("PO Source PR Selected", "po_create", { source_pr_age_days: sourcePrAgeDays }),

    onPoSubmitted: (props: { advance_amount?: number | null; item_count: number }) =>
      capture("PO Submitted", "po_create", props),

    onWoFormOpened: (entrySource: string) =>
      capture("WO Form Opened", "wo_create", { entry_source: entrySource }),

    onWoSourcePrSelected: (sourcePrAgeDays: number | null) =>
      capture("WO Source PR Selected", "wo_create", { source_pr_age_days: sourcePrAgeDays }),

    onWoSubmitted: (itemCount: number) =>
      capture("WO Submitted", "wo_create", { item_count: itemCount }),

    // F4 · Goods Receipt (GRN)
    onGrnFormOpened: (entrySource: string) =>
      capture("GRN Form Opened", "grn_create", { entry_source: entrySource }),

    onGrnPoSelected: (sourcePoAgeDays: number | null) =>
      capture("GRN PO Selected", "grn_create", { source_po_age_days: sourcePoAgeDays }),

    onGrnSubmitted: (props: {
      item_count: number;
      batch_count?: number | null;
      has_invoice: boolean;
      partial_receipt: boolean;
      inventory_count?: number | null;
    }) => capture("GRN Submitted", "grn_create", props),

    // F5 · Draft Recovery (Temp Requests)
    onPrDraftReopened: (draftId: string | number | null, draftAgeDays: number | null) =>
      capture("PR Draft Reopened", "auto_saved_pr", { draft_id: draftId, draft_age_days: draftAgeDays }),

    // F6 · Governed Deletion (client: request; approval is server)
    onPrDeletionRequested: (screen: ProcurementScreen, docType: string, reason: string | null) =>
      capture("PR Deletion Requested", screen, { doc_type: docType, reason }),

    // F7 · Document Findability
    onProcurementListViewed: (
      screen: ProcurementScreen,
      props: { list_type: string; row_count: number; status_mix?: string | null }
    ) => capture("Procurement List Viewed", screen, props),

    onProcurementSearchPerformed: (
      screen: ProcurementScreen,
      props: { search_by: "pr_no" | "po_no" | "supplier" | string; query_length: number; returned_zero: boolean }
    ) => capture("Procurement Search Performed", screen, props),

    onProcurementRecordOpened: (
      screen: ProcurementScreen,
      props: { doc_type: string; record_status?: string | null; open_source?: string | null }
    ) => capture("Procurement Record Opened", screen, props),

    // F8 · Invoice / SES Review
    onInvoiceListViewed: (props: { status_mix?: string | null; result_count: number }) =>
      capture("Invoice List Viewed", "invoices_list", props),

    onInvoiceOpened: (invoiceStatus: string | null) =>
      capture("Invoice Opened", "invoices_list", { invoice_status: invoiceStatus }),
  };
}
