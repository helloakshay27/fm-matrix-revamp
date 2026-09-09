import type { TileSpec } from "../../posthog-dashboard/data/metrics";

/** Arrow direction for a delta — `null`/0 render as a flat dash. */
export function deltaDir(delta: number | null | undefined): "up" | "dn" | "flat" {
  if (delta == null || delta === 0) return "flat";
  return delta > 0 ? "up" : "dn";
}

/** "12% vs prev. period" · `null` when the API reports no comparable value. */
export function deltaLabel(delta: number | null | undefined): string | null {
  return delta == null ? null : `${Math.abs(Math.round(delta))}% vs prev. period`;
}

/** Short duration, wireframe style ("4m", "3m 42s", "45s"). */
export function fmtDurShort(sec: number | null | undefined): string {
  if (sec == null || isNaN(sec)) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

export interface TileKpi {
  id?: string;
  label: string;
  val: string;
  raw?: number;
  dir: "up" | "dn" | "flat";
  delta: string | null;
  sub?: string;
  noTarget?: boolean;
  unit?: string;
  goodUp?: boolean;
}

export interface TileToKpiOpts {
  /** Pulse label (differs from the posthog-dashboard label). */
  label?: string;
  /** Benchmark id — omit/`null` when the tile has no target wiring. */
  id?: string | null;
  noTarget?: boolean;
  goodUp?: boolean;
}

/** Maps a posthog-dashboard `TileSpec` onto the pulse KpiTile prop shape. */
export function tileToKpi(t: TileSpec, opts: TileToKpiOpts = {}): TileKpi {
  return {
    id: opts.id ?? undefined,
    label: opts.label ?? t.label,
    val: t.disp,
    raw: t.raw,
    dir: deltaDir(t.delta),
    delta: deltaLabel(t.delta),
    sub: t.sub,
    noTarget: opts.noTarget,
    unit: t.unit,
    goodUp: opts.goodUp ?? t.goodUp,
  };
}