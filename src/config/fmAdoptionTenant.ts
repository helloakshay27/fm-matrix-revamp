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

  if (host === "web.gophygital.work") return "web.gophygital.work";

  return "fm-matrix.lockated.com";
}

/** Tenant host sent as the `url` query param on every FM adoption request. */
export const FM_ADOPTION_TENANT_URL = resolveTenantUrl();

/**
 * Panchshil Pulse analytics project code.
 *
 * The WRITE side stamps it as `project_code` on every Pulse event
 * (src/utils/posthogHelpers.ts — capturePulseEvent and the $pageview project
 * context for /pulse/* routes). The READ side does not send it: the Pulse
 * dashboard calls its own analytics API (/commercial/pulse/adoption), which
 * fixes project_code TEP-01 on the server. If this value ever changes, change
 * Commercial::PulseController in the analytics backend with it, or the Pulse
 * dashboard reads a project code no Pulse event carries.
 *
 * Resolution order (first match wins):
 *   1. VITE_FM_ADOPTION_PROJECT_CODE — explicit per-deployment override set at
 *      build time.
 *   2. The Panchshil Pulse default, TEP-01.
 *
 * Note this is deliberately NOT hostname-resolved: every Pulse event must carry
 * the same code wherever it is sent from. FM Matrix (FM-01) and Club Management
 * (CM-01) are unaffected.
 */
function resolveProjectCode(): string {
  const fromEnv = (
    import.meta.env.VITE_FM_ADOPTION_PROJECT_CODE as string | undefined
  )?.trim();
  if (fromEnv) return fromEnv;

  return "TEP-01";
}

/** Project code stamped on Pulse events (the Pulse analytics API reads TEP-01). */
export const FM_ADOPTION_PROJECT_CODE = resolveProjectCode();
