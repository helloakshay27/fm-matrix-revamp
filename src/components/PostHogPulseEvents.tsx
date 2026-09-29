import { useMemo } from "react";
import { capturePulseEvent } from "@/utils/posthogHelpers";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Event/property contract for the Pulse (Panchshil Pulse) module.
 *
 * Mirrors the shape of the other PostHog*Events modules (M-Safe, Helpdesk,
 * Visitor, Gate Pass, …): a hook returning one named handler per event, so an
 * event name and its property contract are declared exactly once and callers
 * never type a raw string.
 *
 * Event names are frozen: they match what already ships to PostHog so existing
 * dashboards keep resolving. Properties are additive only.
 */

export type PulseScreen =
  | "pulse_dashboard"
  | "pulse_amenities"
  | "pulse_community"
  | "pulse_customers"
  | "pulse_events"
  | "pulse_event_create"
  | "pulse_notices"
  | "pulse_users"
  | "pulse_contest_list"
  | "pulse_reward_list"
  | "pulse_reward_create"
  | "pulse_reward_detail"
  | "pulse_ai_alerts"
  | "active_reports"
  | "active_sos"
  | "user_detail"
  | "carpool_ride_list"
  | "carpool_ride_detail"
  | "carpool_ride_reviews"
  | "carpool_ride_settings"
  | "carpool_live_tracking"
  | "carpool_car_configuration";

/** Where a ride detail was opened from. `direct` covers deep links and refreshes. */
export type RideOpenSource = "list" | "report_list" | "direct";

/** Master-data rows are created and edited through one modal, so one event carries both. */
export type SaveMode = "added" | "updated";

/** The three sidebar packages in the Pulse shell — see PulseSidebar.tsx. */
export type PulsePackage = "Pulse Privilege" | "Master" | "Settings";

/**
 * True when the Pulse shell is the one on screen.
 *
 * Several pages under Master and Settings (and a few under Pulse Privilege,
 * e.g. BookingList, VisitorsDashboard, DocumentManagement) are shared with the
 * FM shell — the same component serves `/settings/...` for both tenants. Firing
 * a PULSE-01 event there unconditionally would attribute FM traffic to Pulse,
 * so shared pages gate on this.
 *
 * Mirrors the condition Layout.tsx uses to choose PulseSidebar/PulseDynamicHeader.
 */
export const isPulseShell = (): boolean => {
  if (typeof window === "undefined") return false;
  const { hostname, pathname } = window.location;
  if (
    hostname.includes("pulse.lockated.com") ||
    hostname.includes("pulse.gophygital.work") ||
    hostname.includes("pulse-uat.panchshil.com") ||
    hostname.includes("pulse.panchshil.com") ||
    pathname.startsWith("/pulse")
  ) {
    return true;
  }
  // Panchshil Pulse is company 305; Layout.tsx treats that as the Pulse shell
  // regardless of host, which is how /master + /settings resolve for them.
  return localStorage.getItem("selectedCompanyId") === "305";
};

