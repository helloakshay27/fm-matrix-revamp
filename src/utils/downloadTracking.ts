import type { PostHog } from "posthog-js";
import { normalizeRoute } from "./posthogContext";

/**
 * Catch-all reporting for file downloads.
 *
 * The modules outside M-Safe have ~150 download points — per-row PDFs, job sheets, chart
 * images, attachment downloads — and almost all of them are written inline as
 * `const a = document.createElement('a'); a.download = name; a.click()`. There is no shared
 * helper to instrument, so rather than editing a hundred files (and relying on whoever adds
 * the hundred-and-first to remember), this patches the one thing every single one of them
 * goes through: an anchor click with a `download` attribute.
 *
 * It also picks up the library-driven saves — SheetJS `XLSX.writeFile` and jsPDF `save()`
 * both end in exactly this anchor-click in the browser.
 *
 * Explicitly instrumented downloads (the M-Safe pack, the shared EnhancedTable export) call
 * `markDownloadReported()` first, and this skips anything already reported, so one user
 * action stays one event.
 */

const MODULE_BY_PREFIX: [prefix: string, module: string, label: string][] = [
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

function resolveModule(pathname: string): { module: string; moduleLabel: string } {
  for (const [prefix, module, label] of MODULE_BY_PREFIX) {
    if (pathname.startsWith(prefix)) return { module, moduleLabel: label };
  }
  return { module: "other", moduleLabel: "App" };
}

const FORMATS = ["xlsx", "xls", "csv", "pdf", "png", "jpg", "jpeg", "json", "zip", "txt", "docx"];

function formatOf(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return FORMATS.includes(ext) ? (ext === "jpeg" ? "jpg" : ext) : "other";
}

/**
 * Filename → a label stable enough to live in an event name.
 *
 * Filenames routinely carry a record id or a date (`gate-pass-88213.pdf`,
 * `assets-2026-09-01.xlsx`); those parts are stripped, because an event name per record
 * would blow up the project's event list. What is left ("Gate Pass", "Assets") is the thing
 * the user actually downloaded.
 */
export function labelFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[a-z0-9]{1,5}$/i, "");
  const cleaned = withoutExt
    .replace(/\d{2,4}[-_/]\d{1,2}[-_/]\d{1,4}/g, " ") // dates
    .replace(/\d{3,}/g, " ") // ids and timestamps
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "File";
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 60);
}

// Downloads already reported by an explicit call site. Time-boxed rather than a boolean so a
// failed/aborted explicit report can never permanently mute the fallback.
let reportedAt = 0;
const DEDUPE_WINDOW_MS = 3000;

/** Called by explicitly instrumented downloads so the fallback below skips this click. */
export function markDownloadReported(): void {
  reportedAt = Date.now();
}

let installed = false;

export function installDownloadTracking(posthog: PostHog): void {
  if (installed || typeof HTMLAnchorElement === "undefined") return;
  installed = true;

  const originalClick = HTMLAnchorElement.prototype.click;

  HTMLAnchorElement.prototype.click = function patchedClick(this: HTMLAnchorElement) {
    // Analytics must never be able to break a download: report first inside its own
    // try/catch, then always perform the real click.
    try {
      const filename = this.getAttribute("download");
      if (filename !== null && Date.now() - reportedAt > DEDUPE_WINDOW_MS) {
        const label = labelFromFilename(filename || "");
        const { module, moduleLabel } = resolveModule(window.location.pathname);
        posthog.capture(`${moduleLabel} Download: ${label}`, {
          download_event: true,
          module,
          screen: normalizeRoute(),
          label,
          source: "file_link",
          file_format: formatOf(filename || ""),
          succeeded: true,
        });
      }
    } catch (err) {
      console.warn("[analytics] download tracking failed", err);
    }
    return originalClick.call(this);
  };
}
