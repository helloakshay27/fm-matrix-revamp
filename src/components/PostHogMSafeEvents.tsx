import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type MSafeListType = "fte" | "non_fte";
export type MSafeSubmodule = "lmc" | "smt" | "krcc" | "training";
export type MSafeScreen =
  | "msafe_fte_list"
  | "msafe_nonfte_list"
  | "msafe_lmc"
  | "msafe_smt"
  | "msafe_krcc"
  | "msafe_training"
  | "msafe_reassign"
  // Safety Reports & Admin Utilities (folds into the M-Safe pack)
  | "msafe_user_report"
  | "msafe_detail_report"
  | "hierarchy_check"
  | "deletion_history";

// report_type domain — see Safety Reports & Admin Utilities catalogue §6
export type MSafeReportType = "master_sso" | "smt" | "lmc" | "training" | "user_report" | "detail_report";

const screenForListType = (listType: MSafeListType): MSafeScreen =>
  listType === "fte" ? "msafe_fte_list" : "msafe_nonfte_list";

const screenForSubmodule = (submodule: MSafeSubmodule): MSafeScreen =>
  ({
    lmc: "msafe_lmc",
    smt: "msafe_smt",
    krcc: "msafe_krcc",
    training: "msafe_training",
  })[submodule] as MSafeScreen;

/**
 * Event/property contract for the M-Safe module — see
 * "09 Requirements/MSafe - Product-Flow Analytics Spec.md".
 * Same event names & property domains fire on web and mobile; this hook
 * only stamps the web-side properties (platform, release_version).
 */
export function useMSafeEvents() {
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
    // F1 · External-User Approval — primary admin flow
    onMSafeExternalUserListViewed: (resultCount: number, pendingCount: number) =>
      capture("MSafe External User List Viewed", {
        screen: "msafe_nonfte_list",
        result_count: resultCount,
        pending_count: pendingCount,
      }),

    onMSafeExternalUserReviewed: (pendingAgeDays: number | null) =>
      capture("MSafe External User Reviewed", {
        screen: "msafe_nonfte_list",
        pending_age_days: pendingAgeDays,
      }),

    // Client mirror of the server-side approval event; keep the name
    // identical to the server event per the standardisation contract.
    onMSafeExternalUserApproved: (pendingAgeDays: number | null) =>
      capture("MSafe External User Approved", {
        screen: "msafe_nonfte_list",
        pending_age_days: pendingAgeDays,
      }),

    // F2 · User Deletion (Offboarding)
    onMSafeUserDeletionOpened: (userType: "fte" | "non_fte") =>
      capture("MSafe User Deletion Opened", {
        screen: userType === "fte" ? "msafe_fte_list" : "msafe_nonfte_list",
        user_type: userType,
      }),

    // Client mirror of the server-side deletion event; keep the name
    // identical to the server event per the standardisation contract.
    onMSafeUserDeleted: (userType: "fte" | "non_fte", reason: string | null) =>
      capture("MSafe User Deleted", {
        screen: userType === "fte" ? "msafe_fte_list" : "msafe_nonfte_list",
        user_type: userType,
        reason,
      }),

    // F3 · Reportees Reassignment — 3-step form
    onReporteesReassignOpened: () =>
      capture("Reportees Reassign Opened", { screen: "msafe_reassign" }),

    onReporteesFetched: (reporteeCount: number) =>
      capture("Reportees Fetched", {
        screen: "msafe_reassign",
        reportee_count: reporteeCount,
      }),

    onReporteesReassigned: (selectedCount: number, sameManagerError: boolean) =>
      capture("Reportees Reassigned", {
        screen: "msafe_reassign",
        selected_count: selectedCount,
        same_manager_error: sameManagerError,
      }),

    // F4 · Registry Findability
    onMSafeUserListViewed: (listType: MSafeListType, resultCount: number) =>
      capture("MSafe User List Viewed", {
        screen: screenForListType(listType),
        list_type: listType,
        result_count: resultCount,
      }),

    onMSafeUserSearchPerformed: (
      listType: MSafeListType,
      queryLength: number,
      resultCount: number
    ) =>
      capture("MSafe User Search Performed", {
        screen: screenForListType(listType),
        query_length: queryLength,
        returned_zero: resultCount === 0,
      }),

    onMSafeUserFilterApplied: (listType: MSafeListType, filterFields: string[]) =>
      capture("MSafe User Filter Applied", {
        screen: screenForListType(listType),
        filter_fields: filterFields,
      }),

    // F5 · Registry Export
    onMSafeUserListExported: (listType: MSafeListType, rowCount: number) =>
      capture("MSafe User List Exported", {
        screen: screenForListType(listType),
        list_type: listType,
        row_count: rowCount,
      }),

    // F6 · Safety-Programme Registry Usage (shelf-ware detection)
    onMSafeSubmoduleViewed: (submodule: MSafeSubmodule, recordCount: number) =>
      capture("MSafe Submodule Viewed", {
        screen: screenForSubmodule(submodule),
        submodule,
        record_count: recordCount,
      }),

    // ── Safety Reports & Admin Utilities catalogue ───────────────────────────
    // F1 · Report Generation & Download — primary consumption flow
    onMsafeReportViewed: (screen: "msafe_user_report" | "msafe_detail_report") =>
      capture("Msafe Report Viewed", { screen }),

    // Client mirror of the download commit. row_count/date_range default to null
    // when the client only receives a file blob and can't count rows locally.
    onMsafeReportDownloaded: (props: {
      screen: "msafe_user_report" | "msafe_detail_report";
      report_type: MSafeReportType;
      row_count?: number | null;
      date_range?: string | null;
    }) =>
      capture("Msafe Report Downloaded", {
        screen: props.screen,
        report_type: props.report_type,
        row_count: props.row_count ?? null,
        date_range: props.date_range ?? null,
      }),

    // F2 · Hierarchy Lookup
    onHierarchyCheckOpened: () =>
      capture("Hierarchy Check Opened", { screen: "hierarchy_check" }),

    onHierarchyCheckSubmitted: (props: {
      employee_type: string;
      lookup_by: "email" | "mobile";
      levels_returned: number;
      not_found: boolean;
    }) =>
      capture("Hierarchy Check Submitted", {
        screen: "hierarchy_check",
        ...props,
      }),

    // F3 · Deletion-Audit Review
    onDeletionHistoryViewed: (recordCount: number) =>
      capture("Deletion History Viewed", {
        screen: "deletion_history",
        record_count: recordCount,
      }),
  };
}