export function usePulseEvents() {
  // Stable identity: these handlers are called from mount effects, so an
  // unstable object would either churn the effect or force an eslint-disable.
  return useMemo(
    () => ({
      /* ── Admin module coverage ─────────────────────────────────────────────
       * One event across every admin list/setup screen, with the module as a
       * property — the same shape as `MSafe Submodule Viewed`. A named event
       * per screen would mean ~60 names for one question ("which admin modules
       * actually get used?"), which is worse to query and worse to maintain.
       *
       * Shared pages must pass `guard: true` so nothing fires from the FM shell.
       */
      onModuleViewed: (props: {
        module: string;
        package: PulsePackage;
        screen: string;
        record_count?: number;
        /** Set on components that also serve non-Pulse routes. */
        guard?: boolean;
      }) => {
        const { guard, ...rest } = props;
        if (guard && !isPulseShell()) return;
        capturePulseEvent("Pulse Module Viewed", rest);
      },

      /* ── Dashboard ─────────────────────────────────────────────────────── */

      onDashboardViewed: () =>
        capturePulseEvent("Pulse Dashboard Viewed", { screen: "pulse_dashboard" }),

      onDashboardSectionViewed: (section: string) =>
        capturePulseEvent("Pulse Dashboard Section Viewed", {
          screen: "pulse_dashboard",
          section,
        }),

      onDashboardDateFilterChanged: (fromDate: string, toDate: string) =>
        capturePulseEvent("Pulse Dashboard Filter Changed", {
          screen: "pulse_dashboard",
          filter: "date_range",
          from_date: fromDate,
          to_date: toDate,
        }),

      onDashboardSiteFilterChanged: (
        siteId: number | "all",
        siteName: string | undefined
      ) =>
        capturePulseEvent("Pulse Dashboard Filter Changed", {
          screen: "pulse_dashboard",
          filter: "site",
          site_id: siteId,
          site_name: siteName,
        }),

      onDashboardFiltersReset: () =>
        capturePulseEvent("Pulse Dashboard Filters Reset", {
          screen: "pulse_dashboard",
        }),

      /* ── Dashboard sections ────────────────────────────────────────────── */

      onAmenityListViewed: () =>
        capturePulseEvent("Pulse Amenity List Viewed", { screen: "pulse_amenities" }),

      onCommunityViewed: () =>
        capturePulseEvent("Pulse Community Viewed", { screen: "pulse_community" }),

      onCustomerListViewed: () =>
        capturePulseEvent("Pulse Customer List Viewed", { screen: "pulse_customers" }),

      onEventListViewed: () =>
        capturePulseEvent("Pulse Event List Viewed", { screen: "pulse_events" }),

      onEventCreationViewed: () =>
        capturePulseEvent("Pulse Event Creation Viewed", { screen: "pulse_event_create" }),

      onEventCreationCancelled: () =>
        capturePulseEvent("Pulse Event Creation Cancelled", { screen: "pulse_event_create" }),

      onNoticeListViewed: () =>
        capturePulseEvent("Pulse Notice List Viewed", { screen: "pulse_notices" }),

      onUserListViewed: () =>
        capturePulseEvent("Pulse User List Viewed", { screen: "pulse_users" }),

      /**
       * Fires when the user-type filter is set *and* when it is cleared, so
       * filter abandonment is measurable. `user_type` is null on clear.
       */
      onUserFilterApplied: (userType: string | null) =>
        capturePulseEvent("Pulse User Filter Applied", {
          screen: "pulse_users",
          filters_used: userType ? ["user_type"] : [],
          filter_count: userType ? 1 : 0,
          user_type: userType,
          cleared: !userType,
        }),

      /* ── Carpool ───────────────────────────────────────────────────────── */

      onRideListViewed: () =>
        capturePulseEvent("Pulse Carpool Ride List Viewed", {
          screen: "carpool_ride_list",
        }),

      /**
       * Fired once, on the detail screen, keyed to the loaded ride. The list
       * screens pass their origin through the `from` query param instead of
       * firing their own copy — otherwise every open counts twice.
       */
      onRideDetailOpened: (rideId: number | string, openSource: RideOpenSource) =>
        capturePulseEvent("Pulse Carpool Ride Detail Opened", {
          screen: "carpool_ride_detail",
          ride_id: rideId,
          open_source: openSource,
        }),

      onRideReviewsViewed: (
        rideId: string | null,
        driverUserId: string | null
      ) =>
        capturePulseEvent("Pulse Carpool Ride Reviews Viewed", {
          screen: "carpool_ride_reviews",
          ride_id: rideId,
          driver_user_id: driverUserId,
        }),

      onRideReportStatusUpdated: (props: {
        ride_id: string | number | null;
        report_id: number;
        from_status: string | null;
        to_status: string;
      }) =>
        capturePulseEvent("Pulse Carpool Ride Report Status Updated", {
          screen: "carpool_ride_detail",
          ...props,
        }),

      onRideSettingsViewed: () =>
        capturePulseEvent("Pulse Carpool Ride Settings Viewed", {
          screen: "carpool_ride_settings",
        }),

      onRideSettingsSaved: (props: {
        setting_name: string;
        setting_label: string;
        previous_value: string;
        new_value: string;
        unit?: string;
      }) =>
        capturePulseEvent("Pulse Carpool Ride Settings Saved", {
          screen: "carpool_ride_settings",
          ...props,
        }),

      onLiveTrackingViewed: () =>
        capturePulseEvent("Pulse Carpool Live Tracking Viewed", {
          screen: "carpool_live_tracking",
        }),

      onCarConfigurationViewed: (initialTab: string) =>
        capturePulseEvent("Pulse Carpool Car Configuration Viewed", {
          screen: "carpool_car_configuration",
          initial_tab: initialTab,
        }),

      /* Vehicle master data — one event per entity, `mode` separates create from edit. */

      onVehicleBrandSaved: (mode: SaveMode, brandName: string) =>
        capturePulseEvent("Pulse Carpool Vehicle Brand Added", {
          screen: "carpool_car_configuration",
          mode,
          brand_name: brandName,
        }),

      onVehicleColourSaved: (mode: SaveMode, colourName: string, hexCode: string) =>
        capturePulseEvent("Pulse Carpool Vehicle Colour Added", {
          screen: "carpool_car_configuration",
          mode,
          colour_name: colourName,
          hex_code: hexCode,
        }),

      onVehicleModelSaved: (
        mode: SaveMode,
        props: { model_name: string; brand_id: number; seats: number }
      ) =>
        capturePulseEvent("Pulse Carpool Vehicle Model Added", {
          screen: "carpool_car_configuration",
          mode,
          ...props,
        }),

      /* ── Trust & safety ────────────────────────────────────────────────── */

      onReportListViewed: () =>
        capturePulseEvent("Pulse Report List Viewed", { screen: "active_reports" }),

      onReportStatusUpdated: (props: {
        report_id: number;
        from_status: string;
        to_status: string;
      }) =>
        capturePulseEvent("Pulse Report Status Updated", {
          screen: "active_reports",
          ...props,
        }),

      onSosAlertListViewed: () =>
        capturePulseEvent("Pulse SOS Alert List Viewed", { screen: "active_sos" }),

      /* ── Contests & rewards ────────────────────────────────────────────── */

      onContestListViewed: () =>
        capturePulseEvent("Pulse Contest List Viewed", {
          screen: "pulse_contest_list",
        }),

      /** Call after the search response lands — `result_count` must describe this query. */
      onContestListSearched: (queryLength: number, resultCount: number) =>
        capturePulseEvent("Pulse Contest List Searched", {
          screen: "pulse_contest_list",
          query_length: queryLength,
          result_count: resultCount,
          returned_zero: resultCount === 0,
        }),

      /** Fires on set and on clear; `status` is null when the filter is removed. */
      onContestFilterApplied: (status: string | null) =>
        capturePulseEvent("Pulse Contest Filter Applied", {
          screen: "pulse_contest_list",
          filters_used: status ? ["status"] : [],
          filter_count: status ? 1 : 0,
          status,
          cleared: !status,
        }),

      onContestStatusChanged: (contestId: number, newStatus: "active" | "inactive") =>
        capturePulseEvent("Pulse Contest Status Changed", {
          screen: "pulse_contest_list",
          contest_id: contestId,
          new_status: newStatus,
        }),

      onRewardListViewed: () =>
        capturePulseEvent("Pulse Reward List Viewed", { screen: "pulse_reward_list" }),

      onRewardCreated: (props: {
        contest_id: number;
        prize_id: number;
        user_id: number;
        reward_type: string;
      }) =>
        capturePulseEvent("Pulse Contest Reward Created", {
          screen: "pulse_reward_create",
          ...props,
        }),

      onRewardDetailOpened: (claimId: number, status: string) =>
        capturePulseEvent("Pulse Contest Reward Detail Opened", {
          screen: "pulse_reward_detail",
          claim_id: claimId,
          status,
        }),

      onRewardStatusChanged: (props: {
        claim_id: number | undefined;
        previous_status: string | undefined;
        new_status: string;
      }) =>
        capturePulseEvent("Pulse Contest Reward Status Changed", {
          screen: "pulse_reward_detail",
          ...props,
        }),

      /* ── Users & AI ────────────────────────────────────────────────────── */

      onUserDetailOpened: (props: {
        user_id: string | number;
        reports_count: number;
        reviews_count: number;
      }) =>
        capturePulseEvent("Pulse User Detail Opened", {
          screen: "user_detail",
          ...props,
        }),

      onAiAlertListViewed: () =>
        capturePulseEvent("Pulse AI Alert List Viewed", { screen: "pulse_ai_alerts" }),
    }),
    []
  );
}
