import { useState } from 'react';
import type { GrowthWeek } from '../../data/metrics';

export function GrowthChart({ weeks }: { weeks: GrowthWeek[] }) {
  const W = 560, H = 240, pl = 34, pr = 10, pt = 14, pb = 26;
  const n = weeks.length;
  const [tipIdx, setTipIdx] = useState<number | null>(null);
  if (!n) return null;

  const maxUp = Math.max(0, ...weeks.map((w) => w.nw + w.ret + w.res));
  const maxDn = Math.max(0, ...weeks.map((w) => w.dorm));
  const bw = ((W - pl - pr) / n) * 0.6;
  const gap = (W - pl - pr) / n;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  const TIP_W = 148, TIP_H = 90;

  return (
    <svg
      className="phg-chart"
      viewBox={`0 0 ${W} ${H}`}
      onMouseLeave={() => setTipIdx(null)}
    >
      <line x1={pl} y1={zero} x2={W - pr} y2={zero} stroke="#c9c6ba" />

      {weeks.map((w, i) => {
        const x = pl + i * gap + gap * 0.2;
        let y = zero;
        const segs: { h: number; fill: string }[] = [
          { h: w.nw * scaleUp, fill: 'var(--phg-blue)' },
          { h: w.ret * scaleUp, fill: 'var(--phg-green)' },
          { h: w.res * scaleUp, fill: 'var(--phg-orange)' },
        ];
        const rects = segs.map((seg, si) => {
          y -= seg.h;
          return <rect key={si} x={x} y={y} width={bw} height={Math.max(0, seg.h)} rx={1.5} fill={seg.fill} />;
        });
        const hd = w.dorm * scaleDn;
        const hitX = pl + i * gap;

        // Tooltip positioning — flip to left if near right edge
        const tipX = i > n - 3 ? hitX - TIP_W - 4 : hitX + gap * 0.2;
        const tipY = Math.max(pt, zero - TIP_H - 8);

        return (
          <g key={w.label + i}>
            {/* Invisible wider hit area for hover */}
            <rect
              x={hitX} y={pt} width={gap} height={H - pt - pb + 10}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setTipIdx(i)}
            />
            {rects}
            <rect x={x} y={zero} width={bw} height={Math.max(0, hd)} rx={1.5} fill="var(--phg-red)" opacity={0.92} />
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize={9.5} fill="#9b998f">{w.label}</text>

            {/* Tooltip */}
            {tipIdx === i && (
              <g>
                {/* Highlight column */}
                <rect x={hitX} y={pt} width={gap} height={H - pt - pb} fill="#d97757" opacity={0.06} rx={3} />
                {/* Box */}
                <rect x={tipX} y={tipY} width={TIP_W} height={TIP_H} rx={8} fill="#1c1a17" opacity={0.93} />
                {/* Header */}
                <text x={tipX + 10} y={tipY + 16} fontSize={10} fill="#9b998f" fontWeight="600">
                  Week of {w.label}
                </text>
                {/* Lines */}
                <circle cx={tipX + 14} cy={tipY + 29} r={4} fill="var(--phg-blue)" />
                <text x={tipX + 22} y={tipY + 33} fontSize={11} fill="#fff" fontWeight="600">New: {w.nw}</text>

                <circle cx={tipX + 14} cy={tipY + 45} r={4} fill="var(--phg-green)" />
                <text x={tipX + 22} y={tipY + 49} fontSize={11} fill="#fff" fontWeight="600">Returning: {w.ret}</text>

                <circle cx={tipX + 14} cy={tipY + 61} r={4} fill="var(--phg-orange)" />
                <text x={tipX + 22} y={tipY + 65} fontSize={11} fill="#fff" fontWeight="600">Resurrected: {w.res}</text>

                <circle cx={tipX + 14} cy={tipY + 77} r={4} fill="var(--phg-red)" />
                <text x={tipX + 22} y={tipY + 81} fontSize={11} fill="#fff" fontWeight="600">Dormant: {w.dorm}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
