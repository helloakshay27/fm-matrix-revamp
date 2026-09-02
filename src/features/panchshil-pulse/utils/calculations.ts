export function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(a: number): () => number {
  return function() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFor(key: string): () => number {
  return mulberry32(hashStr(key));
}

export function fmtC(n: number): string {
  if (n >= 100000) return Math.round(n / 1000) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(Math.round(n));
}

export function pct(x: number, d?: number): string {
  return x.toFixed(d === undefined ? 0 : d) + '%';
}

export function getDevFactor(dev: string): number {
  return dev === 'ios' ? 0.58 : dev === 'android' ? 0.42 : 1;
}

export function getRangeFactor(range: number): number {
  return range / 30;
}

export function seriesForDev(base: number[], dev: string): number[] {
  const factor = getDevFactor(dev);
  return base.map(v => Math.round(v * factor));
}

export function prevSeries(base: number[], shrink: number, dev: string): number[] {
  const factor = getDevFactor(dev);
  return base.map(v => Math.round(v * shrink * factor));
}
