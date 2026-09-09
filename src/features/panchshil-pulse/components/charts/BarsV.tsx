import React, { useMemo } from "react";
import { getChartColors } from "../../utils/chartColors";
import { fmtC } from "../../utils/calculations";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

interface BarItem {
  label: string;
  value: number;
}

interface BarsVProps {
  items: BarItem[];
}

export const BarsV: React.FC<BarsVProps> = ({ items }) => {
  const { theme } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const W = 560;
  const H = 215;
  const pl = 34;
  const pr = 10;
  const pt = 16;
  const pb = 30;
  const base = H - pb;

  const mx = Math.max(...items.map(i => i.value)) * 1.12 || 1;
  const n = items.length;
  const slot = (W - pl - pr) / n;
  const bw = Math.min(96, slot * 0.56);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      {/* Y labels */}
      {Array.from({ length: 3 }).map((_, g) => {
        const y = pt + ((base - pt) * g) / 2;
        const val = Math.round(mx * (1 - g / 2));
        return (
          <text
            key={g}
            x={pl - 10}
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

      {/* Bars */}
      {items.map((it, i) => {
        const h = (base - pt) * (it.value / mx);
        const x = pl + i * slot + (slot - bw) / 2;
        return (
          <g key={i}>
            <rect
              x={x.toFixed(1)}
              y={(base - h).toFixed(1)}
              width={bw.toFixed(1)}
              height={Math.max(0, h).toFixed(1)}
              rx="3"
              fill={colors.blue}
            />
            <text
              x={x + bw / 2}
              y={H - 9}
              textAnchor="middle"
              fontSize="11"
              fill={colors.faint}
              fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
            >
              {it.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
