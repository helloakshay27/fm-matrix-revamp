import { useEffect, useRef } from "react";
import { capturePostHogEvent, resolveProjectContext } from "@/utils/posthogHelpers";

/**
 * Event/property contract for the Accounting module (/accounting/*).
 *
 * The module has ~215 screens covering ~40 business entities, so instead of one
 * bespoke event per screen it uses a small set of generic events keyed by
 * `entity` (what kind of record) and, for actions, `action` (what was done).
 * One PostHog insight broken down by `entity` then covers the whole module.
 *
 *   Accounting List Viewed       – a list/dashboard screen finished loading
 *   Accounting Record Viewed     – a detail screen finished loading
 *   Accounting Form Opened       – a create/edit form was opened
 *   Accounting Record Created    – a create call succeeded
 *   Accounting Record Updated    – an update call succeeded
 *   Accounting Record Deleted    – a delete call succeeded
 *   Accounting Action Performed  – any other state change (approve, send, void,
 *                                  mark paid, convert, clone, status change …)
 *   Accounting Save Failed       – a create/update/delete/action call failed
 *   Accounting Search Performed  – list search (debounced)
 *   Accounting Filter Applied    – list filter applied
 *   Accounting Report Viewed     – a report screen was opened
 *   Accounting Report Generated  – a report was run with a date range/filters
 *
 * Exports/downloads are NOT duplicated here: EnhancedTable and
 * utils/downloadTracking.ts already report them as "Accounting Download: …".
 *
 * Project code comes from resolveProjectContext(), so screens shared with Club
 * Management (/club-management/accounting/*) report CM-01 and /accounting/*
 * reports FM-01.
 */

export type AccountingEntity =
  // Sales
  | "customer"
  | "item"
  | "quote"
  | "sales_order"
  | "delivery_challan"
  | "invoice"
  | "recurring_invoice"
  | "retainer_invoice"
  | "payment_received"
  | "credit_note"
  | "payment_link"
  // Purchases
  | "vendor"
  | "purchase_order"
  | "bill"
  | "recurring_bill"
  | "expense"
  | "recurring_expense"
  | "payment_made"
  | "vendor_credit"
  // Accountant
  | "manual_journal"
  | "recurring_journal"
  | "chart_of_account"
  | "opening_balance"
  | "transaction"
  | "budget"
  // Setup / masters
  | "charge_setup"
  | "bill_cycle"
  | "tax_setup"
  | "tax_rate"
  | "tax_preference"
  | "bank"
  | "payment_term"
  | "sales_person"
  | "section"
  | "uom"
  | "organisation"
  | "system_mail"
  | "template"
  // Misc
  | "customer_review"
  | "portal_activity"
  | "activity_log"
  | "api_usage";

export type AccountingFormMode = "create" | "edit";
export type AccountingOperation = "create" | "update" | "delete" | "action" | "import";

type Id = string | number | null | undefined;

/** Strip the axios/fetch error down to something safe and short to send. */
const errorMessage = (error: unknown): string => {
  if (!error) return "unknown";
  const e = error as { response?: { data?: { message?: unknown; error?: unknown } }; message?: unknown };
  const raw = e.response?.data?.message ?? e.response?.data?.error ?? e.message ?? String(error);
  return String(typeof raw === "string" ? raw : JSON.stringify(raw)).slice(0, 200);
};

const capture = (event: string, props: Record<string, unknown>) =>
  capturePostHogEvent(event, { ...resolveProjectContext(), module: "accounting", ...props });

/**
 * Plain functions (not a hook) so they can be called from event handlers,
 * async helpers and module-scope fetch functions alike.
 */
