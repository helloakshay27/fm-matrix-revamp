import { useRef, useState } from 'react';
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

/**
 * Usage / adoption-trend line chart, drawn to the wireframe's house style:
 * no frame, faint vertical dashed gridlines on the x-label positions only,
 * three plain grey y-numbers at the left, one saturated data colour and one
 * pale area fill. The hover tooltip is the only addition over the wireframe.
 */
export function LineChart({ cur, prev, showPrev = true, labels }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<Tooltip | null>(null);

  const W = 680, H = 250, pl = 44, pr = 14, pt = 16, pb = 30;
  if (cur.length < 2) return null;

  const usePrev = !!prev && prev.length > 1 && showPrev;
  const all = [...cur, ...(usePrev ? prev! : [])];
  const mx = Math.max(...all) * 1.14 || 1;
  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / mx);
  const base = H - pb;
  const pathStr = (arr: number[]) =>
    arr.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');

  // gridlines + x labels sit on the same positions, at most ~6 across the range
  const step = Math.max(1, Math.ceil(n / 6));
  const ticks: number[] = [];
  for (let i = 0; i < n; i += step) ticks.push(i);

  const yLabels: { y: number; val: number }[] = [];
  for (let g = 0; g <= 2; g++) {
    yLabels.push({ y: pt + ((H - pt - pb) * g) / 2, val: Math.round(mx * (1 - g / 2)) });
  }

  let areaD = '';
  for (let i = 0; i < n - 1; i++) areaD += `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(cur[i]).toFixed(1)} `;
  areaD += `L${X(n - 2).toFixed(1)} ${base} L${X(0).toFixed(1)} ${base} Z`;

  // Convert mouse position to SVG viewBox coordinates
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
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

  const TIP_W = 132, TIP_H = usePrev ? 66 : 48;
  const tipX = tip ? Math.min(tip.x + 10, W - TIP_W - 4) : 0;
  const tipY = tip ? Math.max(pt, tip.y - TIP_H / 2) : 0;

  const axisFont = 'Inter,-apple-system,Segoe UI,sans-serif';

  return (
    <svg
      ref={svgRef}
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTip(null)}
      style={{ cursor: 'crosshair' }}
    >
      {/* vertical dashed gridlines + x labels */}
      {ticks.map((i) => (
        <g key={i}>
          <line x1={X(i).toFixed(1)} y1={pt} x2={X(i).toFixed(1)} y2={base} stroke="var(--chart-grid)" strokeDasharray="2 4" />
          <text x={X(i).toFixed(1)} y={H - 9} textAnchor="middle" fontSize={11} fill="var(--faint)" fontFamily={axisFont}>
            {labels?.[i] ?? i + 1}
          </text>
        </g>
      ))}

      {/* y scale */}
      {yLabels.map((g, i) => (
        <text key={i} x={pl - 11} y={g.y + 4} textAnchor="end" fontSize={11} fill="var(--faint)" fontFamily={axisFont}>
          {fmtC(g.val)}
        </text>
      ))}

      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke="var(--chart-grid)" />

      {/* area fill, previous period, current line */}
      <path d={areaD} fill="var(--chart-fill)" />
      {usePrev && (
        <path d={pathStr(prev!)} fill="none" stroke="var(--chart-line)" strokeWidth={1.8} strokeDasharray="4 4" />
      )}
      <path d={pathStr(cur.slice(0, n - 1))} fill="none" stroke="var(--chart-blue)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={`M${X(n - 2).toFixed(1)} ${Y(cur[n - 2]).toFixed(1)} L${X(n - 1).toFixed(1)} ${Y(cur[n - 1]).toFixed(1)}`}
        fill="none" stroke="var(--chart-line)" strokeWidth={2.2} strokeDasharray="4 4"
      />
      <circle cx={X(n - 1).toFixed(1)} cy={Y(cur[n - 1]).toFixed(1)} r={3} fill="var(--chart-blue)" />

      {/* Hover crosshair + tooltip */}
      {tip && (
        <g>
          <line
            x1={tip.x} y1={pt} x2={tip.x} y2={base}
            stroke="var(--chart-line)" strokeWidth={1} strokeDasharray="3 3"
          />
          <circle cx={tip.x} cy={tip.y} r={4.5} fill="var(--chart-blue)" stroke="var(--surface)" strokeWidth={2} />
          {tip.prevVal !== undefined && usePrev && (
            <circle cx={tip.x} cy={Y(tip.prevVal)} r={3.5} fill="var(--chart-line)" stroke="var(--surface)" strokeWidth={1.5} />
          )}

          <rect x={tipX} y={tipY} width={TIP_W} height={TIP_H} rx={8} ry={8} fill="var(--ink)" />
          <text x={tipX + 11} y={tipY + 17} fontSize={11} fill="var(--on-ink)" opacity={0.62} fontFamily={axisFont}>
            {tip.label ?? `Point ${tip.idx + 1}`}
          </text>
          <text x={tipX + 11} y={tipY + 34} fontSize={13} fontWeight={500} fill="var(--on-ink)" fontFamily={axisFont}>
            {fmtC(tip.curVal)} current
          </text>
          {tip.prevVal !== undefined && usePrev && (
            <text x={tipX + 11} y={tipY + 53} fontSize={12} fill="var(--on-ink)" opacity={0.62} fontFamily={axisFont}>
              {fmtC(tip.prevVal)} previous
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
