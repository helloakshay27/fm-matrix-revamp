import { pct } from '../../data/format';
import { TrendArrow } from '../DeltaArrow';
import type { SiteHealthRow } from '../../data/metrics';

function statusFor(row: SiteHealthRow): [string, string] {
  if (row.drop) return ['st-drop', '⚑ Sudden drop'];
  if (row.util < 0.55) return ['st-watch', 'Watch'];
  return ['st-healthy', 'Healthy'];
}

export function SiteHealthTable({ rows }: { rows: SiteHealthRow[] }) {
  return (
    <>
      <thead>
        <tr>
          <th>Site</th><th>Region</th><th>Seat util (A1)</th><th>Trend (A3)</th><th>Flagship completion</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const [cls, label] = statusFor(r);
          return (
            <tr key={r.name}>
              <td style={{ fontWeight: 700 }}>{r.name}</td>
              <td>{r.region}</td>
              <td className="phg-num">
                <span className="phg-minibar"><i style={{ width: `${Math.round(r.util * 100)}%`, background: r.util < 0.55 ? 'var(--phg-amber)' : 'var(--phg-green)' }} /></span>
                {pct(r.util)}
              </td>
              <td className="phg-num"><TrendArrow delta={r.trend} goodUp /> {r.trend > 0 ? '+' : ''}{r.trend}%</td>
              <td className="phg-num">{pct(r.comp)}</td>
              <td><span className={`phg-status ${cls}`}>{label}</span></td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