export const accountingEvents = {
  onListViewed: (entity: AccountingEntity, props: { row_count?: number; total_count?: number } = {}) =>
    capture("Accounting List Viewed", { entity, ...props }),

  onRecordViewed: (entity: AccountingEntity, recordId: Id, props: { record_status?: string | null } = {}) =>
    capture("Accounting Record Viewed", { entity, record_id: recordId ?? null, ...props }),

  onFormOpened: (entity: AccountingEntity, mode: AccountingFormMode, recordId?: Id) =>
    capture("Accounting Form Opened", { entity, mode, record_id: recordId ?? null }),

  onRecordCreated: (
    entity: AccountingEntity,
    recordId: Id,
    props: { amount?: number | null; item_count?: number | null; status?: string | null; [key: string]: unknown } = {}
  ) => capture("Accounting Record Created", { entity, record_id: recordId ?? null, ...props }),

  onRecordUpdated: (
    entity: AccountingEntity,
    recordId: Id,
    props: { amount?: number | null; item_count?: number | null; status?: string | null; [key: string]: unknown } = {}
  ) => capture("Accounting Record Updated", { entity, record_id: recordId ?? null, ...props }),

  onRecordDeleted: (entity: AccountingEntity, recordId: Id, props: { bulk_count?: number } = {}) =>
    capture("Accounting Record Deleted", { entity, record_id: recordId ?? null, ...props }),

  /** `action` is a snake_case verb, e.g. "approve", "send_email", "mark_as_paid", "convert_to_invoice". */
  onActionPerformed: (
    entity: AccountingEntity,
    action: string,
    recordId?: Id,
    props: Record<string, unknown> = {}
  ) => capture("Accounting Action Performed", { entity, action, record_id: recordId ?? null, ...props }),

  onSaveFailed: (
    entity: AccountingEntity,
    operation: AccountingOperation,
    error: unknown,
    props: { action?: string; record_id?: Id } = {}
  ) => capture("Accounting Save Failed", { entity, operation, error_message: errorMessage(error), ...props }),

  onSearchPerformed: (entity: AccountingEntity, query: string) =>
    capture("Accounting Search Performed", { entity, query_length: query.length }),

  onFilterApplied: (entity: AccountingEntity, filters: Record<string, unknown> = {}) =>
    capture("Accounting Filter Applied", {
      entity,
      filter_keys: Object.keys(filters).filter((k) => {
        const v = filters[k];
        return v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
      }),
    }),

  /** `report` is a snake_case slug, e.g. "balance_sheet", "ar_aging_summary". */
  onReportViewed: (report: string) => capture("Accounting Report Viewed", { report }),

  onReportGenerated: (
    report: string,
    props: { from_date?: string | null; to_date?: string | null; filter_keys?: string[]; row_count?: number } = {}
  ) => capture("Accounting Report Generated", { report, ...props }),
};

export const useAccountingEvents = () => accountingEvents;

/* ------------------------------------------------------------------ */
/* Fire-once view hooks — one line per screen.                         */
/* A ref guard keeps React StrictMode's double effect from double-firing. */
/* ------------------------------------------------------------------ */

/**
 * List/dashboard screens. Returns a reporter to call from the fetch's success
 * branch; only the first call per mount is sent, so re-fetches on paging,
 * filtering or searching don't inflate the view count.
 *
 *   const reportListLoaded = useAccountingListViewed("invoice");
 *   ... setInvoices(rows); reportListLoaded(rows.length, total);
 */
export function useAccountingListViewed(entity: AccountingEntity) {
  const fired = useRef(false);
  return (rowCount?: number, totalCount?: number) => {
    if (fired.current) return;
    fired.current = true;
    accountingEvents.onListViewed(entity, { row_count: rowCount, total_count: totalCount });
  };
}

/**
 * Detail screens. Returns a reporter to call from the detail fetch's success
 * branch; sent once per record id.
 *
 *   const reportRecordLoaded = useAccountingRecordViewed("invoice");
 *   ... setInvoice(data); reportRecordLoaded(id, data.status);
 */
export function useAccountingRecordViewed(entity: AccountingEntity) {
  const firedFor = useRef<Id>(undefined);
  return (recordId: Id, status?: string | null) => {
    if (recordId === undefined || firedFor.current === recordId) return;
    firedFor.current = recordId;
    accountingEvents.onRecordViewed(entity, recordId, { record_status: status ?? null });
  };
}

/** Create/edit form screens: fires once on mount. */
export function useAccountingFormOpened(entity: AccountingEntity, mode: AccountingFormMode, recordId?: Id) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    accountingEvents.onFormOpened(entity, mode, recordId);
  }, [entity, mode, recordId]);
}

/** Report screens: fires once on mount. */
export function useAccountingReportViewed(report: string) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    accountingEvents.onReportViewed(report);
  }, [report]);
}

/** List search boxes: fires once the term has been stable for 800ms (non-empty only). */
export function useAccountingSearchTracking(entity: AccountingEntity, searchTerm: string | undefined | null) {
  const last = useRef("");
  useEffect(() => {
    const term = (searchTerm ?? "").trim();
    if (!term || term === last.current) return;
    const t = setTimeout(() => {
      last.current = term;
      accountingEvents.onSearchPerformed(entity, term);
    }, 800);
    return () => clearTimeout(t);
  }, [entity, searchTerm]);
}
