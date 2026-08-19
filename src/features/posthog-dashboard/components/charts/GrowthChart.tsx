import { useState } from 'react';
import type { GrowthWeek } from '../../data/metrics';

/**
 * Growth accounting: new / returning / resurrected stacked above the zero line,
 * dormant below it. Same geometry and palette as the wireframe; the hover
 * tooltip is the only addition.
 */
export function GrowthChart({ weeks }: { weeks: GrowthWeek[] }) {
  const W = 600, H = 250, pl = 36, pr = 12, pt = 18, pb = 28;
  const n = weeks.length;
  const [tipIdx, setTipIdx] = useState<number | null>(null);
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

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setTipIdx(null)}>
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
        const hitX = pl + i * gap;

        // flip the tooltip to the left near the right edge
        const tipX = i > n - 3 ? hitX - TIP_W - 4 : hitX + (gap - bw) / 2;
        const tipY = Math.max(pt, zero - TIP_H - 8);

        return (
          <g key={w.label + i}>
            <rect
              x={hitX} y={pt} width={gap} height={H - pt - pb + 10}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setTipIdx(i)}
            />
            {rects}
            <rect x={x.toFixed(1)} y={zero.toFixed(1)} width={bw.toFixed(1)} height={Math.max(0, hd).toFixed(1)} fill="var(--chart-red)" />
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--faint)" fontFamily={axisFont}>{w.label}</text>

            {tipIdx === i && (
              <g>
                <rect x={tipX} y={tipY} width={TIP_W} height={TIP_H} rx={8} fill="var(--ink)" />
                <text x={tipX + 11} y={tipY + 17} fontSize={11} fill="var(--on-ink)" opacity={0.62} fontFamily={axisFont}>
                  Week of {w.label}
                </text>
                <circle cx={tipX + 15} cy={tipY + 30} r={4} fill="var(--chart-blue)" />
                <text x={tipX + 24} y={tipY + 34} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>New: {w.nw}</text>

                <circle cx={tipX + 15} cy={tipY + 46} r={4} fill="var(--chart-mint)" />
                <text x={tipX + 24} y={tipY + 50} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>Returning: {w.ret}</text>

                <circle cx={tipX + 15} cy={tipY + 62} r={4} fill="var(--chart-amber)" />
                <text x={tipX + 24} y={tipY + 66} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>Resurrected: {w.res}</text>

                <circle cx={tipX + 15} cy={tipY + 78} r={4} fill="var(--chart-red)" />
                <text x={tipX + 24} y={tipY + 82} fontSize={12} fill="var(--on-ink)" fontFamily={axisFont}>Dormant: {w.dorm}</text>
              </g>
            )}
          </g>
        );
      })}
      <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke="var(--chart-line)" />
    </svg>
  );
}
