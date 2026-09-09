import { useViDashboard } from '../../context/viDashboardStore';
import { fmtC } from '@/features/posthog-dashboard/data/format';

/**
 * House-style single-series line chart: no chart frame, no horizontal rules, faint vertical
 * dashed gridlines at label positions only, three plain grey y-values, one saturated data
 * colour plus a pale area fill. The dashed overlay is the previous period.
 */
export function LineChart({
  cur,
  prev,
  labels,
  color,
  fill,
  pctScale,
}: {
  cur: number[];
  prev?: number[] | null;
  labels?: string[];
  color?: string;
  fill?: string;
  pctScale?: boolean;
}) {
  // The comparison overlay is driven by the ControlBar's "Previous period" toggle, which
  // lives on the dashboard state — there is no top-level `prev` on the context value.
  const { vm, palette } = useViDashboard();
  const showPrev = vm.state.prev;
  const stroke = color ?? palette.blue;
  const area = fill ?? palette.fill;

  const W = 680;
  const H = 250;
  const pl = pctScale ? 54 : 44;
  const pr = 14;
  const pt = 16;
  const pb = 30;

  const overlay = prev && showPrev ? prev : null;
  const all = cur.concat(overlay ?? []);
  /* Percent-style series stay pinned near their true range so small real moves stay visible. */
  const mn = pctScale ? Math.max(0, Math.min(...all) - 0.6) : 0;
  const mx = pctScale ? Math.min(100, Math.max(...all) + 0.6) : Math.max(...all) * 1.14 || 1;
  const span = mx - mn || 1;

  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1 || 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - (v - mn) / span);
  const base = H - pb;
  const vfmt = pctScale ? (v: number) => `${v.toFixed(1)}%` : fmtC;
  const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');

  const step = Math.max(1, Math.ceil(n / 6));
  const ticks: number[] = [];
  for (let i = 0; i < n; i += step) ticks.push(i);

  const areaD = `${cur.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')} L${X(n - 1).toFixed(1)} ${base} L${X(0).toFixed(1)} ${base} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {ticks.map((i) => (
        <line key={`g${i}`} x1={X(i).toFixed(1)} y1={pt} x2={X(i).toFixed(1)} y2={base} stroke={palette.grid} strokeDasharray="2 4" />
      ))}
      {[0, 1, 2].map((g) => (
        <text
          key={`y${g}`}
          x={pl - 11}
          y={pt + ((H - pt - pb) * g) / 2 + 4}
          textAnchor="end"
          fontSize="11"
          fill={palette.faint}
          fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
        >
          {vfmt(mn + span * (1 - g / 2))}
        </text>
      ))}
      {ticks.map((i) => (
        <text
          key={`x${i}`}
          x={X(i).toFixed(1)}
          y={H - 9}
          textAnchor="middle"
          fontSize="11"
          fill={palette.faint}
          fontFamily="Inter,-apple-system,Segoe UI,sans-serif"
        >
          {labels ? labels[i] : i + 1}
        </text>
      ))}
      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke={palette.grid} />
      <path d={areaD} fill={area} />
      {overlay && <path d={path(overlay)} fill="none" stroke={palette.line} strokeWidth="1.8" strokeDasharray="4 4" />}
      <path d={path(cur)} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(n - 1).toFixed(1)} cy={Y(cur[n - 1]).toFixed(1)} r="3" fill={stroke} />
    </svg>
  );
}
