import { pct } from '../../data/format';

export interface BarRow {
  name: string;
  share: number;
  color: string;
}

/** Generic labelled horizontal-bar row group, used for device split and role-adoption bars. */
export function HorizontalBars({ rows }: { rows: BarRow[] }) {
  return (
    <div className="hbars">
      {rows.map((r) => (
        <div className="role" key={r.name}>
          <div className="rn">{r.name}</div>
          <div className="rbar"><i style={{ width: `${Math.round(r.share * 100)}%`, background: r.color }} /></div>
          <div className="rv">{pct(r.share)}</div>
        </div>
      ))}
    </div>
  );
}
