import { useRef, useState } from 'react';
import type { GrowthWeek } from '../../data/metrics';

/**
 * Growth accounting: new / returning / resurrected stacked above the zero line,
 * dormant below it. Same geometry and palette as the wireframe; the hover
 * tooltip is self-contained within this chart's bounds.
 */
export function GrowthChart({ weeks }: { weeks: GrowthWeek[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tipIdx, setTipIdx] = useState<number | null>(null);

  const W = 600, H = 250, pl = 36, pr = 12, pt = 18, pb = 28;
  const n = weeks.length;
  if (!n) return null;

  const maxUp = Math.max(0, ...weeks.map((w) => w.nw + w.ret + w.res));
  const maxDn = Math.max(0, ...weeks.map((w) => w.dorm));
  const gap = (W - pl - pr) / n;
  const bw = gap * 0.5;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  const TIP_W = 150, TIP_H = 92;
  const axisFont = 'Inter,-apple-system,Segoe UI,sans-serif';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    if (mouseX < pl || mouseX > W - pr) {
      setTipIdx(null);
      return;
    }
    const idx = Math.floor((mouseX - pl) / gap);
    if (idx >= 0 && idx < n) {
      setTipIdx(idx);
    } else {
      setTipIdx(null);
    }
  };

  const selectedWeek = tipIdx != null && tipIdx >= 0 && tipIdx < n ? weeks[tipIdx] : null;
  let tipX = 0;
  let tipY = 0;
  if (tipIdx != null && selectedWeek) {
    const hitX = pl + tipIdx * gap;
    const rawX = tipIdx >= Math.floor(n / 2) ? hitX - TIP_W - 8 : hitX + gap + 8;
    tipX = Math.max(pl, Math.min(rawX, W - pr - TIP_W));
    tipY = Math.max(pt, Math.min(zero - TIP_H / 2, H - pb - TIP_H));
  }

  return (
    <svg
      ref={svgRef}
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTipIdx(null)}
      style={{ cursor: 'crosshair', overflow: 'hidden' }}
    >
      {weeks.map((w, i) => {
        const x = pl + i * gap + (gap - bw) / 2;
        let y = zero;
        const segs: { h: number; fill: string }[] = [
          { h: w.nw * scaleUp, fill: 'var(--chart-blue)' },
          { h: w.ret * scaleUp, fill: 'var(--chart-mint)' },
          { h: w.res * scaleUp, fill: 'var(--chart-amber)' },
        ];
        const rects = segs.map((seg, si) => {
          y -= seg.h;
          return <rect key={si} x={x.toFixed(1)} y={y.toFixed(1)} width={bw.toFixed(1)} height={Math.max(0, seg.h).toFixed(1)} fill={seg.fill} />;
        });
        const hd = w.dorm * scaleDn;

        return (
          <g key={w.label + i}>
            {rects}
            <rect x={x.toFixed(1)} y={zero.toFixed(1)} width={bw.toFixed(1)} height={Math.max(0, hd).toFixed(1)} fill="var(--chart-red)" />
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--faint)" fontFamily={axisFont}>{w.label}</text>
          </g>
        );
      })}
      <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke="var(--chart-line)" />

      {selectedWeek && tipIdx != null && (
        <g style={{ pointerEvents: 'none' }}>
          <rect x={tipX} y={tipY} width={TIP_W} height={TIP_H} rx={8} fill="var(--ink)" />
          <text x={tipX + 11} y={tipY + 17} fontSize={11} fill="var(--on-ink)" opacity={0.62} fontFamily={axisFont}>
            Week of {selectedWeek.label}
          </text>
          <circle cx={tipX + 15} cy={tipY + 30} r={4} fill="var(--chart-blue)" />
          <text x={tipX + 24} y={tipY + 34} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>New: {selectedWeek.nw}</text>

          <circle cx={tipX + 15} cy={tipY + 46} r={4} fill="var(--chart-mint)" />
          <text x={tipX + 24} y={tipY + 50} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>Returning: {selectedWeek.ret}</text>

          <circle cx={tipX + 15} cy={tipY + 62} r={4} fill="var(--chart-amber)" />
          <text x={tipX + 24} y={tipY + 66} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>Resurrected: {selectedWeek.res}</text>

          <circle cx={tipX + 15} cy={tipY + 78} r={4} fill="var(--chart-red)" />
          <text x={tipX + 24} y={tipY + 82} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>Dormant: {selectedWeek.dorm}</text>
        </g>
      )}
    </svg>
  );
}
