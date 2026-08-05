/**
 * External marketing landing pages (india.lockated.co) per product slug.
 *
 * Keys are the product slugs used by `/product/:productSlug` routes and by the
 * `slug` field in `src/pages/Products.tsx`. Some products are reachable under
 * more than one slug, so aliases are mapped to the same URL.
 *
 * Slugs absent from this map fall back to the in-app placeholder landing route
 * (`/product/:productSlug/landing`).
 */
export const PRODUCT_LANDING_PAGE_URLS: Record<string, string> = {
  // Lease Management
  "lease-management": "https://india.lockated.co/lease-management",

  // Facility Management (FM Matrix)
  "facility-management": "https://india.lockated.co/fm-matrix",
  "fm-matrix": "https://india.lockated.co/fm-matrix",

  // Loyalty Management & Cold Wallet
  "loyalty-engine": "https://india.lockated.co/loyalty-rule-engine",
  loyalty: "https://india.lockated.co/loyalty-rule-engine",

  // CP Management
  "cp-management": "https://india.lockated.co/cp-management",

  // Snag 360
  "snag-360": "https://india.lockated.co/snag-360",
  "snag-360-new": "https://india.lockated.co/snag-360",

  // Customer App Post Possession
  "customer-app-post-possession": "https://india.lockated.co/post-possession",

  // Project & Task Manager (PATM)
  "task-manager": "https://india.lockated.co/patm",

  // Vendor Management
  "vendor-management": "https://india.lockated.co/vendor-management",

  // Customer App Post Sales
  "customer-app-post-sales": "https://india.lockated.co/post-sales",

  // Club Management
  "club-management": "https://india.lockated.co/club-management",

  // Procurement / Contracts / Tendering
  procurement: "https://india.lockated.co/procurement-management",

  // Permit to Work
  ptw: "https://india.lockated.co/permit-to-work",

  // GoPhygital.work (Tenants Building)
  "gophygital-tenants": "https://india.lockated.co/tenant-management",

  // Gate Management (Smart Secure & QuikGate)
  "gate-management": "https://india.lockated.co/gate-management",

  // Surveys
  surveys: "https://india.lockated.co/survey",
};

export const getProductLandingPageUrl = (slug?: string) =>
  slug ? PRODUCT_LANDING_PAGE_URLS[slug] : undefined;
