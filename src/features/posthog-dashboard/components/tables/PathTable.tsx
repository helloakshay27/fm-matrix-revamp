import { fmtC, pctVal } from '../../data/format';
import { TrendArrow } from '../DeltaArrow';
import type { PathRow } from '../../data/metrics';

/** API trends are already percentages and can be null when the previous period had nothing. */
function Trend({ delta, goodUp }: { delta: number | null; goodUp: boolean }) {
  if (delta == null) return null;
  return <TrendArrow delta={delta} goodUp={goodUp} />;
}

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
            <td className="phg-num">{fmtC(p.vis)} <Trend delta={p.dv} goodUp /></td>
            <td className="phg-num">{fmtC(p.vw)} <Trend delta={p.dw} goodUp /></td>
            <td className="phg-num">{pctVal(p.bo)} <Trend delta={p.db} goodUp={false} /></td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
