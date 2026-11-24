/**
 * Number/string formatting for the Calendar analytics dashboard.
 * Ported verbatim from the wireframe's own helpers.
 *
 * The other dashboards keep their own copies of these, deliberately: they are live, and were
 * left untouched so that nothing which already works changes behaviour because the Calendar
 * dashboard was added.
 */

/** Compact count: 1234 → "1.2K", 123456 → "123K". */
export function fmtC(n: number): string {
  if (n >= 100000) return Math.round(n / 1000) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(Math.round(n));
}

/** `x` is already on a 0-100 scale. */
export function pct(x: number, d = 0): string {
  return x.toFixed(d) + '%';
}

export function fmtDur(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

/** For text interpolated into hand-built SVG/HTML markup. */
export function esc(s: unknown): string {
  return String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string),
  );
}

export function truncLabel(s: unknown, max: number): string {
  const str = String(s);
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}
