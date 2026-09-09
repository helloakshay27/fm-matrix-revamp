import type { SocietyRow } from '../../data/metrics';

const ARROW = { up: '↗', dn: '↘', flat: '→' } as const;

/** "Society-wise breakdown" (A11) — wireframe's league table markup. */
export function SocietyTable({ rows }: { rows: SocietyRow[] }) {
  return (
    <table className="league">
      <thead>
        <tr>
          <th>Society</th>
          <th className="num">Active users</th>
          <th className="num">Sessions</th>
          <th className="num">Avg session</th>
          <th className="num">Bounce</th>
          <th>Trend</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.society}>
            <td className="strong">{r.society}</td>
            <td className="num">{r.active.toLocaleString()}</td>
            <td className="num">{r.sessions.toLocaleString()}</td>
            <td className="num">{r.avgSession}</td>
            <td className="num">{r.bounce}%</td>
            <td><span className={`arrow ${r.trend}`}>{ARROW[r.trend]}</span></td>
            <td><span className={`status ${r.statusClass}`}>{r.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
