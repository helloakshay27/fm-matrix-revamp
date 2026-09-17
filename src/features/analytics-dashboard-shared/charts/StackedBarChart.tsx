import { useRef, useState } from 'react';
import { fmtC } from '../format';
import type { ChartPalette } from '../palette';

export interface BarSeries {
  label: string;
  data: number[];
  color: string;
}

/**
 * Stacked bars with one "below the line" segment — the growth-accounting card. Bars above
 * zero are gains (new / returning / resurrecting), the bar below zero is the loss (dormant).
 *
 * Includes an interactive cursor hover tooltip displaying the breakdown for that week.
 */
export function StackedBarChart({
  labels,
  series,
  negSeries,
  palette,
}: {
  labels: string[];
  series: BarSeries[];
  negSeries?: BarSeries;
  palette: ChartPalette;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const W = 600;
  const H = 260;
  const pl = 40;
  const pr = 12;
  const pt = 14;
  const pb = 26;

  const n = labels.length;
  const maxUp = Math.max(1, ...labels.map((_, i) => series.reduce((a, s) => a + (s.data[i] || 0), 0)));
  const maxDn = negSeries ? Math.max(0, ...negSeries.data) : 0;
  const gap = (W - pl - pr) / (n || 1);
  const bw = gap * 0.52;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || n < 1) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return;
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    if (mouseX < pl || mouseX > W - pr) {
      setHoverIdx(null);
      return;
    }
    const idx = Math.floor((mouseX - pl) / gap);
    if (idx >= 0 && idx < n) {
      setHoverIdx(idx);
    } else {
      setHoverIdx(null);
    }
  };

  const TIP_W = 158;
  const TIP_H = negSeries ? 104 : 84;
  const flipLeft = hoverIdx != null && hoverIdx >= Math.floor(n / 2);
  const hitX = hoverIdx != null ? pl + hoverIdx * gap + gap / 2 : 0;
  const rawTipX = flipLeft ? hitX - TIP_W - 12 : hitX + 12;
  const tipX = Math.max(pl + 2, Math.min(rawTipX, W - pr - TIP_W - 2));
  const tipY = Math.max(pt + 2, Math.min(zero - TIP_H / 2, H - pb - TIP_H - 2));

  return (
    <svg
      ref={svgRef}
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
      style={{ cursor: 'crosshair', overflow: 'hidden' }}
    >
      {/* Background column highlight on hover */}
      {hoverIdx != null && (
        <rect
          x={(pl + hoverIdx * gap + 2).toFixed(1)}
          y={pt}
          width={(gap - 4).toFixed(1)}
          height={H - pt - pb}
          fill={palette.grid}
          opacity="0.3"
          rx="4"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {labels.map((lab, i) => {
        const x = pl + i * gap + (gap - bw) / 2;
        let y = zero;
        const rects = series.map((s) => {
          const h = (s.data[i] || 0) * scaleUp;
          y -= h;
          return (
            <rect
              key={`${s.label}-${i}`}
              x={x.toFixed(1)}
              y={y.toFixed(1)}
              width={bw.toFixed(1)}
              height={Math.max(0, h).toFixed(1)}
              fill={s.color}
              opacity={hoverIdx != null && hoverIdx !== i ? 0.6 : 1}
              style={{ transition: 'opacity 0.15s ease' }}
            />
          );
        });
        const dnHeight = negSeries ? Math.max(0, (negSeries.data[i] || 0) * scaleDn) : 0;
        return (
          <g key={lab}>
            {rects}
            {negSeries && (
              <rect
                x={x.toFixed(1)}
                y={zero.toFixed(1)}
                width={bw.toFixed(1)}
                height={dnHeight.toFixed(1)}
                fill={negSeries.color}
                opacity={hoverIdx != null && hoverIdx !== i ? 0.6 : 1}
                style={{ transition: 'opacity 0.15s ease' }}
              />
            )}
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight={hoverIdx === i ? '600' : '400'}
              fill={hoverIdx === i ? 'var(--ink)' : palette.faint}
              fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
            >
              {lab}
            </text>
          </g>
        );
      })}
      <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke={palette.line} />

      {/* Hover tooltip card */}
      {hoverIdx != null && (
        <g style={{ pointerEvents: 'none' }}>
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
          <text
            x={(tipX + 11).toFixed(1)}
            y={(tipY + 16).toFixed(1)}
            fontSize="10.5"
            fontWeight="600"
            fill="var(--on-ink, #f8fafc)"
            opacity="0.75"
            fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
          >
            Week {labels[hoverIdx]}
          </text>

          {series.map((s, si) => {
            const itemY = tipY + 33 + si * 16;
            return (
              <g key={s.label}>
                <circle cx={(tipX + 15).toFixed(1)} cy={(itemY - 3.5).toFixed(1)} r="3.5" fill={s.color} />
                <text
                  x={(tipX + 24).toFixed(1)}
                  y={itemY.toFixed(1)}
                  fontSize="11"
                  fill="var(--on-ink, #f8fafc)"
                  opacity="0.8"
                  fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
                >
                  {s.label}:
                </text>
                <text
                  x={(tipX + TIP_W - 12).toFixed(1)}
                  y={itemY.toFixed(1)}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--on-ink, #f8fafc)"
                  fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
                >
                  {fmtC(s.data[hoverIdx] || 0)}
                </text>
              </g>
            );
          })}

          {negSeries && (
            <g>
              <circle
                cx={(tipX + 15).toFixed(1)}
                cy={(tipY + 33 + series.length * 16 - 3.5).toFixed(1)}
                r="3.5"
                fill={negSeries.color}
              />
              <text
                x={(tipX + 24).toFixed(1)}
                y={(tipY + 33 + series.length * 16).toFixed(1)}
                fontSize="11"
                fill="var(--on-ink, #f8fafc)"
                opacity="0.8"
                fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
              >
                {negSeries.label}:
              </text>
              <text
                x={(tipX + TIP_W - 12).toFixed(1)}
                y={(tipY + 33 + series.length * 16).toFixed(1)}
                textAnchor="end"
                fontSize="11"
                fontWeight="600"
                fill="var(--on-ink, #f8fafc)"
                fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
              >
                {fmtC(negSeries.data[hoverIdx] || 0)}
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

