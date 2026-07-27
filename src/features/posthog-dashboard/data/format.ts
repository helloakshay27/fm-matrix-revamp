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
