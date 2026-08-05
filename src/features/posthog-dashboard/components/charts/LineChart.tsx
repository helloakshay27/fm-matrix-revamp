import { useId, useRef, useState } from 'react';
import { fmtC } from '../../data/format';

interface LineChartProps {
  cur: number[];
  prev?: number[];
  showPrev?: boolean;
  labels?: string[]; // date labels per point, e.g. ['Jul 28', 'Jul 29', ...]
}

interface Tooltip {
  x: number;    // pixel x in SVG viewBox
  y: number;    // pixel y in SVG viewBox
  idx: number;
  curVal: number;
  prevVal?: number;
  label?: string;
}

/** Usage/adoption-trend line chart with hover tooltip. */
export function LineChart({ cur, prev, showPrev = true, labels }: LineChartProps) {
  const gid = `phg-lg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<Tooltip | null>(null);

  const W = 640, H = 240, pl = 44, pr = 14, pt = 14, pb = 26;
  if (cur.length < 2) return null;

  const all = [...cur, ...(prev ?? [])];
  const mx = Math.max(...all) * 1.12 || 1;
  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / mx);
  const pathStr = (arr: number[]) =>
    arr.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');

  const gridLines: { y: number; val: number }[] = [];
  for (let g = 0; g <= 4; g++) {
    const y = pt + ((H - pt - pb) * g) / 4;
    gridLines.push({ y, val: Math.round(mx * (1 - g / 4)) });
  }

  let areaD = '';
  for (let i = 0; i < n - 1; i++) areaD += `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(cur[i]).toFixed(1)} `;
  areaD += `L${X(n - 2).toFixed(1)} ${H - pb} L${X(0).toFixed(1)} ${H - pb} Z`;

  // Convert mouse position to SVG viewBox coordinates
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    // Find the closest data point index
    const idx = Math.min(n - 1, Math.max(0, Math.round((mouseX - pl) / xw)));
    setTip({
      x: X(idx),
      y: Y(cur[idx]),
      idx,
      curVal: cur[idx],
      prevVal: prev?.[idx],
      label: labels?.[idx],
    });
  };

  const TIP_W = 130, TIP_H = prev && showPrev ? 66 : 48;
  const tipX = tip ? Math.min(tip.x + 10, W - TIP_W - 4) : 0;
  const tipY = tip ? Math.max(pt, tip.y - TIP_H / 2) : 0;

  return (
    <svg
      ref={svgRef}
      className="phg-chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTip(null)}
      style={{ cursor: 'crosshair' }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97757" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#d97757" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={pl} y1={g.y} x2={W - pr} y2={g.y} stroke="#efece2" strokeDasharray="3 4" />
          <text x={pl - 8} y={g.y + 4} textAnchor="end" fontSize={10} fill="#9b998f">{fmtC(g.val)}</text>
        </g>
      ))}

      {/* Previous period */}
      {prev && prev.length > 1 && showPrev && (
        <path d={pathStr(prev)} fill="none" stroke="#b0aea5" strokeWidth={2} strokeDasharray="5 4" opacity={0.8} />
      )}

      {/* Area fill + current line */}
      <path d={areaD} fill={`url(#${gid})`} />
      <path d={pathStr(cur.slice(0, n - 1))} fill="none" stroke="var(--phg-orange)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={`M${X(n - 2).toFixed(1)} ${Y(cur[n - 2]).toFixed(1)} L${X(n - 1).toFixed(1)} ${Y(cur[n - 1]).toFixed(1)}`}
        fill="none" stroke="#b0aea5" strokeWidth={2.6} strokeDasharray="5 4"
      />
      <circle cx={X(n - 1)} cy={Y(cur[n - 1])} r={6.4} fill="var(--phg-orange)" opacity={0.16} />
      <circle cx={X(n - 1)} cy={Y(cur[n - 1])} r={3.2} fill="var(--phg-orange)" />

      {/* Hover crosshair + tooltip */}
      {tip && (
        <g>
          {/* Vertical guide line */}
          <line
            x1={tip.x} y1={pt} x2={tip.x} y2={H - pb}
            stroke="#d97757" strokeWidth={1} strokeDasharray="3 3" opacity={0.6}
          />
          {/* Dot on current line */}
          <circle cx={tip.x} cy={tip.y} r={5} fill="var(--phg-orange)" stroke="#fff" strokeWidth={2} />
          {/* Dot on prev line */}
          {tip.prevVal !== undefined && showPrev && (
            <circle cx={tip.x} cy={Y(tip.prevVal)} r={4} fill="#b0aea5" stroke="#fff" strokeWidth={1.5} />
          )}

          {/* Tooltip box */}
          <rect
            x={tipX} y={tipY}
            width={TIP_W} height={TIP_H}
            rx={8} ry={8}
            fill="#1c1a17" opacity={0.93}
          />
          {/* Label / date */}
          <text x={tipX + 10} y={tipY + 16} fontSize={10} fill="#9b998f" fontWeight="600">
            {tip.label ?? `Point ${tip.idx + 1}`}
          </text>
          {/* Current value */}
          <text x={tipX + 10} y={tipY + 32} fontSize={13} fill="#fff" fontWeight="700">
            {fmtC(tip.curVal)}
          </text>
          <text x={tipX + 10 + String(fmtC(tip.curVal)).length * 7.5} y={tipY + 32} fontSize={10} fill="#d97757" fontWeight="600">
            {' '}current
          </text>
          {/* Prev value */}
          {tip.prevVal !== undefined && showPrev && (
            <>
              <text x={tipX + 10} y={tipY + 52} fontSize={11} fill="#b0aea5" fontWeight="600">
                {fmtC(tip.prevVal)} prev
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  );
}
