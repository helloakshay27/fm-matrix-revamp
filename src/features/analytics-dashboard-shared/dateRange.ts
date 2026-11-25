/** `YYYY-MM-DD` in local time — the format every `/fm/adoption/*` date param takes. */
export function ymd(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** `days` inclusive of today, matching the API's IST 00:00 → 23:59 snapping. */
export function dateRangeFor(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  return { from: ymd(from), to: ymd(to) };
}

/** Whole-day span between two `YYYY-MM-DD` dates, inclusive of both ends. */
export function daysBetween(from: string, to: string): number {
  return Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
}
