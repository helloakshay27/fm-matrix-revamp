import { fmtC, fmtDur, pctVal } from '../../data/format';
import { TrendArrow } from '../DeltaArrow';
import type { SiteHealthRow } from '../../data/metrics';

function statusFor(row: SiteHealthRow): [string, string] {
  if (row.users === 0) return ['st-drop', 'No activity'];
  if (row.trend != null && row.trend <= -25) return ['st-drop', '⚑ Sudden drop'];
  if (row.bounce >= 40 || (row.trend != null && row.trend < 0)) return ['st-watch', 'Watch'];
  return ['st-healthy', 'Healthy'];
}

interface SiteHealthTableProps {
  rows: SiteHealthRow[];
  /** When provided, each row becomes a button that scopes the dashboard to that site. */
  onSelect?: (siteId: string) => void;
}

export function SiteHealthTable({ rows, onSelect }: SiteHealthTableProps) {
  const peak = Math.max(1, ...rows.map((r) => r.users));

  return (
    <>
      <thead>
        <tr>
          <th>Site</th>
          <th className="phg-num">Active users (U1)</th>
          <th className="phg-num">Sessions (U3)</th>
          <th className="phg-num">Avg session (U5)</th>
          <th className="phg-num">Bounce (U6)</th>
          <th className="phg-num">Trend</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const [cls, label] = statusFor(r);
          const fill = r.users / peak;
          return (
            <tr
              key={r.siteId}
              className={onSelect ? 'phg-rowlink' : undefined}
              onClick={onSelect ? () => onSelect(r.siteId) : undefined}
              title={onSelect ? `Scope the dashboard to ${r.name}` : undefined}
            >
              <td style={{ fontWeight: 700 }}>{r.name}</td>
              <td className="phg-num">
                <span className="phg-minibar">
                  <i style={{ width: `${Math.round(fill * 100)}%`, background: fill < 0.4 ? 'var(--phg-amber)' : 'var(--phg-green)' }} />
                </span>
                {fmtC(r.users)}
              </td>
              <td className="phg-num">{fmtC(r.sessions)}</td>
              <td className="phg-num">{fmtDur(r.durSec)}</td>
              <td className="phg-num">{pctVal(r.bounce)}</td>
              <td className="phg-num">
                {r.trend == null ? '—' : (
                  <><TrendArrow delta={r.trend} goodUp /> {r.trend > 0 ? '+' : ''}{r.trend}%</>
                )}
              </td>
              <td><span className={`phg-status ${cls}`}>{label}</span></td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
