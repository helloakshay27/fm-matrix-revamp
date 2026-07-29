import { pct } from '../../data/format';

export interface BarRow {
  name: string;
  share: number;
  color: string;
}

/** Generic labelled horizontal-bar row group, used for device split and role-adoption bars. */
export function HorizontalBars({ rows }: { rows: BarRow[] }) {
  return (
    <div className="phg-hbars">
      {rows.map((r) => (
        <div className="phg-role" key={r.name}>
          <div className="phg-rn">{r.name}</div>
          <div className="phg-rbar"><i style={{ width: `${Math.round(r.share * 100)}%`, background: r.color }} /></div>
          <div className="phg-rv">{pct(r.share)}</div>
        </div>
      ))}
    </div>
  );
}
