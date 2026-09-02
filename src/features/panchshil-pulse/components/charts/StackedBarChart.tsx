import React, { useMemo } from "react";
import { getChartColors } from "../../utils/chartColors";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

export interface StackedSeries {
  label: string;
  data: number[];
  color: string;
}

export interface NegSeries {
  label: string;
  data: number[];
  color: string;
}

interface StackedBarChartProps {
  labels: string[];
  series: StackedSeries[];
  negSeries?: NegSeries;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ labels, series, negSeries }) => {
  const { theme } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const W = 600;
  const H = 260;
  const pl = 40;
  const pr = 12;
  const pt = 14;
  const pb = 26;
  const n = labels.length;

  const maxUp = useMemo(() => {
    return Math.max(...labels.map((_, i) => series.reduce((acc, s) => acc + s.data[i], 0)));
  }, [labels, series]);

  const maxDn = useMemo(() => {
    return negSeries ? Math.max(...negSeries.data) : 0;
  }, [negSeries]);

  const gap = (W - pl - pr) / n;
  const bw = gap * 0.52;

  const zero = pt + (H - pt - pb) * (maxUp / ((maxUp + maxDn) || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      {/* Bars & Labels */}
      {labels.map((lab, i) => {
        const x = pl + i * gap + (gap - bw) / 2;
        let yAccumulator = zero;

        return (
          <g key={i}>
            {/* Positive Stacked Bars */}
            {series.map((s, sIdx) => {
              const h = s.data[i] * scaleUp;
              yAccumulator -= h;
              return (
                <rect
                  key={sIdx}
                  x={x.toFixed(1)}
                  y={yAccumulator.toFixed(1)}
                  width={bw.toFixed(1)}
                  height={Math.max(0, h).toFixed(1)}
                  fill={s.color}
                />
              );
            })}

            {/* Negative Bar */}
            {negSeries && (
              <rect
                x={x.toFixed(1)}
                y={zero.toFixed(1)}
                width={bw.toFixed(1)}
                height={Math.max(0, negSeries.data[i] * scaleDn).toFixed(1)}
                fill={negSeries.color}
              />
            )}

            {/* X axis Label */}
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill={colors.faint}
              fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
            >
              {lab}
            </text>
          </g>
        );
      })}

      {/* Zero baseline */}
      <line
        x1={pl}
        y1={zero.toFixed(1)}
        x2={W - pr}
        y2={zero.toFixed(1)}
        stroke={colors.line}
      />
    </svg>
  );
};
