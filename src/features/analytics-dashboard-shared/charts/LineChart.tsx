import { useRef, useState } from 'react';
import { fmtC } from '../format';
import type { ChartPalette } from '../palette';

interface TooltipData {
  x: number;
  y: number;
  idx: number;
  curVal: number;
  prevVal?: number;
  label?: string;
}

/**
 * House-style single-series line chart: no chart frame, no horizontal rules, faint vertical
 * dashed gridlines at label positions only, three plain grey y-values, one saturated data
 * colour plus a pale area fill. The dashed overlay is the previous period, shown only when
 * the caller's "Previous period" toggle is on.
 *
 * Includes an interactive hover tooltip displaying the data under the cursor.
 */
export function LineChart({
  cur,
  prev,
  labels,
  color,
  fill,
  pctScale,
  palette,
  showPrev,
}: {
  cur: number[];
  prev?: number[] | null;
  labels?: string[];
  color?: string;
  fill?: string;
  pctScale?: boolean;
  palette: ChartPalette;
  /** Draw the dashed `prev` overlay — the ControlBar's "Previous period" toggle. */
  showPrev?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<TooltipData | null>(null);

  const stroke = color ?? palette.blue;
  const area = fill ?? palette.fill;

  const W = 680;
  const H = 250;
  const pl = pctScale ? 54 : 44;
  const pr = 14;
  const pt = 16;
  const pb = 30;

  // Show previous if provided and not explicitly turned off
  const overlay = prev && prev.length > 0 && showPrev !== false ? prev : null;
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

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || n < 1) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return;
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    if (mouseX < pl - 12 || mouseX > W - pr + 12) {
      setTip(null);
      return;
    }
    const idx = Math.min(n - 1, Math.max(0, Math.round((mouseX - pl) / (xw || 1))));
    setTip({
      x: X(idx),
      y: Y(cur[idx]),
      idx,
      curVal: cur[idx],
      prevVal: overlay ? overlay[idx] : undefined,
      label: labels ? labels[idx] : undefined,
    });
  };

  const hasPrev = tip?.prevVal !== undefined;
  const TIP_W = 146;
  const TIP_H = hasPrev ? 68 : 50;
  const flipLeft = tip ? tip.idx >= Math.floor(n / 2) : false;
  const rawTipX = tip ? (flipLeft ? tip.x - TIP_W - 12 : tip.x + 12) : 0;
  const tipX = Math.max(pl + 2, Math.min(rawTipX, W - pr - TIP_W - 2));
  const tipY = tip ? Math.max(pt + 2, Math.min(tip.y - TIP_H / 2, base - TIP_H - 4)) : 0;

  return (
    <svg
      ref={svgRef}
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTip(null)}
      style={{ cursor: 'crosshair', overflow: 'hidden' }}
    >
      {ticks.map((i) => (
        <line key={`g${i}`} x1={X(i).toFixed(1)} y1={pt} x2={X(i).toFixed(1)} y2={base} stroke={palette.grid} strokeDasharray="2 4" />
      ))}
      {[0, 1, 2].map((g) => (
        <text
          key={`y${g}`}
          x={pl - 11}
          y={pt + ((H - pt - pb) * g) / 2 + 4}
          textAnchor="end"
          fontSize="11"
          fill={palette.faint}
          fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
        >
          {vfmt(mn + span * (1 - g / 2))}
        </text>
      ))}
      {ticks.map((i) => (
        <text
          key={`x${i}`}
          x={X(i).toFixed(1)}
          y={H - 9}
          textAnchor="middle"
          fontSize="11"
          fill={palette.faint}
          fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
        >
          {labels ? labels[i] : i + 1}
        </text>
      ))}
      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke={palette.grid} />
      <path d={areaD} fill={area} />
      {overlay && <path d={path(overlay)} fill="none" stroke={palette.line} strokeWidth="1.8" strokeDasharray="4 4" />}
      <path d={path(cur)} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(n - 1).toFixed(1)} cy={Y(cur[n - 1]).toFixed(1)} r="3" fill={stroke} />

      {/* Hover crosshair + tooltip */}
      {tip && (
        <g style={{ pointerEvents: 'none' }}>
          {/* Vertical dashed guide line */}
          <line
            x1={tip.x.toFixed(1)}
            y1={pt}
            x2={tip.x.toFixed(1)}
            y2={base}
            stroke={palette.grid}
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Target circle on current line */}
          <circle
            cx={tip.x.toFixed(1)}
            cy={tip.y.toFixed(1)}
            r="5"
            fill={stroke}
            stroke="var(--surface, #ffffff)"
            strokeWidth="2"
          />

          {/* Target circle on previous line if present */}
          {hasPrev && tip.prevVal !== undefined && (
            <circle
              cx={tip.x.toFixed(1)}
              cy={Y(tip.prevVal).toFixed(1)}
              r="4"
              fill={palette.line}
              stroke="var(--surface, #ffffff)"
              strokeWidth="1.5"
            />
          )}

          {/* Tooltip Card Box */}
          <rect
            x={tipX.toFixed(1)}
            y={tipY.toFixed(1)}
            width={TIP_W}
            height={TIP_H}
            rx="7"
            ry="7"
            fill="var(--ink, #0f172a)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="0.8"
          />

          {/* Tooltip Header / Label */}
          <text
            x={(tipX + 11).toFixed(1)}
            y={(tipY + 16).toFixed(1)}
            fontSize="10.5"
            fontWeight="500"
            fill="var(--on-ink, #f8fafc)"
            opacity="0.7"
            fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
          >
            {tip.label ?? `Point ${tip.idx + 1}`}
          </text>

          {/* Current Value */}
          <circle cx={(tipX + 15).toFixed(1)} cy={(tipY + 31).toFixed(1)} r="3.5" fill={stroke} />
          <text
            x={(tipX + 24).toFixed(1)}
            y={(tipY + 35).toFixed(1)}
            fontSize="12.5"
            fontWeight="600"
            fill="var(--on-ink, #f8fafc)"
            fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
          >
            {vfmt(tip.curVal)}
            <tspan fontSize="10.5" fontWeight="400" fill="var(--on-ink, #f8fafc)" opacity="0.65"> current</tspan>
          </text>

          {/* Previous Value */}
          {hasPrev && tip.prevVal !== undefined && (
            <>
              <circle cx={(tipX + 15).toFixed(1)} cy={(tipY + 50).toFixed(1)} r="3" fill="var(--faint, #94a3b8)" />
              <text
                x={(tipX + 24).toFixed(1)}
                y={(tipY + 54).toFixed(1)}
                fontSize="11"
                fill="var(--on-ink, #f8fafc)"
                opacity="0.75"
                fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
              >
                {vfmt(tip.prevVal)}
                <tspan fontSize="10" opacity="0.6"> previous</tspan>
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  );
}

