import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type IncidentScreen =
  | "incident_list"
  | "incident_analytics"
  | "incident_create"
  | "incident_detail";

export type IncidentCreateStepKey =
  | "time_building"
  | "categorise"
  | "assess"
  | "describe_disclaim";

/**
 * Event/property contract for the Incident module — see
 * "09 Requirements/Incident - Product-Flow Analytics Spec.md".
 * Same event names & property domains fire on web and mobile; this hook
 * only stamps the web-side properties (platform, release_version). Every
 * event carries its shared `screen` key from §2 of the catalogue.
 */
export function useIncidentEvents() {
  const posthog = usePostHog();

  const capture = (
    event: string,
    screen: IncidentScreen,
    props: Record<string, unknown> = {}
  ) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      screen,
      ...props,
    });
  };

  return {
    // F1 · Incident Reporting (Add) — primary funnel
    onIncidentCreateFormOpened: (entrySource: string) =>
      capture("Incident Create Form Opened", "incident_create", {
        entry_source: entrySource,
      }),

    onIncidentCreateStepCompleted: (
      stepKey: IncidentCreateStepKey,
      stepIndex: number,
      stepDurationSec: number
    ) =>
      capture("Incident Create Step Completed", "incident_create", {
        step_key: stepKey,
        step_index: stepIndex,
        step_duration_sec: stepDurationSec,
      }),

    onIncidentCreateFormSubmitted: (props: {
      category_depth_reached: number;
      secondary_used: boolean;
      severity: string | number;
      probability: string | number;
      incident_level: string | number;
      support_required: boolean;
      has_attachments: boolean;
      time_on_form_sec: number;
    }) => capture("Incident Create Form Submitted", "incident_create", props),

    onIncidentCreateFormAbandoned: (props: {
      last_field_focused: string | null;
      fields_completed_count: number;
      category_depth_reached: number;
      time_on_form_sec: number;
    }) => capture("Incident Create Form Abandoned", "incident_create", props),

    onIncidentFormValidationFailed: (failedFields: string[]) =>
      capture("Incident Form Validation Failed", "incident_create", {
        failed_fields: failedFields,
      }),

    // F2 · Findability (Search & Filter)
    onIncidentListViewed: (resultCount: number, pageNo: number) =>
      capture("Incident List Viewed", "incident_list", {
        result_count: resultCount,
        page_no: pageNo,
      }),

    onIncidentFilterApplied: (filterFields: string[], filterCount: number) =>
      capture("Incident Filter Applied", "incident_list", {
        filter_fields: filterFields,
        filter_count: filterCount,
      }),

    onIncidentSearchPerformed: (queryLength: number, resultCount: number) =>
      capture("Incident Search Performed", "incident_list", {
        query_length: queryLength,
        returned_zero: resultCount === 0,
      }),

    onIncidentDetailOpened: (
      openSource: "search" | "filter" | "list",
      incidentStatus: string | null
    ) =>
      capture("Incident Detail Opened", "incident_detail", {
        open_source: openSource,
        incident_status: incidentStatus,
      }),

    // F3/F4 · Triage, Detail & Status Progression
    onIncidentStatusUpdateOpened: (fromStatus: string | null) =>
      capture("Incident Status Update Opened", "incident_detail", {
        from_status: fromStatus,
      }),

    onIncidentStatusUpdated: (props: {
      from_status: string | null;
      to_status: string;
      comment_length: number;
      time_in_previous_status_sec: number | null;
    }) => capture("Incident Status Updated", "incident_detail", props),

    onIncidentEditOpened: () =>
      capture("Incident Edit Opened", "incident_detail"),

    onIncidentReportDownloaded: (format: string) =>
      capture("Incident Report Downloaded", "incident_detail", { format }),

    // F5 · Investigation & CAPA capture
    onIncidentInvestigationSaved: (props: {
      has_root_cause: boolean;
      corrective_count: number;
      preventive_count: number;
      investigator_count: number;
    }) => capture("Incident Investigation Saved", "incident_detail", props),

    // F6 · Analytics Consumption
    onIncidentTabSwitched: (to: "list" | "analytics") =>
      capture("Incident Tab Switched", to === "analytics" ? "incident_analytics" : "incident_list", {
        to,
      }),

    onIncidentAnalyticsDateRangeChanged: (rangeDays: number) =>
      capture("Incident Analytics Date Range Changed", "incident_analytics", {
        range_days: rangeDays,
      }),

    onIncidentAnalyticsChartInteracted: (chartKey: string) =>
      capture("Incident Analytics Chart Interacted", "incident_analytics", {
        chart_key: chartKey,
      }),

    // F7 · Export / Reporting
    onIncidentListExported: (rowCount: number, afterFilter: boolean) =>
      capture("Incident List Exported", "incident_list", {
        row_count: rowCount,
        after_filter: afterFilter,
      }),
  };
}
