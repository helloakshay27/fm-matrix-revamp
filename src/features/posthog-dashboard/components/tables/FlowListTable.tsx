import { fmtC, pct } from '../../data/format';
import type { FlowRow } from '../../data/metrics';

export function FlowListTable({ rows }: { rows: FlowRow[] }) {
  return (
    <>
      <thead>
        <tr><th>Flow</th><th>F-adopt</th><th>F-comp</th><th>F-vol</th></tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.label}>
            <td style={{ fontWeight: 700 }}>{f.flagship ? '★ ' : ''}{f.label}</td>
            <td className="phg-num">{pct(f.adopt)}</td>
            <td className="phg-num">{pct(f.comp)}</td>
            <td className="phg-num">{fmtC(f.vol)}</td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
