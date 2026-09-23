/**
 * Best-effort human-readable label for a chart_code, since most Revamp Dashboard
 * cards don't expose a single clean title prop we can read at the wrapper level.
 * e.g. "fm-sla-breach" -> "Sla Breach"
 */
export function formatChartLabel(chartCode: string): string {
  return chartCode
    .replace(/^fm-/, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
