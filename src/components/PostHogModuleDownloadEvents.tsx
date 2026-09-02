import { usePostHog } from "@posthog/react";
import { normalizeRoute } from "@/utils/posthogContext";
import { markDownloadReported } from "@/utils/downloadTracking";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Module a screen belongs to, derived from its URL prefix (routing is prefix-grouped —
 * see CLAUDE.md §7 — so the path is a reliable module key and impossible to forget).
 */
export type AppModule =
  | "maintenance"
  | "safety"
  | "security"
  | "vas"
  | "settings"
  | "master"
  | "finance"
  | "accounting"
  | "vendor"
  | "crm"
  | "product"
  | "utility"
  | "pulse"
  | "club_management"
  | "business_compass"
  | "transitioning"
  | "market_place"
  | "other";

/** ORDER IS SIGNIFICANT — first match wins, so longer/more specific prefixes come first. */
const MODULE_BY_PREFIX: [prefix: string, module: AppModule, label: string][] = [
  ["/maintenance", "maintenance", "Maintenance"],
  ["/safety", "safety", "Safety"],
  ["/security", "security", "Security"],
  ["/vas", "vas", "VAS"],
  ["/settings", "settings", "Settings"],
  ["/ops-console/settings", "settings", "Settings"],
  ["/master", "master", "Master"],
  ["/ops-console/master", "master", "Master"],
  ["/finance", "finance", "Finance"],
  ["/accounting", "accounting", "Accounting"],
  ["/vendor", "vendor", "Vendor"],
  ["/crm", "crm", "CRM"],
  ["/product", "product", "Product"],
  ["/utility", "utility", "Utility"],
  ["/pulse", "pulse", "Pulse"],
  ["/club-management", "club_management", "Club Management"],
  ["/business-compass", "business_compass", "Business Compass"],
  ["/transitioning", "transitioning", "Transitioning"],
  ["/market-place", "market_place", "Market Place"],
];

const MODULE_LABEL: Record<AppModule, string> = {
  maintenance: "Maintenance",
  safety: "Safety",
  security: "Security",
  vas: "VAS",
  settings: "Settings",
  master: "Master",
  finance: "Finance",
  accounting: "Accounting",
  vendor: "Vendor",
  crm: "CRM",
  product: "Product",
  utility: "Utility",
  pulse: "Pulse",
  club_management: "Club Management",
  business_compass: "Business Compass",
  transitioning: "Transitioning",
  market_place: "Market Place",
  other: "App",
};

export function resolveModule(pathname: string = window.location.pathname): AppModule {
  for (const [prefix, module] of MODULE_BY_PREFIX) {
    if (pathname.startsWith(prefix)) return module;
  }
  return "other";
}

/** What kind of file left the browser. */
export type ModuleDownloadFormat = "xlsx" | "csv" | "json" | "pdf" | "png" | "zip" | "other";

/** Which control produced it. */
export type ModuleDownloadSource =
  | "list_export" // the shared EnhancedTable export button
  | "row_pdf" // per-row PDF / attachment on a list
  | "report_page" // a dedicated report/download screen
  | "chart_export" // a chart's own download button
  | "bulk_action" // export from a selection / bulk-action panel
  | "other";

/**
 * Cross-module download reporting, same shape as the M-Safe pack.
 *
 * The event NAME carries the module and what was downloaded — `Maintenance Download:
 * Assets` — so PostHog's activity feed reads without opening the event. Every event also
 * carries `download_event: true` plus `module`, so "everything anyone downloaded" stays a
 * single query (All events, filter `download_event = true`, break down by `module` /
 * `label` / `source`).
 *
 * `label` therefore MUST be a stable, low-cardinality string — never a record id or a
 * filename with a date in it, or the project's event list grows one name per record.
 */
export function useModuleDownloadEvents() {
  const posthog = usePostHog();

  const getCommonContext = () => {
    const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
    const _companyId =
      localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
    const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
    const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
    const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
    const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
    const _orgId =
      localStorage.getItem("selectedOrgId") ??
      localStorage.getItem("organization_id") ??
      localStorage.getItem("org_id");
    const orgIdNum = _orgId && !isNaN(Number(_orgId)) ? Number(_orgId) : undefined;

    return {
      project_id: "P-223",
      project_code: "FM-01",
      site_id: siteIdNum,
      site_name: localStorage.getItem("selectedSiteName") ?? undefined,
      company_id: companyIdNum,
      company_name: localStorage.getItem("selectedCompany") ?? undefined,
      organization_id: orgIdNum,
      organization_name: localStorage.getItem("selectedOrg") ?? undefined,
      user_id: userIdNum,
    };
  };

  return {
    onModuleDownloaded: (props: {
      /** What was downloaded, e.g. "Assets". Stable and low-cardinality — see above. */
      label: string;
      source: ModuleDownloadSource;
      file_format: ModuleDownloadFormat;
      succeeded: boolean;
      /** Defaults to the module derived from the current route. */
      module?: AppModule;
      row_count?: number | null;
      record_id?: string | number | null;
      failure_reason?: string | null;
    }) => {
      if (!posthog) return;
      const module = props.module ?? resolveModule();
      const label = props.label?.trim() || "Export";
      // Tell the global anchor-click fallback this download is already reported.
      markDownloadReported();

      posthog.capture(`${MODULE_LABEL[module]} Download: ${label}`, {
        platform: "web",
        release_version: RELEASE_VERSION,
        // One flag for "all downloads, every module" — see the doc comment.
        download_event: true,
        module,
        screen: normalizeRoute(),
        label,
        source: props.source,
        file_format: props.file_format,
        row_count: props.row_count ?? null,
        record_id: props.record_id ?? null,
        succeeded: props.succeeded,
        failure_reason: props.failure_reason ?? null,
        ...getCommonContext(),
      });
    },
  };
}
