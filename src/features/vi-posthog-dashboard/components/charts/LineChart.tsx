import { useRef, useState } from 'react';
import { useViDashboard } from '../../context/viDashboardStore';
import { fmtC } from '@/features/posthog-dashboard/data/format';

/**
 * House-style single-series line chart: no chart frame, no horizontal rules, faint vertical
 * dashed gridlines at label positions only, three plain grey y-values, one saturated data
 * colour plus a pale area fill. The dashed overlay is the previous period.
 *
 * The axis can only fit about six labels, so on a long series most points are unlabelled.
 * Hovering reads out the exact point — its own label plus the current and previous values —
 * which is the only way to tell what any individual point is worth.
 */
export function LineChart({
  cur,
  prev,
  labels,
  tipLabels,
  color,
  fill,
  pctScale,
}: {
  cur: number[];
  prev?: number[] | null;
  labels?: string[];
  /** Per-point hover text, when the axis labels are too terse to identify a point on their own. */
  tipLabels?: string[];
  color?: string;
  fill?: string;
  pctScale?: boolean;
}) {
  // The comparison overlay is driven by the ControlBar's "Previous period" toggle, which
  // lives on the dashboard state — there is no top-level `prev` on the context value.
  const { vm, palette } = useViDashboard();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const showPrev = vm.state.prev;
  const stroke = color ?? palette.blue;
  const area = fill ?? palette.fill;

  const W = 680;
  const H = 250;
  const pl = pctScale ? 54 : 44;
  const pr = 14;
  const pt = 16;
  const pb = 30;

  const overlay = prev && showPrev ? prev : null;
  const all = cur.concat(overlay ?? []);
  /* Percent-style series stay pinned near their true range so small real moves stay visible. */
  const mn = pctScale ? Math.max(0, Math.min(...all) - 0.6) : 0;
  const mx = pctScale ? Math.min(100, Math.max(...all) + 0.6) : Math.max(...all) * 1.14 || 1;
  const span = mx - mn || 1;

  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1 || 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - (v - mn) / span);
  const base = H - pb;
  const vfmt = pctScale ? (v: number) => `${v.toFixed(1)}%` : fmtC;
  const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');

  const step = Math.max(1, Math.ceil(n / 6));
  const ticks: number[] = [];
  for (let i = 0; i < n; i += step) ticks.push(i);

  const areaD = `${cur.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')} L${X(n - 1).toFixed(1)} ${base} L${X(0).toFixed(1)} ${base} Z`;

  const axisFont = 'Inter,-apple-system,Segoe UI,sans-serif';

  /**
   * The SVG scales to its container, so the pointer's client x has to be mapped back into
   * viewBox units before it can be turned into a point index. Snapping to the nearest point
   * means the whole plot is hoverable, not just the 2px line itself.
   */
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const x = (e.clientX - rect.left) * (W / rect.width);
    if (x < pl - 10 || x > W - pr + 10) {
      setHover(null);
      return;
    }
    setHover(Math.min(n - 1, Math.max(0, Math.round((x - pl) / xw))));
  };

  const i = hover;
  const tipPrev = i != null && overlay ? overlay[i] : undefined;
  const rows =
    i == null
      ? []
      : [
          { text: `${vfmt(cur[i])} current`, size: 13, weight: 500, dim: false },
          ...(tipPrev !== undefined
            ? [{ text: `${vfmt(tipPrev)} previous`, size: 12, weight: 400, dim: true }]
            : []),
        ];

  const TIP_W = 138;
  const TIP_H = 30 + rows.length * 18;
  // Flip the tooltip to the left of the cursor past the halfway mark so it never runs off
  // the right edge, then clamp both axes into the plot area.
  const rawX = i == null ? 0 : i >= Math.floor(n / 2) ? X(i) - TIP_W - 10 : X(i) + 10;
  const tipX = Math.max(pl, Math.min(rawX, W - pr - TIP_W));
  const tipY = i == null ? 0 : Math.max(pt, Math.min(Y(cur[i]) - TIP_H / 2, base - TIP_H));

  return (
    <svg
      ref={svgRef}
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      style={{ cursor: 'crosshair' }}
    >
      {ticks.map((t) => (
        <line key={`g${t}`} x1={X(t).toFixed(1)} y1={pt} x2={X(t).toFixed(1)} y2={base} stroke={palette.grid} strokeDasharray="2 4" />
      ))}
      {[0, 1, 2].map((g) => (
        <text
          key={`y${g}`}
          x={pl - 11}
          y={pt + ((H - pt - pb) * g) / 2 + 4}
          textAnchor="end"
          fontSize="11"
          fill={palette.faint}
          fontFamily={axisFont}
        >
          {vfmt(mn + span * (1 - g / 2))}
        </text>
      ))}
      {ticks.map((t) => (
        <text
          key={`x${t}`}
          x={X(t).toFixed(1)}
          y={H - 9}
          textAnchor="middle"
          fontSize="11"
          fill={palette.faint}
          fontFamily={axisFont}
        >
          {labels ? labels[t] : t + 1}
        </text>
      ))}
      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke={palette.grid} />
      <path d={areaD} fill={area} />
      {overlay && <path d={path(overlay)} fill="none" stroke={palette.line} strokeWidth="1.8" strokeDasharray="4 4" />}
      <path d={path(cur)} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(n - 1).toFixed(1)} cy={Y(cur[n - 1]).toFixed(1)} r="3" fill={stroke} />

      {i != null && (
        <g style={{ pointerEvents: 'none' }}>
          <line x1={X(i)} y1={pt} x2={X(i)} y2={base} stroke={palette.line} strokeWidth="1" strokeDasharray="3 3" />
          {tipPrev !== undefined && (
            <circle cx={X(i)} cy={Y(tipPrev)} r="3.5" fill={palette.line} />
          )}
          <circle cx={X(i)} cy={Y(cur[i])} r="4.5" fill={stroke} stroke={palette.onHeat} strokeWidth="2" />

          <rect x={tipX} y={tipY} width={TIP_W} height={TIP_H} rx="8" ry="8" fill={palette.ink} opacity="0.94" />
          <text x={tipX + 11} y={tipY + 17} fontSize="11" fill={palette.onHeat} opacity="0.8" fontFamily={axisFont}>
            {tipLabels?.[i] ?? labels?.[i] ?? `Point ${i + 1}`}
          </text>
          {rows.map((r, k) => (
            <text
              key={r.text}
              x={tipX + 11}
              y={tipY + 36 + k * 18}
              fontSize={r.size}
              fontWeight={r.weight}
              fill={palette.onHeat}
              opacity={r.dim ? 0.7 : 1}
              fontFamily={axisFont}
            >
              {r.text}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
