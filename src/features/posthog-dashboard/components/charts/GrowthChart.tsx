import type { GrowthWeek } from '../../data/metrics';

export function GrowthChart({ weeks }: { weeks: GrowthWeek[] }) {
  const W = 560, H = 240, pl = 34, pr = 10, pt = 14, pb = 26;
  const n = weeks.length;
  const maxUp = Math.max(...weeks.map((w) => w.nw + w.ret + w.res));
  const maxDn = Math.max(...weeks.map((w) => w.dorm));
  const bw = ((W - pl - pr) / n) * 0.6;
  const gap = (W - pl - pr) / n;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  return (
    <svg className="phg-chart" viewBox={`0 0 ${W} ${H}`}>
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
        return (
          <g key={i}>
            {rects}
            <rect x={x} y={zero} width={bw} height={Math.max(0, hd)} rx={1.5} fill="var(--phg-red)" opacity={0.92} />
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize={9.5} fill="#9b998f">W{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}
