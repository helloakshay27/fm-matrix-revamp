/**
 * FM Adoption Analytics — tenant (domain) configuration.
 *
 * Every `/fm/adoption/*` request carries a `url` query param that identifies
 * the analytics tenant. This module is the single source of truth for that
 * tenant value, resolved dynamically so the correct tenant is sent for each
 * deployment/domain without hardcoding domains inside API functions or React
 * components.
 *
 * Resolution order (first match wins):
 *   1. VITE_FM_ADOPTION_TENANT_URL — explicit per-deployment override set at
 *      build time (the existing tenant configuration mechanism).
 *   2. The Pulse hostnames this app already treats as the Panchshil Pulse
 *      tenant (including `localhost`, which the app maps to the pulse-uat
 *      environment). Panchshil Pulse must be scoped to `pulse-uat.panchshil.com`,
 *      not the FM Matrix host.
 *   3. The FM Matrix tenant fallback.
 */
function resolveTenantUrl(): string {
  const fromEnv = (
    import.meta.env.VITE_FM_ADOPTION_TENANT_URL as string | undefined
  )?.trim();
  if (fromEnv) return fromEnv;

  const host =
    (typeof window !== "undefined" && window.location.hostname) || "";

  const isPulseHost =
    host === "pulse-uat.panchshil.com" ||
    host === "pulse.lockated.com" ||
    host === "localhost" ||
    host.includes("pulse.panchshil.com");

  if (isPulseHost) return "pulse-uat.panchshil.com";

  return "fm-matrix.lockated.com";
}

/** Tenant host sent as the `url` query param on every FM adoption request. */
export const FM_ADOPTION_TENANT_URL = resolveTenantUrl();

/**
 * Panchshil Pulse analytics project code.
 *
 * This is the single source of truth for the Pulse/TEP project code, because
 * the value is needed on BOTH sides of the analytics pipeline:
 *
 *   - the WRITE side stamps `project_code` on every Pulse event
 *     (src/utils/posthogHelpers.ts — capturePulseEvent and the $pageview
 *     project context for /pulse/* routes);
 *   - the READ side sends `project_code` as the scoping query param on every
 *     /fm/adoption/* request (src/features/posthog-dashboard/api/adoptionApi.ts).
 *
 * If those two ever disagree, the Pulse dashboard queries a project code that
 * no Pulse event carries, and every TEP-01-scoped metric comes back empty
 * (or, worse, silently reports another tenant's data). Keeping one constant
 * here makes that divergence impossible.
 *
 * Resolution order (first match wins):
 *   1. VITE_FM_ADOPTION_PROJECT_CODE — explicit per-deployment override set at
 *      build time.
 *   2. The Panchshil Pulse default, TEP-01.
 *
 * Note this is deliberately NOT hostname-resolved: the event write side and
 * the read side must always agree, and the read side already branches on the
 * resolved tenant. FM Matrix (FM-01) and Club Management (CM-01) are unaffected.
 */
function resolveProjectCode(): string {
  const fromEnv = (
    import.meta.env.VITE_FM_ADOPTION_PROJECT_CODE as string | undefined
  )?.trim();
  if (fromEnv) return fromEnv;

  return "TEP-01";
}

/** Project code sent as the `project_code` query param, and stamped on Pulse events. */
export const FM_ADOPTION_PROJECT_CODE = resolveProjectCode();
