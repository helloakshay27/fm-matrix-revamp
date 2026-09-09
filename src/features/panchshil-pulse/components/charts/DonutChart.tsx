import React, { useMemo } from "react";
import { getChartColors } from "../../utils/chartColors";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

export interface DonutRow {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  rows: DonutRow[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ rows }) => {
  const { theme } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const total = useMemo(() => {
    return rows.reduce((acc, row) => acc + row.value, 0) || 1;
  }, [rows]);

  const W = 260;
  const H = 200;
  const cx = 90;
  const cy = 100;
  const rad = 62;
  const sw = 24;
  const circ = 2 * Math.PI * rad;

  // Compute accumulated stroke-dashoffsets for donut segments
  const segments = useMemo(() => {
    let acc = 0;
    return rows.map(r => {
      const frac = r.value / total;
      const len = frac * circ;
      const offset = -acc;
      acc += len;
      return {
        ...r,
        len,
        offset
      };
    });
  }, [rows, total, circ]);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      {/* Donut Arcs */}
      {segments.map((seg, idx) => (
        <circle
          key={idx}
          cx={cx}
          cy={cy}
          r={rad}
          fill="none"
          stroke={seg.color}
          strokeWidth={sw}
          strokeDasharray={`${seg.len.toFixed(1)} ${(circ - seg.len).toFixed(1)}`}
          strokeDashoffset={seg.offset.toFixed(1)}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}

      {/* Legend */}
      {rows.map((r, i) => {
        const percentage = Math.round((r.value / total) * 100);
        return (
          <g key={i}>
            <circle cx={188} cy={58 + i * 26} r={5} fill={r.color} />
            <text
              x={200}
              y={58 + i * 26 + 4}
              fontSize="12"
              fill={colors.ink}
              fontFamily="Inter,sans-serif"
            >
              {r.label} &middot; {percentage}%
            </text>
          </g>
        );
      })}
    </svg>
  );
};
