import { getUser } from "@/utils/auth";

/**
 * Products that are restricted to a specific set of users.
 * Keyed by the product slug used in /product/:slug.
 *
 * A restricted product is visible only when:
 *  - the logged-in user's email is in the allow-list below, or
 *  - the app is running on localhost (local development).
 *
 * Products not listed here are visible to everyone.
 */
export const RESTRICTED_PRODUCT_EMAILS: Record<string, string[]> = {
  "life-compass": [
    "chetan.bafna@lockated.com",
    "adhip.shetty@lockated.com",
  ],
};

export const isLocalhostEnv = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.location.hostname.includes("localhost");
};

/**
 * Returns true when the current user is allowed to see the given product slug.
 */
export const canViewProduct = (slug: string): boolean => {
  const allowedEmails = RESTRICTED_PRODUCT_EMAILS[slug];

  // Not a restricted product - visible to everyone.
  if (!allowedEmails) return true;

  // Always available while developing locally.
  if (isLocalhostEnv()) return true;

  const email = getUser()?.email?.trim().toLowerCase();
  if (!email) return false;

  return allowedEmails.some((allowed) => allowed.toLowerCase() === email);
};
