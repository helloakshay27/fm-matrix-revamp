import { usePostHog } from "@posthog/react";
import { markDownloadReported } from "@/utils/downloadTracking";

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
  | "deletion_history"
  // Analytics dashboards — features/msafe-dashboard and the legacy MsafeDashboardVI page
  | "msafe_dashboard"
  | "msafe_dashboard_legacy";

/** What kind of file actually left the browser. */
export type MsafeDownloadFormat = "xlsx" | "csv" | "json" | "pdf" | "png";

/** Which control the user clicked to get the file. */
export type MsafeDownloadSource =
  | "list_export" // registry list export (EnhancedTable toolbar)
  | "row_pdf" // per-row PDF / attachment download on a list
  | "report_page" // the standalone M-Safe report download pages
  | "kpi_card" // dashboard KPI card download button
  | "chart_card" // dashboard chart card download button
  | "user_directory" // dashboard full user-directory export
  | "section_data" // legacy dashboard per-section data export
  | "chart_image"; // legacy dashboard chart PNG

/**
 * Applied dashboard filter state carried on a download, so the file can be read back
 * alongside the slice of data the user was actually looking at. Structurally satisfied
 * by the dashboard's own `AppliedFilters` — pass it straight through.
 */
export interface MsafeDownloadFilters {
  /** Legacy VI dashboard only — it filters by cluster, which the newer dashboard has no equivalent of. */
  clusterIds?: string[];
  circleIds?: string[];
  functionIds?: string[];
  zoneId?: string;
  empTypeId?: string;
  startDate?: string;
  endDate?: string;
}

// report_type domain — see Safety Reports & Admin Utilities catalogue §6
export type MSafeReportType = "master_sso" | "smt" | "lmc" | "training" | "user_report" | "detail_report";

/** Inclusive day count of a from/to pair; null when either end is missing or unparseable. */
const dateRangeDays = (start?: string, end?: string): number | null => {
  if (!start || !end) return null;
  const from = new Date(start).getTime();
  const to = new Date(end).getTime();
  if (isNaN(from) || isNaN(to)) return null;
  return Math.round((to - from) / 86_400_000) + 1;
};

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

  const getCommonContext = () => {
    const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
    const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
    const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
    const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
    const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
    const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
    const _orgId = localStorage.getItem("selectedOrgId") ?? localStorage.getItem("organization_id") ?? localStorage.getItem("org_id");
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

  const capture = (event: string, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      ...getCommonContext(),
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

    // ── Umbrella download event ──────────────────────────────────────────────
    // Fired at EVERY point in M-Safe where a file leaves the browser — list
    // exports, per-row PDFs, report pages, dashboard KPI/chart/user-directory
    // exports, legacy dashboard section data and chart images. One event name
    // means "what has this user downloaded" is a single query, broken down by
    // `source` / `file_format` / `screen`.
    //
    // It sits ALONGSIDE the spec'd events above ("MSafe User List Exported",
    // "Msafe Report Downloaded") rather than replacing them, so the existing
    // §6 charts keep working. Those are different event names, so nothing is
    // double-counted within a single name — but don't add both to one insight.
    //
    // `succeeded: false` also covers the "nothing to export" click, which is
    // the signal that a control looks downloadable but has no data behind it.
    onMsafeDownloaded: (props: {
      screen: MSafeScreen;
      source: MsafeDownloadSource;
      /**
       * What was downloaded, e.g. "KRCC Rejected". Goes into the EVENT NAME
       * ("Msafe Download: KRCC Rejected") so the PostHog activity feed says which
       * file it was without opening the event.
       *
       * Therefore it MUST be a stable, low-cardinality string — never a record id,
       * filename with a date, or anything per-row, or the project's event list fills
       * up with one name per record. Per-record identity goes in `record_id`.
       */
      label: string;
      file_format: MsafeDownloadFormat;
      succeeded: boolean;
      export_mode?: "server_report" | "client_sheet" | null;
      /** Server report identifier (`export_for` param / report path) when export_mode is server_report. */
      export_for?: string | null;
      row_count?: number | null;
      record_id?: number | string | null;
      persona?: string | null;
      filters?: MsafeDownloadFilters;
      failure_reason?: string | null;
    }) => {
      // Tell the global anchor-click fallback (utils/downloadTracking) that this
      // download is already reported, so one click stays one event.
      markDownloadReported();
      capture(props.label ? `Msafe Download: ${props.label}` : "Msafe Download", {
        // Every download carries this flag, so "all M-Safe downloads" stays ONE query
        // even though each has its own event name: insight on "All events" filtered by
        // `msafe_download = true`, then break down by `label` / `source` / `file_format`.
        msafe_download: true,
        // Shared with every other module's download event (see
        // PostHogModuleDownloadEvents), so "all downloads app-wide" is one query.
        download_event: true,
        module: "msafe",
        screen: props.screen,
        source: props.source,
        label: props.label,
        file_format: props.file_format,
        export_mode: props.export_mode ?? null,
        export_for: props.export_for ?? null,
        row_count: props.row_count ?? null,
        record_id: props.record_id ?? null,
        persona: props.persona ?? null,
        cluster_ids: props.filters?.clusterIds ?? [],
        circle_ids: props.filters?.circleIds ?? [],
        function_ids: props.filters?.functionIds ?? [],
        zone_id: props.filters?.zoneId || null,
        employee_type: props.filters?.empTypeId || null,
        from_date: props.filters?.startDate || null,
        to_date: props.filters?.endDate || null,
        succeeded: props.succeeded,
        failure_reason: props.failure_reason ?? null,
      });
    },

    // ── Dashboard interaction: filters and chart view modes ──────────────────
    // Which slice of data the user asked for. Fires on Apply (and on the persona
    // switch that re-applies), not on every keystroke in the filter bar, so one
    // event = one deliberate "show me this" — the same filter set that then rides
    // along on any download from that view.
    onMsafeDashboardFilterApplied: (props: {
      screen: MSafeScreen;
      persona?: string | null;
      filters: MsafeDownloadFilters & { circles?: string[]; functions?: string[]; zone?: string; empType?: string };
      /** Filter fields whose value actually changed vs the previously applied set. */
      changed_fields?: string[];
    }) =>
      capture("Msafe Dashboard Filter Applied", {
        screen: props.screen,
        persona: props.persona ?? null,
        cluster_ids: props.filters.clusterIds ?? [],
        circle_ids: props.filters.circleIds ?? [],
        circle_names: props.filters.circles ?? [],
        function_ids: props.filters.functionIds ?? [],
        function_names: props.filters.functions ?? [],
        zone_id: props.filters.zoneId || null,
        zone_name: props.filters.zone || null,
        employee_type: props.filters.empTypeId || null,
        employee_type_label: props.filters.empType || null,
        from_date: props.filters.startDate || null,
        to_date: props.filters.endDate || null,
        // Length of the window the user asked for, so "how far back do people look"
        // is answerable without parsing dates in the query.
        date_range_days: dateRangeDays(props.filters.startDate, props.filters.endDate),
        filter_fields: props.changed_fields ?? [],
      }),

    // Donut / bar / table / line switch on a chart card — tells you which
    // representation people actually trust for a given metric.
    onMsafeChartViewChanged: (props: {
      card_label: string;
      view_mode: string;
      previous_view_mode?: string | null;
      available_modes?: string[];
    }) =>
      capture("Msafe Chart View Changed", {
        screen: "msafe_dashboard",
        card_label: props.card_label,
        view_mode: props.view_mode,
        previous_view_mode: props.previous_view_mode ?? null,
        available_modes: props.available_modes ?? [],
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
