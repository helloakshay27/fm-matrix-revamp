/**
 * Single source of truth for "should this render the Vi my Workspace shell?".
 *
 * Live behaviour is deliberately unchanged: on a production host the Vi shell renders on the
 * Vi domain and nowhere else, exactly as the old `hostname.includes("vi-web.gophygital.work")`
 * check did.
 *
 * The problem that needed solving was only about non-production: on UAT and on a local dev
 * server the hostname is never the Vi domain, so the app fell through to the admin/
 * ActionSidebar branches — or to the employee branch that renders no sidebar at all — and the
 * Vi app could not be worked on or QA'd outside production. So OUTSIDE production the Vi
 * tenant is recognised by org id instead of by host.
 *
 * Vi tenant = org 34, the same id that already drives Vi-specific API payloads (see
 * `isWebOrg34` in config/apiConfig.ts, services/roleService.ts and store/slices/viUsersSlice.ts).
 * That id is used ONLY on UAT/localhost here — never to flip a production host — because Vi
 * tenant accounts also sign in on shared production hosts such as web.gophygital.work, and
 * those must keep the layout they have always had.
 *
 * Layout.tsx and Header.tsx both read this, so the sidebar and the header can never disagree
 * about whether the user is in the Vi app.
 */

/** Vi tenant's organization id — consulted on UAT/localhost only (see the note above). */
const VI_ORG_ID = "34";

/** Production Vi deployment. This alone decides the Vi shell on production hosts. */
const VI_HOSTS = ["vi-web.gophygital.work"];

/**
 * Dev accounts that get the Vi shell on a local server even before a company/org has been
 * picked (org_id is not in localStorage yet on the first render after login).
 */
const VI_LOCAL_TEST_EMAILS = ["deveshjain928@gmail.com"];

/** The live Vi domain. */
export function isViHost(hostname: string = window.location.hostname): boolean {
  return VI_HOSTS.some((host) => hostname.includes(host));
}

export function isLocalHostname(hostname: string = window.location.hostname): boolean {
  return hostname.includes("localhost") || hostname.includes("127.0.0.1");
}

/**
 * Non-production environments: a local dev server, or any UAT host (`fm-uat.gophygital.work`,
 * `pulse-uat.panchshil.com`, a future `vi-uat.*`). Only here is the tenant allowed to decide
 * the layout.
 */
export function isNonProdEnvironment(hostname: string = window.location.hostname): boolean {
  return isLocalHostname(hostname) || hostname.includes("uat");
}

/** True for the Vi tenant (org 34). */
export function isViTenant(): boolean {
  return localStorage.getItem("org_id") === VI_ORG_ID;
}

/** True when this user's email is one of the local-only Vi dev accounts. */
export function isViLocalTestUser(email?: string | null): boolean {
  if (!email || !isLocalHostname()) return false;
  return VI_LOCAL_TEST_EMAILS.includes(email);
}

/**
 * The one check components should use.
 *
 * - Production hosts: true only on the Vi domain — identical to the previous behaviour.
 * - UAT / localhost: also true for the Vi tenant (org 34) and the local Vi dev accounts.
 *
 * `email` is optional; pass it so the local dev accounts are covered before org_id is set.
 */
export function isViLayoutActive(email?: string | null): boolean {
  if (isViHost()) return true;
  if (!isNonProdEnvironment()) return false;
  return isViTenant() || isViLocalTestUser(email);
}
