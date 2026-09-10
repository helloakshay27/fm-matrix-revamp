import { useState } from 'react';
import { fmtC } from '@/features/posthog-dashboard/data/format';
import { useViDashboard } from '../../context/viDashboardStore';

export interface BarSeries {
  label: string;
  data: number[];
  color: string;
}

/**
 * Stacked bars with one "below the line" segment — the growth-accounting card. Bars above
 * zero are gains (new / returning / resurrecting), the bar below zero is the loss (dormant).
 *
 * The axis numbers the weeks rather than dating them, so hovering a column is what says which
 * week it is (`tipLabels`) and how the four segments actually split — the stack only shows
 * their relative heights, and the small ones are unreadable next to Returning.
 */
export function StackedBarChart({
  labels,
  tipLabels,
  series,
  negSeries,
}: {
  labels: string[];
  /** Per-column hover heading; falls back to the axis label. */
  tipLabels?: string[];
  series: BarSeries[];
  negSeries?: BarSeries;
}) {
  const { palette } = useViDashboard();
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 260;
  const pl = 40;
  const pr = 12;
  const pt = 14;
  const pb = 26;

  const n = labels.length;
  const maxUp = Math.max(...labels.map((_, i) => series.reduce((a, s) => a + s.data[i], 0)));
  const maxDn = negSeries ? Math.max(...negSeries.data) : 0;
  const gap = (W - pl - pr) / n;
  const bw = gap * 0.52;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  const font = 'Inter,-apple-system,Segoe UI,sans-serif';

  const i = hover;
  const rows = i == null ? [] : [...series, ...(negSeries ? [negSeries] : [])];
  const TIP_W = 158;
  const TIP_H = 26 + rows.length * 17;
  // Flip to the left of the column past the halfway mark so the card cannot run off the edge.
  const colX = i == null ? 0 : pl + i * gap + gap / 2;
  const tipX = i == null ? 0 : Math.max(pl, Math.min(i >= n / 2 ? colX - TIP_W - 8 : colX + 8, W - pr - TIP_W));
  const tipY = Math.max(pt, Math.min(pt + 6, H - pb - TIP_H));

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setHover(null)}>
      {labels.map((lab, idx) => {
        const x = pl + idx * gap + (gap - bw) / 2;
        let y = zero;
        const rects = series.map((s) => {
          const h = s.data[idx] * scaleUp;
          y -= h;
          return (
            <rect
              key={`${s.label}-${idx}`}
              x={x.toFixed(1)}
              y={y.toFixed(1)}
              width={bw.toFixed(1)}
              height={Math.max(0, h).toFixed(1)}
              fill={s.color}
            />
          );
        });
        return (
          <g key={lab}>
            {rects}
            {negSeries && (
              <rect
                x={x.toFixed(1)}
                y={zero.toFixed(1)}
                width={bw.toFixed(1)}
                height={Math.max(0, negSeries.data[idx] * scaleDn).toFixed(1)}
                fill={negSeries.color}
              />
            )}
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill={palette.faint}
              fontFamily={font}
            >
              {lab}
            </text>
            {/* Full-height hit area, so the thin segments are hoverable too. */}
            <rect
              x={(pl + idx * gap).toFixed(1)}
              y={pt}
              width={gap.toFixed(1)}
              height={(H - pt - pb).toFixed(1)}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHover(idx)}
            />
          </g>
        );
      })}
      <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke={palette.line} />

      {i != null && (
        <g style={{ pointerEvents: 'none' }}>
          <rect x={tipX} y={tipY} width={TIP_W} height={TIP_H} rx="8" ry="8" fill={palette.ink} opacity="0.94" />
          <text x={tipX + 11} y={tipY + 16} fontSize="11" fill={palette.onHeat} opacity="0.8" fontFamily={font}>
            {tipLabels?.[i] ?? labels[i]}
          </text>
          {rows.map((s, k) => (
            <g key={s.label}>
              <rect x={tipX + 11} y={tipY + 27 + k * 17} width="7" height="7" rx="2" fill={s.color} />
              <text x={tipX + 24} y={tipY + 34 + k * 17} fontSize="11.5" fill={palette.onHeat} fontFamily={font}>
                {s.label}
              </text>
              <text
                x={tipX + TIP_W - 11}
                y={tipY + 34 + k * 17}
                textAnchor="end"
                fontSize="11.5"
                fontWeight={500}
                fill={palette.onHeat}
                fontFamily={font}
              >
                {fmtC(s.data[i])}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
