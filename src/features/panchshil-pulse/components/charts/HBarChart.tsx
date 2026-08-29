import React, { useMemo } from "react";
import { getChartColors } from "../../utils/chartColors";
import { fmtC } from "../../utils/calculations";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

interface HBarChartProps {
  labels: string[];
  values: number[];
  color?: string;
  colorArr?: string[];
}

function truncLabel(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export const HBarChart: React.FC<HBarChartProps> = ({ labels, values, color, colorArr }) => {
  const { theme } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const W = 720;
  const rowH = 28;
  const pr = 58;
  const pt = 6;
  const pb = 6;
  const n = labels.length;
  const H = pt + pb + n * rowH;

  const mx = Math.max(...values) * 1.08 || 1;
  const labelW = 196; // Left label column width
  const chartW = W - pr - labelW - 14;

  const defaultColor = color || colors.blue;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      {labels.map((lab, i) => {
        const y = pt + i * rowH;
        const bh = rowH * 0.62;
        const w = Math.max(2, (values[i] / mx) * chartW);
        const col = (colorArr && colorArr[i]) || defaultColor;

        return (
          <g key={i}>
            <text
              x={labelW}
              y={y + bh / 2 + 4}
              textAnchor="end"
              fontSize="11.5"
              fill={colors.ink}
              fontFamily="Inter,sans-serif"
            >
              <title>{lab}</title>
              {truncLabel(lab, 26)}
            </text>
            <rect
              x={labelW + 10}
              y={y}
              width={w.toFixed(1)}
              height={bh.toFixed(1)}
              rx="4"
              fill={col}
            />
            <text
              x={labelW + 10 + w + 8}
              y={y + bh / 2 + 4}
              fontSize="11.5"
              fill={colors.ink}
              fontFamily="Inter,sans-serif"
              fontWeight="500"
            >
              {fmtC(values[i])}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
