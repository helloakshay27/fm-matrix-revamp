import { usePostHog } from '@posthog/react';
import { normalizeRoute } from '@/utils/posthogContext';

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? 'dev';

/**
 * `flow_started` / `flow_step_viewed` / `flow_completed` — the three events the analytics API
 * asks for by name to build real workflow funnels.
 *
 * WHY THIS EXISTS
 * ---------------
 * The `workflow_usage` endpoint returns its own `info.notes` describing what it is doing, and
 * it is explicit that the funnel is a fallback:
 *
 *   instrumentation: "flow_started/flow_completed/flow_step_viewed are NOT instrumented —
 *                     everything here is proxied from $pathname + $session_id."
 *   f_step:          "Funnel steps are inferred from URL patterns
 *                     (module root -> /new|/create -> /detail|/edit)."
 *   f_comp:          "Proxy = sessions reaching the last funnel step / sessions starting.
 *                     True F-comp = flow_completed / flow_started (blocked)."
 *   flows:           "Rows are raw module sub-paths, not named flows. Naming needs a flow_key
 *                     property."
 *
 * That URL proxy does not just lack detail, it reports the wrong answer: it assumes a create
 * ends on a /detail or /edit URL, and this app navigates back to the list instead — so ticket
 * creation currently reads 0 completions and a 100% drop at the last step while real tickets
 * are being created. These events replace the guess with the actual sequence.
 *
 * WHY THIS IS NOT TENANT-GATED
 * ----------------------------
 * Unlike the Vi catalogue names in PostHogViWorkflowEvents, `flow_*` is the analytics API's own
 * vocabulary, shared by every tenant's dashboard, and `flow_key` already separates the flows.
 * There is no namespace to collide with, and the same URL-proxy weakness affects FM Matrix,
 * Oman, Pulse and Club identically — so every tenant's funnel gets more accurate from one place.
 *
 * `flow_key` values are the workflow keys from features/vi-posthog-dashboard/data/workflows.ts,
 * so a funnel on the dashboard and the events behind it are named the same thing. The backend
 * has to group on these exact strings for the join to work.
 */

/** Stable flow identifiers — must match the dashboard's workflow keys. */
export type FlowKey =
  | 'ticketCreate'
  | 'visitorCreate'
  | 'facilityBooking'
  | 'spaceBooking';

export function useFlowEvents() {
  const posthog = usePostHog();

  const base = () => {
    const readId = (...keys: string[]): number | undefined => {
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw && !Number.isNaN(Number(raw))) return Number(raw);
      }
      return undefined;
    };
    return {
      platform: 'web',
      release_version: RELEASE_VERSION,
      // The endpoint proxies off $pathname today, so keep sending the normalised route: it lets
      // the backend cross-check a flow against the module prefix it belongs to.
      screen: normalizeRoute(),
      site_id: readId('selectedSiteId', 'site_id'),
      company_id: readId('selectedCompanyId', 'company_id'),
      organization_id: readId('selectedOrgId', 'organization_id', 'org_id'),
      user_id: readId('userId', 'user_id'),
    };
  };

  return {
    /** The user entered the flow — the funnel's denominator. */
    onFlowStarted: (flow_key: FlowKey) => {
      posthog?.capture('flow_started', { ...base(), flow_key });
    },

    /**
     * One named step inside the flow. `step_index` is 0-based and `step_key` is a stable slug,
     * so the backend can order steps without depending on the order events happen to arrive in
     * — two users on different devices can report the same step seconds apart.
     */
    onFlowStepViewed: (flow_key: FlowKey, step_key: string, step_index: number) => {
      posthog?.capture('flow_step_viewed', { ...base(), flow_key, step_key, step_index });
    },

    /**
     * The flow reached its end. `succeeded` distinguishes a real completion from an attempt that
     * failed server-side — without it a failed save would either be counted as a completion or
     * vanish, and the API's F-comp is flow_completed / flow_started.
     */
    onFlowCompleted: (
      flow_key: FlowKey,
      props: { succeeded: boolean; failure_reason?: string } = { succeeded: true },
    ) => {
      posthog?.capture('flow_completed', { ...base(), flow_key, ...props });
    },
  };
}
