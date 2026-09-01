import React, { useMemo } from "react";
import { getChartColors } from "../../utils/chartColors";
import { fmtC } from "../../utils/calculations";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

interface SeatsChartProps {
  active: number[];
  ceiling: number;
  labels: string[];
}

export const SeatsChart: React.FC<SeatsChartProps> = ({ active, ceiling, labels }) => {
  const { theme } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const W = 680;
  const H = 250;
  const pl = 44;
  const pr = 14;
  const pt = 16;
  const pb = 30;
  const base = H - pb;

  const mx = Math.max(ceiling, Math.max(...active)) * 1.12 || 1;
  const n = active.length;
  const xw = (W - pl - pr) / (n - 1 || 1);

  const getX = (i: number) => pl + i * xw;
  const getY = (v: number) => pt + (H - pt - pb) * (1 - v / mx);

  const pathD = useMemo(() => {
    let d = "";
    for (let i = 0; i < active.length; i++) {
      d += (i ? "L" : "M") + getX(i).toFixed(1) + " " + getY(active[i]).toFixed(1) + " ";
    }
    return d;
  }, [active, mx]);

  const areaD = useMemo(() => {
    let d = "";
    for (let i = 0; i < active.length; i++) {
      d += (i ? "L" : "M") + getX(i).toFixed(1) + " " + getY(active[i]).toFixed(1) + " ";
    }
    d += "L" + getX(n - 1).toFixed(1) + " " + base + " L" + getX(0).toFixed(1) + " " + base + " Z";
    return d;
  }, [active, mx, n, base]);

  const sy = getY(ceiling).toFixed(1);
  const step = Math.max(1, Math.ceil(n / 6));

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines and X labels */}
      {Array.from({ length: Math.ceil(n / step) }).map((_, idx) => {
        const i = idx * step;
        if (i >= n) return null;
        const x = getX(i).toFixed(1);
        return (
          <g key={i}>
            <line
              x1={x}
              y1={pt}
              x2={x}
              y2={base}
              stroke={colors.grid}
              strokeDasharray="2 4"
            />
            <text
              x={x}
              y={H - 9}
              textAnchor="middle"
              fontSize="11"
              fill={colors.faint}
              fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}

      {/* Y labels */}
      {Array.from({ length: 3 }).map((_, g) => {
        const y = pt + ((H - pt - pb) * g) / 2;
        const val = Math.round(mx * (1 - g / 2));
        return (
          <text
            key={g}
            x={pl - 11}
            y={y + 4}
            textAnchor="end"
            fontSize="11"
            fill={colors.faint}
            fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
          >
            {fmtC(val)}
          </text>
        );
      })}

      {/* Baseline */}
      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke={colors.grid} />

      {/* Area fill */}
      <path d={areaD} fill={colors.fill} />

      {/* Active users trend line */}
      <path
        d={pathD}
        fill="none"
        stroke={colors.blue}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Ceiling limit line */}
      <line
        x1={pl}
        y1={sy}
        x2={W - pr}
        y2={sy}
        stroke={colors.amber}
        strokeWidth="2"
      />
    </svg>
  );
};
