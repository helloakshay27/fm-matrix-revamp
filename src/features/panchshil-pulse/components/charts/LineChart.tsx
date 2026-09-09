import React, { useMemo } from "react";
import { getChartColors } from "../../utils/chartColors";
import { fmtC } from "../../utils/calculations";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

interface LineChartProps {
  cur: number[];
  prev?: number[];
  opts?: {
    pctScale?: boolean;
    labels?: string[];
    color?: string;
    fill?: string;
  };
}

export const LineChart: React.FC<LineChartProps> = ({ cur, prev, opts = {} }) => {
  const { prev: showPrev, theme } = usePulseDashboard();

  // Re-sync colors on theme change
  const colors = useMemo(() => getChartColors(), [theme]);

  const W = 680;
  const H = 250;
  const pl = opts.pctScale ? 54 : 44;
  const pr = 14;
  const pt = 16;
  const pb = 30;
  const base = H - pb;

  const color = opts.color || colors.blue;
  const fill = opts.fill || colors.fill;

  const allPoints = useMemo(() => {
    return cur.concat(prev && showPrev ? prev : []);
  }, [cur, prev, showPrev]);

  const mn = opts.pctScale ? Math.max(0, Math.min(...allPoints) - 0.6) : 0;
  const mx = opts.pctScale
    ? Math.min(100, Math.max(...allPoints) + 0.6)
    : Math.max(...allPoints) * 1.14 || 1;
  const span = (mx - mn) || 1;

  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1 || 1);

  const getX = (i: number) => pl + i * xw;
  const getY = (v: number) => pt + (H - pt - pb) * (1 - (v - mn) / span);

  const vfmt = opts.pctScale ? (v: number) => v.toFixed(1) + "%" : fmtC;

  const pathD = useMemo(() => {
    let d = "";
    for (let i = 0; i < cur.length; i++) {
      d += (i ? "L" : "M") + getX(i).toFixed(1) + " " + getY(cur[i]).toFixed(1) + " ";
    }
    return d;
  }, [cur, mn, mx, span]);

  const areaD = useMemo(() => {
    let d = "";
    for (let i = 0; i < cur.length; i++) {
      d += (i ? "L" : "M") + getX(i).toFixed(1) + " " + getY(cur[i]).toFixed(1) + " ";
    }
    d += "L" + getX(n - 1).toFixed(1) + " " + base + " L" + getX(0).toFixed(1) + " " + base + " Z";
    return d;
  }, [cur, mn, mx, span, n, base]);

  const prevPathD = useMemo(() => {
    if (!prev || !showPrev) return "";
    let d = "";
    for (let i = 0; i < prev.length; i++) {
      d += (i ? "L" : "M") + getX(i).toFixed(1) + " " + getY(prev[i]).toFixed(1) + " ";
    }
    return d;
  }, [prev, showPrev, mn, mx, span]);

  const step = Math.max(1, Math.ceil(n / 6));

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines & X labels */}
      {Array.from({ length: Math.ceil(n / step) }).map((_, idx) => {
        const i = idx * step;
        if (i >= n) return null;
        const x = getX(i).toFixed(1);
        const labelText = opts.labels ? opts.labels[i] : String(i + 1);
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
              {labelText}
            </text>
          </g>
        );
      })}

      {/* Y labels */}
      {Array.from({ length: 3 }).map((_, g) => {
        const y = pt + ((H - pt - pb) * g) / 2;
        const val = mn + span * (1 - g / 2);
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
            {vfmt(val)}
          </text>
        );
      })}

      {/* Baseline */}
      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke={colors.grid} />

      {/* Area Fill */}
      <path d={areaD} fill={fill} />

      {/* Previous Period Dashed line */}
      {prev && showPrev && (
        <path
          d={prevPathD}
          fill="none"
          stroke={colors.line}
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />
      )}

      {/* Current Period line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Final value dot */}
      {n > 0 && (
        <circle
          cx={getX(n - 1).toFixed(1)}
          cy={getY(cur[n - 1]).toFixed(1)}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};
