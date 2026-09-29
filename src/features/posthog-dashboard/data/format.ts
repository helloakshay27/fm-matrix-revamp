export function fmtC(n: number): string {
  if (n >= 100000) return Math.round(n / 1000) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(2) + 'K';
  return String(n);
}

export function fmtDur(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function pct(x: number, d = 0): string {
  return (x * 100).toFixed(d) + '%';
}

/** For API values that already arrive as a percentage (0-100); `null` renders as an em dash. */
export function pctVal(x: number | null | undefined, d = 1): string {
  return x == null ? '—' : x.toFixed(d) + '%';
}

export function formatRelativeActivityTime(minutesAgo: number | null): string {
  if (minutesAgo == null || minutesAgo < 1) return 'just now';
  if (minutesAgo < 60) return `${Math.floor(minutesAgo)}m ago`;
  if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}h ago`;
  if (minutesAgo < 43200) return `${Math.floor(minutesAgo / 1440)}d ago`;
  return `${Math.floor(minutesAgo / 43200)}mo ago`;
}
