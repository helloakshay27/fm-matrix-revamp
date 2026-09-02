/**
 * Non-production-only escape hatch for rendering the Vi my Workspace shell.
 *
 * SCOPE, DELIBERATELY NARROW: this file has no say over production. It never looks at a
 * production hostname and it cannot turn the Vi shell on (or off) there — including on
 * `vi-web.gophygital.work`, whose behaviour stays owned by Layout.tsx's own long-standing
 * `isViSite = hostname.includes("vi-web.gophygital.work")` check. Callers combine the two:
 *
 *     const isViLayout = isViSite || isViNonProdOverride(user?.email);
 *
 * so on every deployed host the result is bit-for-bit what it was before this file existed.
 *
 * The problem it solves is only about testing: on UAT and on a local dev server the hostname
 * is never the Vi domain, so the app fell through to the admin/ActionSidebar branches — or to
 * the employee branch that renders no sidebar at all — and the Vi app could not be worked on
 * or QA'd outside production. On those environments only, the Vi tenant is recognised by org
 * id instead of by host.
 */

/**
 * Vi tenant's organization id — the same id that already drives Vi-specific API payloads
 * (see `isWebOrg34` in config/apiConfig.ts, services/roleService.ts, store/slices/viUsersSlice.ts).
 * Consulted on UAT/localhost only: Vi tenant accounts also sign in on shared production hosts,
 * and those must keep the layout they have always had.
 */
const VI_ORG_ID = "34";

/**
 * UAT hosts, listed explicitly rather than matched on a "uat" substring.
 *
 * `fm-matrix.lockated.com` is this project's UAT deployment and has no "uat" in its name, so a
 * substring rule silently treated it as production — which is why the Vi shell did not appear
 * on UAT. An explicit list also removes the opposite trap: a future *production* domain that
 * happens to contain "uat" can never be mistaken for a test environment.
 *
 * The app already treats these as non-production elsewhere — Layout.tsx folds
 * `fm-matrix.lockated.com` into its `isLocalhost` flag, and auth.ts calls
 * `dev-fm-matrix.lockated.com` the dev site.
 *
 * Other teams' UAT deployments are deliberately NOT here; this list covers only the FM/Vi
 * environments this change is meant for.
 */
const NON_PROD_HOSTS = [
  "fm-matrix.lockated.com", // FM/Vi UAT (also matches dev-fm-matrix.lockated.com)
  "fm-uat.gophygital.work",
];

/**
 * Dev/QA accounts that get the Vi shell on non-production environments, even before a
 * company/org has landed in localStorage.
 */
const VI_TEST_ACCOUNTS = ["deveshjain928@gmail.com"];

export function isLocalHostname(hostname: string = window.location.hostname): boolean {
  return hostname.includes("localhost") || hostname.includes("127.0.0.1");
}

/** A local dev server or one of the FM/Vi UAT hosts — never a production host. */
export function isNonProdEnvironment(hostname: string = window.location.hostname): boolean {
  return isLocalHostname(hostname) || NON_PROD_HOSTS.some((host) => hostname.includes(host));
}

/**
 * True for the Vi tenant (org 34).
 *
 * The org id is written under three different keys across this app (`org_id` in 72 places,
 * `organization_id` in 33, `selectedOrgId` in 21) and which one is populated depends on the
 * login path taken, so all three are read.
 */
export function isViTenant(): boolean {
  const ORG_KEYS = ["org_id", "organization_id", "selectedOrgId"];
  return ORG_KEYS.some((key) => localStorage.getItem(key) === VI_ORG_ID);
}

/** True when this user is one of the Vi dev/QA accounts, on a non-production environment. */
export function isViTestAccount(email?: string | null): boolean {
  if (!email || !isNonProdEnvironment()) return false;
  return VI_TEST_ACCOUNTS.includes(email);
}

/**
 * Should the Vi shell be forced on **in a non-production environment**?
 *
 * Returns false on every production host, whatever the tenant or the account — production is
 * decided solely by the caller's own hostname check. `email` is optional; pass it so the
 * dev/QA accounts are covered before org_id lands in localStorage.
 */
export function isViNonProdOverride(email?: string | null): boolean {
  if (!isNonProdEnvironment()) return false;
  return isViTenant() || isViTestAccount(email);
}
