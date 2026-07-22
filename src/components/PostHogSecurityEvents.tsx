import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type PatrolStatus = "active" | "inactive";
export type PatrolFilterBy = "patrol" | "status" | "date" | string;
export type VehicleCategory = "owned" | "staff" | "workshop";
export type VehicleTypeCategory = "2_wheeler" | "4_wheeler";

/**
 * Custom hooks for tracking Security module events (Patrolling and Vehicle).
 * Maps directly to the Vehicle & Patrolling (Security) Event Catalogue.
 */

export function usePatrolEvents() {
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
    onPatrolFormOpened: () => {
      capture("Patrol Form Opened");
    },
    onPatrolSubmitted: (props: {
      checkpoint_count: number;
      has_checklist: boolean;
      schedule_slots_per_day: number;
      grace_minutes: number;
      validity_days: number;
    }) => {
      capture("Patrol Submitted", props);
    },
    onPatrolImported: (props: { row_count: number }) => {
      capture("Patrol Imported", props);
    },
    onPatrolStatusToggled: (props: {
      patrol_id: string | number;
      to_status: PatrolStatus;
    }) => {
      capture("Patrol Status Toggled", props);
    },
    onPatrolResponseViewed: (props: { row_count: number }) => {
      capture("Patrol Response Viewed", props);
    },
    onPatrolResponseFiltered: (props: { filter_by: PatrolFilterBy }) => {
      capture("Patrol Response Filtered", props);
    },
    onPatrolTicketRaised: (props: {
      patrol_id: string | number;
      checkpoint_id: string | number;
      from_status: "missed" | "completed";
    }) => {
      capture("Patrol Ticket Raised", props);
    },
    onPatrolIncidentRaised: (props: {
      patrol_id: string | number;
      checkpoint_id: string | number;
    }) => {
      capture("Patrol Incident Raised", props);
    },
  };
}

export function useVehicleEvents() {
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
    onVehicleRegistered: (props: {
      category: VehicleCategory;
      vehicle_category: VehicleTypeCategory;
      has_insurance: boolean;
      slot_assigned: boolean;
    }) => {
      capture("Vehicle Registered", props);
    },
    onVehicleQRGenerated: (props: { vehicle_id?: string | number } = {}) => {
      capture("Generated", props);
    },
    onVehicleQRDownloaded: (props: { vehicle_id: string | number }) => {
      capture("Vehicle QR Downloaded", props);
    },
  };
}
