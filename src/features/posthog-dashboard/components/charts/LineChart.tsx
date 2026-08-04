import { useId } from 'react';
import { fmtC } from '../../data/format';

interface LineChartProps {
  cur: number[];
  prev?: number[];
  showPrev?: boolean;
}

/** Usage/adoption-trend line chart: solid current-period line + dashed projected tail, faint dashed previous period, gradient fill. */
export function LineChart({ cur, prev, showPrev = true }: LineChartProps) {
  const gid = `phg-lg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const W = 640, H = 240, pl = 44, pr = 14, pt = 14, pb = 26;
  // A single point can't be drawn as a line, and Math.max() of nothing is -Infinity.
  if (cur.length < 2) return null;
  const all = [...cur, ...(prev ?? [])];
  const mx = Math.max(...all) * 1.12 || 1;
  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / mx);
  const pathStr = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');

  const gridLines: { y: number; val: number }[] = [];
  for (let g = 0; g <= 4; g++) {
    const y = pt + ((H - pt - pb) * g) / 4;
    gridLines.push({ y, val: Math.round(mx * (1 - g / 4)) });
  }

  let areaD = '';
  for (let i = 0; i < n - 1; i++) areaD += `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(cur[i]).toFixed(1)} `;
  areaD += `L${X(n - 2).toFixed(1)} ${H - pb} L${X(0).toFixed(1)} ${H - pb} Z`;

  return (
    <svg className="phg-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97757" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#d97757" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={pl} y1={g.y} x2={W - pr} y2={g.y} stroke="#efece2" strokeDasharray="3 4" />
          <text x={pl - 8} y={g.y + 4} textAnchor="end" fontSize={10} fill="#9b998f">{fmtC(g.val)}</text>
        </g>
      ))}
      {prev && prev.length > 1 && showPrev && (
        <path d={pathStr(prev)} fill="none" stroke="#b0aea5" strokeWidth={2} strokeDasharray="5 4" opacity={0.8} />
      )}
      <path d={areaD} fill={`url(#${gid})`} />
      <path d={pathStr(cur.slice(0, n - 1))} fill="none" stroke="var(--phg-orange)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={`M${X(n - 2).toFixed(1)} ${Y(cur[n - 2]).toFixed(1)} L${X(n - 1).toFixed(1)} ${Y(cur[n - 1]).toFixed(1)}`}
        fill="none" stroke="#b0aea5" strokeWidth={2.6} strokeDasharray="5 4"
      />
      <circle cx={X(n - 1)} cy={Y(cur[n - 1])} r={6.4} fill="var(--phg-orange)" opacity={0.16} />
      <circle cx={X(n - 1)} cy={Y(cur[n - 1])} r={3.2} fill="var(--phg-orange)" />
    </svg>
  );
}
