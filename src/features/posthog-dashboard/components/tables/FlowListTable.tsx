import { fmtC, pctVal } from '../../data/format';
import type { FlowRow } from '../../data/metrics';

export function FlowListTable({ rows }: { rows: FlowRow[] }) {
  return (
    <>
      <thead>
        <tr>
          <th>Path</th>
          <th className="phg-num">Users</th>
          <th className="phg-num">Events</th>
          <th className="phg-num">Sessions</th>
          <th className="phg-num">F-comp</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.path}>
            <td style={{ fontWeight: 600 }}>{f.path}</td>
            <td className="phg-num">{fmtC(f.users)}</td>
            <td className="phg-num">{fmtC(f.events)}</td>
            <td className="phg-num">{fmtC(f.sessions)}</td>
            <td className="phg-num" title={f.comp == null ? 'Per-path completion needs a flow_key event property (not instrumented)' : undefined}>
              {pctVal(f.comp)}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
