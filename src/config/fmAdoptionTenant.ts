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
