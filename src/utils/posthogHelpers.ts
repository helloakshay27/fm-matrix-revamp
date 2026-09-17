import posthog from "posthog-js";
import { getUser } from "@/utils/auth";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Fire a generic PostHog event with standard platform/release context.
 *
 * org -> company -> site -> email are read from localStorage, which is kept
 * in sync by Header.tsx (FM shell) and PulseDynamicHeader.tsx (Pulse shell) —
 * see those files' fetchAllowedCompanies/fetchAllowedSites effects. If a
 * given page hasn't mounted either shell yet this session, the corresponding
 * field is simply omitted rather than sent wrong.
 */
export const capturePostHogEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
  const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
  const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
  const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
  const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
  const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
  const _orgId = localStorage.getItem("selectedOrgId") ?? localStorage.getItem("organization_id") ?? localStorage.getItem("org_id");
  const orgIdNum = _orgId && !isNaN(Number(_orgId)) ? Number(_orgId) : undefined;

  posthog.capture(event, {
    platform: "web",
    release_version: RELEASE_VERSION,
    project_id: "P-223",
    project_code: "FM-01",
    organization_id: orgIdNum,
    organization_name: localStorage.getItem("selectedOrg") ?? undefined,
    company_id: companyIdNum,
    company_name: localStorage.getItem("selectedCompany") ?? undefined,
    site_id: siteIdNum,
    site_name: localStorage.getItem("selectedSiteName") ?? undefined,
    user_id: userIdNum,
    email: getUser()?.email ?? undefined,
    ...props,
  });
};

/**
 * Fire a Helpdesk product-analytics event with standard platform/release context.
 * Use this for all custom events defined in the Helpdesk Product Analytics Catalogue.
 */
export const captureHelpdeskEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  capturePostHogEvent(event, props);
};

/**
 * Fire a Pulse (Panchshil Pulse) product-analytics event with standard
 * platform/release context. Use this for all custom events across the
 * Pulse module (carpool, community, SOS, amenities, etc).
 * Pulse identifies its analytics context using project_code=TEP-01 ONLY —
 * project_id is explicitly neutralized so the shared base's P-223 default
 * never leaks into Pulse events (P-238 is never used either).
 */
export const capturePulseEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  capturePostHogEvent(event, { project_code: "TEP-01", project_id: undefined, ...props });
};

/**
 * Fire a Club Management helpdesk product-analytics event with standard
 * platform/release context. Use this for all custom events across the
 * Club Management helpdesk module (club-management/helpdesk routes).
 * Overrides project_code/project_id to CM-01/P-238.
 */
export const captureCMHelpdeskEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  capturePostHogEvent(event, { project_code: "CM-01", project_id: "P-238", ...props });
};

/**
 * Fire a Club Management product-analytics event. Use this for every custom
 * event across ALL Club Management modules (dashboard, memberships, user
 * management, amenities, notices, events, payments, vendor, community,
 * invoice, credit/debit note, wallet, helpdesk).
 * Overrides project_code/project_id to CM-01/P-238.
 */
export const captureCMEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  capturePostHogEvent(event, { project_code: "CM-01", project_id: "P-238", ...props });
};

const CM_ORIGIN_KEY = "ph_cm_origin";

/** True when the route is one of the Club Management app's own routes (/club-management/*). */
export const isCMRoutePath = (pathname: string): boolean =>
  pathname.startsWith("/club-management") ||
  pathname.startsWith("/settings/vas/booking-club");

/** True when the route is part of the Club Management helpdesk (…/club-management/helpdesk…). */
export const isCMHelpdeskPath = (pathname: string): boolean =>
  pathname.includes("/club-management/helpdesk");

/**
 * Shared route families used by Club Management AND other tenants (FM/Pulse).
 * A CM-originated flow reaching one of these keeps reporting CM-01/P-238, while
 * a direct FM/Pulse visit reports its own project. Prefix-matching deliberately
 * uses real route prefixes only (no /pulse/contests, /maintenance/schedule, …).
 */
export const isCMSharedPath = (pathname: string): boolean =>
  pathname.startsWith("/tickets") ||
  pathname.startsWith("/maintenance/ticket") ||
  pathname.startsWith("/maintenance/vendor") ||
  pathname.startsWith("/pulse/notices") ||
  pathname.startsWith("/pulse/events") ||
  pathname.startsWith("/pulse/community") ||
  pathname.startsWith("/vas/booking-club") ||
  pathname.startsWith("/settings/vas/membership-plan") ||
  pathname.startsWith("/settings/accessories") ||
  pathname.startsWith("/settings/payment-plan") ||
  pathname.startsWith("/settings/ticket-management") ||
  pathname.startsWith("/settings/house") ||
  pathname.startsWith("/settings/hsn-code") ||
  pathname.startsWith("/settings/roles") ||
  pathname.startsWith("/master/location");

/** Backwards-compatible alias used by the existing helpdesk instrumentation. */
export const isSharedHelpdeskPath = (pathname: string): boolean =>
  pathname.startsWith("/tickets") || pathname.startsWith("/maintenance/ticket");

/**
 * Remember that this tab's flow originated from Club Management. sessionStorage
 * survives SPA navigation and reloads within the same tab, so shared lifecycle
 * screens reached from a CM page keep reporting CM-01/P-238 without touching
 * any navigation or routing.
 */
export const markCMOrigin = (): void => {
  try {
    sessionStorage.setItem(CM_ORIGIN_KEY, "1");
  } catch {
    /* storage unavailable — fall back to pathname-only resolution */
  }
};

/** Backwards-compatible alias for the helpdesk instrumentation. */
export const markCMHelpdeskOrigin = markCMOrigin;

/** Drop the CM-origin marker once the user leaves the Club Management/shared family. */
export const clearCMOrigin = (): void => {
  try {
    sessionStorage.removeItem(CM_ORIGIN_KEY);
  } catch {
    /* storage unavailable — nothing to clear */
  }
};

/** Backwards-compatible alias for the helpdesk instrumentation. */
export const clearCMHelpdeskOrigin = clearCMOrigin;

/**
 * Project context for the shared CM/FM/Pulse components.
 *
 * Resolution order:
 *  1. Route itself is a Club Management route (/club-management/*) → CM-01/P-238 (marks origin)
 *  2. Shared family screen (tickets, amenity booking, notices, events, community,
 *     vendor, booking-club) reached from a CM-originated flow → CM-01/P-238
 *  3. Anything else (direct FM/Pulse visits included)             → FM-01/P-223
 */
export const resolveCMProjectContext = (): {
  project_code: string;
  project_id: string;
} => {
  const pathname = window.location.pathname || "";

  if (isCMRoutePath(pathname)) {
    markCMOrigin();
    return { project_code: "CM-01", project_id: "P-238" };
  }

  if (isCMSharedPath(pathname) && sessionStorage.getItem(CM_ORIGIN_KEY) === "1") {
    return { project_code: "CM-01", project_id: "P-238" };
  }

  return { project_code: "FM-01", project_id: "P-223" };
};

/** Keep the existing helpdesk-facing name working — it now covers the whole CM surface. */
export const resolveHelpdeskProjectContext = resolveCMProjectContext;

/**
 * True when the current route should report Club Management analytics. Use this
 * as a gate on shared FM/Pulse screens so CM events only fire for flows that
 * actually originated from the Club Management app (never polluting Pulse/FM).
 */
export const isCMContextActive = (): boolean =>
  resolveCMProjectContext().project_code === "CM-01";
