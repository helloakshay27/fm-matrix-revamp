import { fmtC, pct } from '../../data/format';
import { TrendArrow } from '../DeltaArrow';
import type { RegionRow } from '../../data/metrics';

export function RegionTable({ rows }: { rows: RegionRow[] }) {
  return (
    <>
      <thead>
        <tr><th>Region</th><th>Sites</th><th>Active users</th><th>Seat util (A1)</th><th>Trend (A3)</th><th>Status</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const watch = r.util < 0.55;
          return (
            <tr key={r.reg}>
              <td style={{ fontWeight: 700 }}>{r.reg}</td>
              <td>{r.sites}</td>
              <td className="phg-num">{fmtC(r.wau)}</td>
              <td className="phg-num">{pct(r.util)}</td>
              <td className="phg-num"><TrendArrow delta={r.trend} goodUp /> {r.trend > 0 ? '+' : ''}{r.trend}%</td>
              <td><span className={`phg-status ${watch ? 'st-watch' : 'st-healthy'}`}>{watch ? 'Watch' : 'Healthy'}</span></td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
