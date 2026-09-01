import { useViDashboard } from '../../context/viDashboardStore';

export interface BarSeries {
  label: string;
  data: number[];
  color: string;
}

/**
 * Stacked bars with one "below the line" segment — the growth-accounting card. Bars above
 * zero are gains (new / returning / resurrecting), the bar below zero is the loss (dormant).
 */
export function StackedBarChart({
  labels,
  series,
  negSeries,
}: {
  labels: string[];
  series: BarSeries[];
  negSeries?: BarSeries;
}) {
  const { palette } = useViDashboard();
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

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      {labels.map((lab, i) => {
        const x = pl + i * gap + (gap - bw) / 2;
        let y = zero;
        const rects = series.map((s) => {
          const h = s.data[i] * scaleUp;
          y -= h;
          return (
            <rect
              key={`${s.label}-${i}`}
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
                height={Math.max(0, negSeries.data[i] * scaleDn).toFixed(1)}
                fill={negSeries.color}
              />
            )}
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill={palette.faint}
              fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
            >
              {lab}
            </text>
          </g>
        );
      })}
      <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke={palette.line} />
    </svg>
  );
}
