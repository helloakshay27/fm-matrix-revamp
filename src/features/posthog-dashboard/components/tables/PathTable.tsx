import { fmtC, pct } from '../../data/format';
import { TrendArrow } from '../DeltaArrow';
import type { PathRow } from '../../data/metrics';

export function PathTable({ rows }: { rows: PathRow[] }) {
  return (
    <>
      <thead>
        <tr><th>Initial path</th><th className="phg-num">Visitors</th><th className="phg-num">Views</th><th className="phg-num">Bounce</th></tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.path}>
            <td style={{ fontWeight: 600 }}>{p.path}</td>
            <td className="phg-num">{fmtC(p.vis)} <TrendArrow delta={p.dv} goodUp /></td>
            <td className="phg-num">{fmtC(p.vw)} <TrendArrow delta={p.dw} goodUp /></td>
            <td className="phg-num">{pct(p.bo, 1)} <TrendArrow delta={p.db} goodUp={false} /></td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
